"use client"

import React, { useEffect, useState } from 'react'
import { db } from '../../../../../utils/db'
import { MockInterview } from '../../../../../utils/schema'
import { eq } from 'drizzle-orm'
import QuestionsSection from './_components/questionsSection'
import { Button } from '../../../../../components/ui/button'
import Link from 'next/link'
import { Mic, StopCircle, WebcamIcon } from 'lucide-react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { chatSession } from '../../../../../utils/geminiAIModal';
import { UserAnswer } from '../../../../../utils/schema'
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function StartInterview({params}) {

    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const [userAnswer, setUserAnswer] = useState('');
    const {user} = useUser();
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });
    
    const getInterviewDetails=async()=>{
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
        const jsonMockResponse = JSON.parse(result[0].jsonMockResponse);
        // console.log(jsonMockResponse);
        setMockInterviewQuestion(jsonMockResponse);
        setInterviewData(result[0]);
        // console.log(interviewData);
    };

    useEffect(()=>{
        getInterviewDetails();
    }, []);

    useEffect(()=>{
        results.map((result)=>{
            setUserAnswer(prevAns=>prevAns+result?.transcript)
        })
      },[results]);

    useEffect(()=>{
        if(!isRecording && userAnswer.length > 10){
            updateUserAnswer();
        }
    },[userAnswer]);

    const startStopRecording=async()=>{
        if(isRecording){
            stopSpeechToText();
            if(userAnswer?.length < 10){
                setUserAnswer('');
                setLoading(false);
                toast("Error saving your answer. Please record again.")
                return;
            }
        }
        else{
            startSpeechToText();
        }
    };

    const updateUserAnswer=async()=>{
        //console.log(mockInterviewQuestion[activeQuestionIndex]?.question);

        setLoading(true);
        const feedbackPrompt = "Question: "+mockInterviewQuestion[activeQuestionIndex]?.Question+
        ", User answer: "+userAnswer+". Given the interview question and user's answer, please "+
        "provide rating(1-10) and feedback as area of improvement for the user's answer. Provide, the "+
        "feedback in 3-5 sentences from 2nd person POV in JSON format as rating field and feedback field.";
        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJsonResponse = result.response.text().replace('```json','').replace('```', '');
        console.log(mockJsonResponse);
        const jsonFeedbackResponse = JSON.parse(mockJsonResponse);
        console.log(mockInterviewQuestion[activeQuestionIndex]);
        
        const response = await db.insert(UserAnswer).values({
            mockIdReference: interviewData?.mockId,
            question: mockInterviewQuestion[activeQuestionIndex]?.Question,
            correctAnswer: mockInterviewQuestion[activeQuestionIndex]?.Answer,
            userAnswer: userAnswer,
            feedback: jsonFeedbackResponse?.feedback,
            rating: jsonFeedbackResponse?.rating,
            userEmail: user?.primaryEmailAddress.emailAddress,
            createdOn: moment().format('DD-MM-yyyy')
        });
        if(response){
            toast('Answer recored successfully');
            setUserAnswer('');
            setResults([]);
        }
        setResults([]);
        setLoading(false);
    };

  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* Questions */}
            {mockInterviewQuestion ? (
                <QuestionsSection 
                mockInterviewQuestion={mockInterviewQuestion}
                activeQuestionIndex={activeQuestionIndex}
                setActiveQuestionIndex={setActiveQuestionIndex}/>
            ):(
                <div>Loading...</div>
            )}
            {/* Video/audio recording */}
            <div className='flex items-center justify-center flex-col'>
                <div className='flex flex-col mt-20 justify-center items-center bg-gray-300 rounded-lg p-5'>
                    <WebcamIcon width={200} height={200} className='absolute'/>
                    <Webcam mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                    }}
                    />
                </div>
                <Button disable={loading} variant='outline' className='my-10 w-60 h-14' onClick={startStopRecording}>
                    {isRecording? 
                    <h2 className='text-red-600 text-lg animate-pulse flex gap-2 items-center'>
                        <StopCircle/>Stop Recording
                    </h2>
                    :
                    <h2 className='text-primary flex gap-2 items-center text-lg'>
                        <Mic/>Record Answer
                    </h2>
                    
                    }
                </Button>
                {/* <Button onClick={()=>console.log(userAnswer)}>Show User Answer</Button> */}
                
            </div>
            
        </div>
        <div className='flex justify-end gap-6'>
            {activeQuestionIndex > 0 && 
            <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
            {activeQuestionIndex != (mockInterviewQuestion?.length-1) && 
            <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
            {activeQuestionIndex == (mockInterviewQuestion?.length-1) &&
            <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}><Button>End Interview</Button></Link>}
        </div>
    </div>
  );
}

export default StartInterview

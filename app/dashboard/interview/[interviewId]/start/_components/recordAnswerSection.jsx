"use client"

import { Mic, StopCircle, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from '../../../../../../components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { chatSession } from '../../../../../../utils/geminiAIModal';
import db from '../../../../../../utils/db'
import { UserAnswer } from '../../../../../../utils/schema'
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function RecordAnswerSection(mockInterviewQuestion, activeQuestionIndex, interviewData) {

    const [userAnswer, setUserAnswer] = useState('');
    const {user} = useUser();
    const [loading, setLoading] = useState(false);
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

      useEffect(()=>{
        results.map((result)=>{
            setUserAnswer(prevAns=>prevAns+result?.transcript)
        })
      },[results])

      useEffect(()=>{
        if(!isRecording && userAnswer.length > 10){
            updateUserAnswer();
        }
      },[userAnswer])

      const startStopRecording=async()=>{
        if(isRecording){
            stopSpeechToText();
            // if(userAnswer?.length < 10){
            //     setUserAnswer('');
            //     setLoading(false);
            //     toast("Error saving your answer. Please record again.")
            //     return;
            // }
        }
        else{
            startSpeechToText();
        }
      }

      // if (!interviewData) {
      //   return <div>Loading interview data...</div>;
      // }

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
        // if(!interviewData){
            // console.log(interviewData)
        // }
        const response = await db.insert(UserAnswer).values({
            mockIdReference: interviewData?.mockId,
            question: mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAnswer: mockInterviewQuestion[activeQuestionIndex]?.answer,
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
      }

  return (
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
        <Button disable={loading} variant='outline' className='my-10' onClick={startStopRecording}>
            {isRecording? 
            <h2 className='text-red-600 animate-pulse flex gap-2 items-center'>
                <StopCircle/>Stop Recording
            </h2>
            :
            <h2 className='text-primary flex gap-2 items-center'>
                <Mic/>Record Answer
            </h2>
            
            }
        </Button>
        {/* <Button onClick={()=>console.log(userAnswer)}>Show User Answer</Button> */}
        
    </div>
  )
}

export default RecordAnswerSection

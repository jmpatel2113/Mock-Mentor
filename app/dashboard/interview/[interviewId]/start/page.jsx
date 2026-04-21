"use client"

import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/questionsSection'
import { Button } from '../../../../../components/ui/button'
import Link from 'next/link'
import { Mic, StopCircle, WebcamIcon } from 'lucide-react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';

function StartInterview({params}) {

    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isSavingAnswer, setIsSavingAnswer] = useState(false);
    
    const [userAnswer, setUserAnswer] = useState('');
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
        try {
            const response = await fetch(`/api/interviews/${params.interviewId}`, {
                credentials: 'include',
                cache: 'no-store',
            });
            const result = await response.json();
            if (!response.ok || !result?.interview) {
                throw new Error(result.error || 'Interview not found');
            }
            const jsonMockResponse = JSON.parse(result.interview.jsonMockResponse);
            setMockInterviewQuestion(jsonMockResponse);
            setInterviewData(result.interview);
        } catch (error) {
            toast(error.message || 'Failed to load interview');
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        getInterviewDetails();
    }, []);

    useEffect(()=>{
        if (!results.length) return;
        const latestResult = results[results.length - 1];
        if (latestResult?.transcript) {
            setUserAnswer((prevAns)=>`${prevAns} ${latestResult.transcript}`.trim());
        }
      },[results]);

    const startStopRecording=async()=>{
        if(isRecording){
            stopSpeechToText();
            if(userAnswer?.length < 10){
                setUserAnswer('');
                setLoading(false);
                toast("Error saving your answer. Please record again.")
                return;
            }
            await updateUserAnswer();
        }
        else{
            startSpeechToText();
        }
    };

    const updateUserAnswer=async()=>{
        if (isSavingAnswer || !mockInterviewQuestion?.[activeQuestionIndex] || !interviewData?.mockId) {
            return;
        }

        setLoading(true);
        setIsSavingAnswer(true);
        try {
            const response = await fetch(`/api/interviews/${params.interviewId}/answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    question: mockInterviewQuestion[activeQuestionIndex]?.Question,
                    correctAnswer: mockInterviewQuestion[activeQuestionIndex]?.Answer,
                    userAnswer,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error saving answer. Please try again.');
            }

            toast(result.message || 'Answer recorded successfully');
            setUserAnswer('');
            setResults([]);
        } catch (error) {
            console.error(error);
            toast(error.message || 'Error saving answer. Please try again.');
        } finally {
            setResults([]);
            setLoading(false);
            setIsSavingAnswer(false);
        }
    };

  return (
    <div className='space-y-8'>
        <section className='surface-panel px-6 py-8 sm:px-8'>
            <span className='eyebrow'>Live interview</span>
            <h1 className='mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl'>
                Answer clearly. Review later. Keep the interface out of your way.
            </h1>
            <p className='mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg'>
                Use the question navigator on the left, record your answer on the right, and move through the session one question at a time.
            </p>
        </section>

        <div className='grid grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.1fr]'>
            {/* Questions */}
            {mockInterviewQuestion ? (
                <QuestionsSection 
                mockInterviewQuestion={mockInterviewQuestion}
                activeQuestionIndex={activeQuestionIndex}
                setActiveQuestionIndex={setActiveQuestionIndex}/>
            ):(
                <div className='surface-panel p-6 text-sm text-slate-500'>Loading...</div>
            )}
            {/* Video/audio recording */}
            <div className='surface-panel flex flex-col p-6 sm:p-8'>
                <div className='rounded-[28px] border border-[#d8e2dc] bg-[linear-gradient(180deg,#f6fbf9,#edf5f2)] p-5'>
                    <div className='mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#1f5d55]'>Recording panel</div>
                    <div className='flex flex-col justify-center items-center rounded-[24px] bg-white p-4'>
                    <WebcamIcon width={200} height={200} className='absolute text-slate-300'/>
                    <Webcam mirrored={true}
                    style={{
                        height: 320,
                        width: '100%',
                        zIndex: 10,
                        borderRadius: 20,
                    }}
                    />
                    </div>
                </div>
                <Button disabled={loading} variant='outline' className='my-8 h-14 w-full rounded-full border-[#cdbfa9] bg-[#fff8ed] text-base hover:bg-[#f4ead9]' onClick={startStopRecording}>
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
                <div className='rounded-[24px] bg-slate-900 p-6 text-white'>
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <div className='text-sm uppercase tracking-[0.16em] text-slate-300'>Transcript preview</div>
                            <div className='mt-2 text-lg font-semibold text-white'>
                                {isRecording ? 'Listening now' : 'Latest captured answer'}
                            </div>
                        </div>
                        <div className='rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200'>
                            Question {activeQuestionIndex + 1}
                        </div>
                    </div>
                    <p className='mt-4 min-h-28 text-sm leading-7 text-slate-200'>
                        {userAnswer || interimResult || 'Your spoken answer will appear here while you record.'}
                    </p>
                </div>
            </div>
            
        </div>
        <div className='flex flex-wrap justify-end gap-4'>
            {activeQuestionIndex > 0 && 
            <Button className='rounded-full border-[#cdbfa9] bg-white hover:bg-[#f4ead9]' variant='outline' onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
            {activeQuestionIndex != (mockInterviewQuestion?.length-1) && 
            <Button className='rounded-full bg-[#14636e] text-white hover:bg-[#0f4d56]' onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
            {activeQuestionIndex == (mockInterviewQuestion?.length-1) &&
            <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}><Button className='rounded-full bg-slate-900 text-white hover:bg-slate-700'>End Interview</Button></Link>}
        </div>
    </div>
  );
}

export default StartInterview

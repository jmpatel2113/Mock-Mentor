"use client"

import { Lightbulb, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from '../../../../components/ui/button';
import Link from 'next/link'
import { toast } from 'sonner'

function Interview({params}) {

    const [interviewData, setInterviewData] = useState();
    const [webcamEnabled, setWebcamEnabled] = useState(false);

    useEffect(()=>{
        getInterviewDetails();
    }, [])

    const getInterviewDetails = async() =>{
        try {
            const response = await fetch(`/api/interviews/${params.interviewId}`, {
                credentials: 'include',
                cache: 'no-store',
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to load interview');
            }

            setInterviewData(result.interview);
        } catch (error) {
            toast(error.message || 'Failed to load interview');
        }
    }

  return (
    <div className='space-y-8'>
        <section className='surface-panel px-6 py-8 sm:px-8'>
            <span className='eyebrow'>Interview setup</span>
            <h1 className='mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl'>
                Set your space, check your devices, and then begin.
            </h1>
            <p className='mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg'>
                This screen is the handoff between setup and the actual interview. Confirm the role details, enable your devices, and start when you are ready.
            </p>
        </section>

        <div className='grid grid-cols-1 gap-8 xl:grid-cols-[0.95fr_1.05fr]'>
            <div className='flex flex-col gap-6'>
                {interviewData ? (
                    <div className='surface-panel p-6'>
                        <div className='text-sm font-semibold uppercase tracking-[0.16em] text-[#1f5d55]'>Session brief</div>
                        <div className='mt-5 space-y-4 text-sm leading-7 text-slate-600'>
                            <div className='rounded-[22px] bg-[#fffaf2] p-4'>
                                <strong className='block text-xs uppercase tracking-[0.16em] text-slate-400'>Job position</strong>
                                <span className='mt-2 block text-lg font-semibold text-slate-900'>{interviewData.jobPosition}</span>
                            </div>
                            <div className='rounded-[22px] bg-[#fffaf2] p-4'>
                                <strong className='block text-xs uppercase tracking-[0.16em] text-slate-400'>Job description / stack</strong>
                                <span className='mt-2 block'>{interviewData.jobDescription}</span>
                            </div>
                            <div className='rounded-[22px] bg-[#fffaf2] p-4'>
                                <strong className='block text-xs uppercase tracking-[0.16em] text-slate-400'>Experience level</strong>
                                <span className='mt-2 block'>{interviewData.jobExperience} years</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='surface-panel p-6 text-sm text-slate-500'>Loading interview details...</div>
                )}
                <div className='soft-panel p-6'>
                    <h2 className='flex gap-3 items-center text-xl font-semibold text-slate-900'><Lightbulb className='text-[#14636e]'/><strong>Before you start</strong></h2>
                    <p className='mt-4 text-sm leading-7 text-slate-600'>
                        The interview uses your microphone for speech-to-text and optionally uses your webcam for visibility while you practice.
                        Your video is not part of the scoring. You can begin as soon as your devices are ready.
                    </p>
                    <div className='mt-5 grid gap-3 sm:grid-cols-3'>
                        {['Find a quiet room', 'Speak in complete thoughts', 'Review feedback after each run'].map((item) => (
                            <div key={item} className='rounded-[20px] bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm'>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='surface-panel p-6 sm:p-8'>
                <div className='rounded-[28px] border border-[#d4d9d2] bg-[linear-gradient(180deg,#f6fbf9,#edf5f2)] p-5'>
                {webcamEnabled? <Webcam
                onUserMedia={()=>setWebcamEnabled(true)}
                onUserMediaError={()=>setWebcamEnabled(false)}
                mirrored={true}
                style={{
                    height: 360,
                    width: '100%',
                    borderRadius: 24,
                    objectFit: 'cover'
                }}
                />
                :
                <>
                    <WebcamIcon className='h-72 w-full rounded-[24px] bg-white p-20 text-slate-400'/>
                    <Button className='mt-5 h-12 w-full rounded-full bg-[#14636e] text-base text-white hover:bg-[#0f4d56]' onClick={()=>setWebcamEnabled(true)}>Enable Webcam and Microphone</Button>
                </>
                }
                </div>
                <div className='mt-6 rounded-[24px] bg-slate-900 p-6 text-white'>
                    <div className='text-sm uppercase tracking-[0.16em] text-slate-300'>Ready check</div>
                    <p className='mt-3 text-lg leading-8 text-slate-100'>
                        Once your devices are enabled, continue into the interview workspace and answer each question aloud.
                    </p>
                <div className='flex justify-center mt-6'>
                    <Link href={`/dashboard/interview/${params.interviewId}/start`}>
                        <Button className='h-12 rounded-full bg-white px-8 text-base font-semibold text-slate-900 hover:bg-[#f0ecdf]'>Start Interview</Button>
                    </Link>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Interview

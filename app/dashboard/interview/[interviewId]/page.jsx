"use client"

import { db } from '../../../../utils/db'
import { MockInterview } from '../../../../utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from '../../../../components/ui/button';
import Link from 'next/link'

function Interview({params}) {

    const [interviewData, setInterviewData] = useState();
    const [webcamEnabled, setWebcamEnabled] = useState(false);

    useEffect(()=>{
        console.log(params.interviewId);
        getInterviewDetails();
    }, [])

    const getInterviewDetails = async() =>{
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId))
        setInterviewData(result[0]);
    }

  return (
    <div className='my-10 flex justify-center flex-col items-center'>
        <h1 className='font-bold text-5xl'>Let's Get Started</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-20 mt-10'>
            <div className='flex flex-col my-5 gap-8'>
                {interviewData ? (
                    <div className='items-center mt-7 text-lg p-5 rounded-xl border border-orange-500 bg-orange-200'>
                        <h2><strong>Job Position: </strong>{interviewData.jobPosition}</h2>
                        <h2><strong>Job Description: </strong>{interviewData.jobDescription}</h2>
                        <h2><strong>Years of Experience: </strong>{interviewData.jobExperience}</h2>
                    </div>
                ) : (
                    <div>Loading interview details...</div>
                )}
                <div className='p-5 border rounded-lg border-blue-500 bg-blue-200'>
                    <h2 className='flex gap-4 items-center text-xl'><Lightbulb/><strong>Information</strong></h2>
                    <h2 className='mt-3 text-md'>Enable webcam and microphone to start your AI Generated Mock Interview.
                        It has 5 questions which you can answer and at the last you will get the report
                        on the answer you provided. NOTE: We never record and store your video and audio 
                        and you may also disable your webcam access any time.
                    </h2>
                </div>
            </div>
            <div>
                {webcamEnabled? <Webcam
                onUserMedia={()=>setWebcamEnabled(true)}
                onUserMediaError={()=>setWebcamEnabled(false)}
                mirrored={true}
                style={{
                    height: 300,
                    width: 300
                }}
                />
                :
                <>
                    <WebcamIcon className='h-72 w-full my-10 p-20 bg-secondary rounded-full'/>
                    <Button className='w-full text-lg' onClick={()=>setWebcamEnabled(true)}>Enable Webcam and Microphone</Button>
                </>
                }
                <div className='flex justify-center my-5'>
                    <Link href={params.interviewId+'/start'}>
                        <Button className='w-30 h-15 text-xl'>Start Interview</Button>
                    </Link>
                </div>
            </div>
        </div>
        
        
        
    </div>
  )
}

export default Interview

"use client"

import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "../../../../../components/ui/collapsible"
import { Button } from '../../../../../components/ui/button'
import { useRouter } from 'next/navigation'  
import { toast } from 'sonner'

function Feedback({params}) {

    const [feedbackList, setFeedbackList]=useState([]);
    const router=useRouter();
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        getFeedback();
    },[])

    useEffect(() => {
        if (feedbackList) {
            setLoading(false);
        }
    }, [feedbackList]);

    const getFeedback=async()=>{
        try {
            const response = await fetch(`/api/interviews/${params.interviewId}/feedback`, {
                credentials: 'include',
                cache: 'no-store',
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to load feedback');
            }

            setFeedbackList(result.feedback || []);
        } catch (error) {
            toast(error.message || 'Failed to load feedback');
            setFeedbackList([]);
        }
    }

    const getRatingColor = (rating) => {
        if (rating < 4) return 'text-red-500';
        if (rating >= 4 && rating <= 6) return 'text-yellow-500';
        return 'text-green-500';
    }

    if (loading) {
        return <div className='surface-panel p-6 text-sm text-slate-500'>Loading feedback data...</div>;
    }

    const averageRating = feedbackList.length
      ? (
          feedbackList.reduce((sum, item) => sum + Number(item.rating || 0), 0) / feedbackList.length
        ).toFixed(1)
      : null;

  return (
    <div className='space-y-8'>
        
        {feedbackList.length == 0?
        <div className='surface-panel p-8'>
          <h2 className='text-2xl font-semibold text-slate-900'>No interview feedback found</h2>
          <p className='mt-3 text-sm leading-7 text-slate-600'>
            Complete an interview run first, then this page will show scores, answer transcripts, and improvement notes.
          </p>
        </div>
        :
        <>  
            <section className='surface-panel px-6 py-8 sm:px-8'>
              <span className='eyebrow'>Feedback review</span>
              <h2 className='mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl'>
                Interview complete. Now focus on what to sharpen.
              </h2>
              <p className='mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg'>
                Open each question card to compare your answer with the ideal response and read the AI feedback.
              </p>

              <div className='mt-8 grid gap-4 sm:grid-cols-3'>
                <div className='rounded-[24px] bg-[#fffaf2] p-5'>
                  <div className='text-xs uppercase tracking-[0.16em] text-slate-400'>Questions answered</div>
                  <div className='mt-3 text-3xl font-semibold text-slate-900'>{feedbackList.length}</div>
                </div>
                <div className='rounded-[24px] bg-[#eff8f4] p-5'>
                  <div className='text-xs uppercase tracking-[0.16em] text-slate-400'>Average score</div>
                  <div className='mt-3 text-3xl font-semibold text-slate-900'>{averageRating}/10</div>
                </div>
                <div className='rounded-[24px] bg-slate-900 p-5 text-white'>
                  <div className='text-xs uppercase tracking-[0.16em] text-slate-300'>Next move</div>
                  <div className='mt-3 text-lg font-semibold'>Retake the session after reviewing your weak answers.</div>
                </div>
              </div>
            </section>

            {feedbackList && feedbackList.map((item, index)=>(
                <Collapsible key={index} className='surface-panel my-6 overflow-hidden p-2'>
                    <CollapsibleTrigger className='flex justify-between gap-7 w-full rounded-[22px] bg-[#f9f3e8] px-5 py-5 text-left text-lg font-semibold text-slate-900'>
                    {feedbackList[index].question} 
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='mt-3 flex flex-col gap-3 rounded-[22px] bg-white p-4'>
                            <h2 className={`rounded-[18px] bg-[#fff7eb] p-4 text-sm ${getRatingColor(item.rating)}`}><strong>Rating: </strong>{item.rating}/10</h2>
                            <h2 className='rounded-[18px] bg-red-50 p-4 text-sm leading-7 text-red-950'><strong>Your Answer: </strong>{item.userAnswer}</h2>
                            <h2 className='rounded-[18px] bg-green-50 p-4 text-sm leading-7 text-green-950'><strong>Ideal Response: </strong>{item.correctAnswer}</h2>
                            <h2 className='rounded-[18px] bg-blue-50 p-4 text-sm leading-7 text-sky-900'><strong>Feedback: </strong>{item.feedback}</h2>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </>
        }
        
        <Button className='rounded-full bg-slate-900 text-white hover:bg-slate-700' onClick={()=>router.replace('/')}>Go Home</Button>
    </div>
  )
}

export default Feedback

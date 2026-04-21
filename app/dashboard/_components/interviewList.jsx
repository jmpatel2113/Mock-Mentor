"use client"

import React, { useEffect, useState } from 'react'
import InterviewItemCard from './interviewItemCard';
import { toast } from 'sonner';

function InterviewList() {

    const [interviewList, setInterviewList] = useState([]);
    useEffect(()=>{
        getInterviewList();
    }, [])
    const getInterviewList=async()=>{
        try {
          const response = await fetch('/api/interviews/history', {
            credentials: 'include',
            cache: 'no-store',
          });
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || 'Failed to load interviews');
          }
          setInterviewList(result.interviews || []);
        } catch (error) {
          toast(error.message || 'Failed to load interviews');
        }
    }

  return (
    <div>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <div className='text-sm font-semibold uppercase tracking-[0.16em] text-[#1f5d55]'>History</div>
          <h2 className='mt-2 text-3xl font-semibold tracking-tight text-slate-900'>Previous interviews</h2>
        </div>
        <p className='max-w-xl text-sm leading-7 text-slate-600'>
          Reopen any prior practice session, restart the interview flow, or jump straight into the saved feedback.
        </p>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {interviewList && interviewList.map((interview, index) => (
            <InterviewItemCard 
            interview={interview}
            key={index}/>
        ))}
      </div>
      {interviewList.length === 0 && (
        <div className='mt-6 rounded-[24px] border border-dashed border-[#cdbfa9] bg-[#fff9ef] p-8 text-sm leading-7 text-slate-600'>
          No interviews yet. Create your first session above and the review history will appear here.
        </div>
      )}
    </div>
  )
}

export default InterviewList

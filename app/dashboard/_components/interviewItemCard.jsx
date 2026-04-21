import React from 'react'
import { Button } from '../../../components/ui/button'
import { useRouter } from 'next/navigation'

function InterviewItemCard({interview}) {
  
    const router = useRouter();
    const onStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockId);
    }

    const onFeedback=()=>{
        router.push('/dashboard/interview/'+interview?.mockId+'/feedback')
    }

    return (
    <div className='rounded-[24px] border border-[#d9cfbf] bg-[linear-gradient(180deg,#fffefb,#f7efe3)] p-5 shadow-sm'>
        <div className='flex items-start justify-between gap-4'>
            <div>
                <div className='text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5d55]'>Interview</div>
                <h2 className='mt-2 text-2xl font-semibold tracking-tight text-slate-900'>{interview?.jobPosition}</h2>
            </div>
            <div className='rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white'>
                {interview?.jobExperience} yrs
            </div>
        </div>

        <p className='mt-4 line-clamp-3 text-sm leading-7 text-slate-600'>
            {interview?.jobDescription}
        </p>
        <h2 className='mt-4 text-xs uppercase tracking-[0.16em] text-slate-400'>Created on {interview?.createdOn}</h2>
        <div className='mt-5 flex justify-between gap-3'>
            <Button size='sm' variant='outline' className='w-full rounded-full border-[#cdbfa9] bg-white hover:bg-[#f3ebdd]'
            onClick={onFeedback}>Feedback</Button>
            <Button size='sm' className='w-full rounded-full bg-[#14636e] text-white hover:bg-[#0f4d56]'
            onClick={onStart}>Start</Button>
        </div>
    
    
    </div>
  )
}

export default InterviewItemCard
    

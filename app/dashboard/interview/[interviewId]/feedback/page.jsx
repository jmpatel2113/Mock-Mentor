"use client"

import React, { useEffect, useState } from 'react'
import { db } from '../../../../../utils/db'
import { UserAnswer } from '../../../../../utils/schema'
import { eq } from 'drizzle-orm'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "../../../../../components/ui/collapsible"
import { Button } from '../../../../../components/ui/button'
import { useRouter } from 'next/navigation'  

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
        console.log('feedbackList state updated:', feedbackList);
    }, [feedbackList]);

    const getFeedback=async()=>{
        const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdReference, params.interviewId))
        .orderBy(UserAnswer.id);

        console.log(result);
        setFeedbackList(result);
        console.log(feedbackList);
    }

    const getRatingColor = (rating) => {
        if (rating < 4) return 'text-red-500';
        if (rating >= 4 && rating <= 6) return 'text-yellow-500';
        return 'text-green-500';
    }

    if (loading) {
        return <div>Loading feedback data...</div>;
    }

  return (
    <div className='p-10'>
        
        {feedbackList.length == 0?
        <h2 className='font-bold text-xl text-gray-500'>No interview feedback found</h2>
        :
        <>  
            <h2 className='text-6xl font-bold text-green-500 my-5'>Congratulations on completing the interview!</h2>
            <h2 className='font-bold text-3xl my-2'>Below is the interview feedback</h2>
            {/*<h2 className='text-primary text-lg my-3'>Interview rating: <strong>7/10</strong></h2>*/}
            <h2 className='text-md text-gray-500'>Click on the interview question below to see AI constructed feedback.</h2>
            {feedbackList && feedbackList.map((item, index)=>(
                <Collapsible key={index} className='my-9'>
                    <CollapsibleTrigger className='flex justify-between p-2 gap-7 w-full bg-secondary rounded-lg my-1 text-left text-lg'>
                    {feedbackList[index].question} 
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='flex flex-col gap-2 border rounded-lg border-gray-500 bg-white'>
                            <h2 className={`p-2 ${getRatingColor(item.rating)}`}><strong>Rating: </strong>{item.rating}/10</h2>
                            <h2 className='p-2  bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAnswer}</h2>
                            <h2 className='p-2  bg-green-50 text-sm text-green-900'><strong>Ideal Response: </strong>{item.correctAnswer}</h2>
                            <h2 className='p-2  bg-blue-50 text-sm text-primary'><strong>Feedback: </strong>{item.feedback}</h2>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </>
        }
        
        <Button className='my-4' onClick={()=>router.replace('/')}>Go Home</Button>
    </div>
  )
}

export default Feedback

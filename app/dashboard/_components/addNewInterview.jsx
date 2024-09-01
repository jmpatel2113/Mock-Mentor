"use client"
import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../components/ui/dialog"
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { chatSession } from '../../../utils/geminiAIModal';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '../../../utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import db from '../../../utils/db'
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { desc, eq } from 'drizzle-orm';
import { toast } from 'sonner';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDescription, setJobDescription] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const router = useRouter();
    const {user} = useUser();
    const [interviewList, setInterviewList] = useState([]);
    
    useEffect(()=>{
        user && getInterviewList();
    }, [user])
    const getInterviewList=async()=>{
        const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));

        console.log(result);
        setInterviewList(result);
    }

    const onSubmit=async(e)=>{
        setLoading(true);
        e.preventDefault()
        console.log(jobPosition, jobDescription, jobExperience)

        const InputPrompt = "Job Position: " + jobPosition + ", Job Description: " + jobDescription + ", Years of Experience: " + jobExperience + ", Based on this information, pleace give me " + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + " interview question with Answered in Json Format, Give Question and Answer as field in JSON";
        console.log(InputPrompt);
        const result = await chatSession.sendMessage(InputPrompt);
        const mockJsonResponse = result.response.text().replace('```json','').replace('```', '')
        console.log(JSON.parse(mockJsonResponse))
        setJsonResponse(mockJsonResponse);
        
        if(mockJsonResponse){
            const response = await db.insert(MockInterview).values({
                mockId: uuidv4(),
                jsonMockResponse: mockJsonResponse,
                jobPosition: jobPosition,
                jobDescription: jobDescription,
                jobExperience: jobExperience,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdOn: moment().format('DD-MM-yyyy')
            }).returning({mockId:MockInterview.mockId});
    
            console.log("Insereted ID:", response)
            if(response){
                setOpenDialog(false);
                router.push('/dashboard/interview/' + response[0]?.mockId)
            }
        }
        else{
            console.log("ERROR")
        }
        
        setLoading(false);
    }

  return (
    <div>
        <div className='p-10 border rounded-3xl bg-secondary border-gray-900
        hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>{interviewList.length < 2 ? (
            setOpenDialog(true)):(toast('See Upgrade Section'))
        }}>
            <h2 className='font-bold text-lg'>+ Add New</h2>
        </div>
        <Dialog open={openDialog}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
                <DialogDescription>
                    <form onSubmit={onSubmit}>
                        <div>
                            <h2>Add details about your job position, job description and years of experience</h2>
                        </div>
                        <div className='mt-7 my-3'>
                            <label>Job Position</label>
                            <Input placeholder='Ex. App Developer' required
                            onChange={(event)=>setJobPosition(event.target.value)}></Input>
                        </div>
                        <div className='mt-7 my-3'>
                            <label>Job Description/ Tech Stack(In Short)</label>
                            <Textarea placeholder='Ex. Flutter, Kotlin, NodeJs, Java, PostgreSQL, etc.' required
                            onChange={(event)=>setJobDescription(event.target.value)}></Textarea>
                        </div>
                        <div className='mt-7 my-3'>
                            <label>Years of Experience</label>
                            <Input placeholder='Ex. 3' type='number' max='50' required step="0.1"
                            onChange={(event)=>setJobExperience(event.target.value)} pattern="^\d*(\.\d{0,2})?$"></Input>
                        </div>
                        <div className='flex gap-5 justify-end'>
                            <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                            <Button type="submit" disable={loading}>{
                                loading? 
                                <>
                                    <LoaderCircle className='animate-spin'/> Generating from AI
                                </>:'Start Interview'
                            }
                            </Button>
                        </div>
                    </form>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewInterview

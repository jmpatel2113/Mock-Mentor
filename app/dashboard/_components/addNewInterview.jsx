"use client"
import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "../../../components/ui/dialog"
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { toast } from 'sonner';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [loading, setLoading] = useState(false);
    const [billingStatus, setBillingStatus] = useState(null);
    const router = useRouter();
    
    useEffect(()=>{
        getBillingStatus();

        const refreshStatus = () => getBillingStatus();
        window.addEventListener("billing:refresh", refreshStatus);

        return () => {
            window.removeEventListener("billing:refresh", refreshStatus);
        };
    }, [])

    const getBillingStatus=async()=>{
        try {
            const response = await fetch('/api/billing/status');
            if (!response.ok) {
                throw new Error('Unable to load billing status');
            }

            const result = await response.json();
            setBillingStatus(result);
        } catch (error) {
            console.error(error);
        }
    }

    const onSubmit=async(e)=>{
        e.preventDefault()

        setLoading(true);
        try {
            const response = await fetch('/api/interviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobPosition,
                    jobDescription,
                    jobExperience,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast(result.error || 'Unable to create interview');
                if (response.status === 403) {
                    router.push('/upgrade');
                }
                return;
            }

            toast('Interview created successfully');
            setOpenDialog(false);
            window.dispatchEvent(new CustomEvent('billing:refresh'));
            router.push('/dashboard/interview/' + result.mockId);
        } catch (error) {
            console.error(error);
            toast('Unable to create interview');
        } finally {
            setLoading(false);
        }
    }

  return (
    <div>
        <div
        className='group rounded-[28px] border border-dashed border-[#c4baa7] bg-[linear-gradient(145deg,#fffdf8,#f6ecda)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_16px_45px_rgba(53,59,70,0.08)] cursor-pointer'
        onClick={()=>{
            if (!billingStatus || billingStatus.canCreate) {
                setOpenDialog(true);
                return;
            }

            toast('Interview quota reached. Visit Upgrade to continue.');
            router.push('/upgrade');
        }}>
            <div className='flex items-start justify-between gap-4'>
                <div>
                    <div className='text-sm font-semibold uppercase tracking-[0.18em] text-[#1f5d55]'>New interview</div>
                    <h2 className='mt-3 text-2xl font-semibold text-slate-900'>Create a tailored practice round</h2>
                    <p className='mt-3 max-w-md text-sm leading-7 text-slate-600'>
                        {billingStatus
                          ? `${billingStatus.remainingInterviews} session${billingStatus.remainingInterviews === 1 ? '' : 's'} remaining in your current allowance.`
                          : 'Add the role, tech stack, and experience level. Mock Mentor will build a question set and ideal answers for you.'}
                    </p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white transition group-hover:rotate-90'>
                    +
                </div>
            </div>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className='max-w-2xl rounded-[28px] border-[#d6ccb9] bg-[#fffaf2] p-0'>
                <DialogHeader>
                <DialogTitle className='hidden'>Create mock interview</DialogTitle>
                <DialogDescription asChild>
                    <form onSubmit={onSubmit} className='p-7 sm:p-8'>
                        <div className='border-b border-[#e5dbc9] pb-6'>
                            <div className='text-sm font-semibold uppercase tracking-[0.18em] text-[#1f5d55]'>Interview setup</div>
                            <h2 className='mt-3 text-3xl font-semibold tracking-tight text-slate-900'>
                                Tell Mock Mentor what role you are preparing for.
                            </h2>
                            <p className='mt-3 text-sm leading-7 text-slate-600'>
                                Better inputs produce better questions. Keep the description focused on real responsibilities and technologies.
                            </p>
                        </div>
                        <div className='mt-7 space-y-5'>
                        <div>
                            <label>Job Position</label>
                            <Input className='mt-2 h-12 rounded-2xl border-[#d7cfbf] bg-white px-4'
                            placeholder='Ex. Frontend Engineer' required
                            onChange={(event)=>setJobPosition(event.target.value)}></Input>
                        </div>
                        <div>
                            <label>Job Description/ Tech Stack(In Short)</label>
                            <Textarea className='mt-2 min-h-32 rounded-2xl border-[#d7cfbf] bg-white px-4 py-3'
                            placeholder='Ex. React, Next.js, design systems, accessibility, API integrations' required
                            onChange={(event)=>setJobDescription(event.target.value)}></Textarea>
                        </div>
                        <div>
                            <label>Years of Experience</label>
                            <Input className='mt-2 h-12 rounded-2xl border-[#d7cfbf] bg-white px-4'
                            placeholder='Ex. 3' type='number' max='50' required step="0.1"
                            onChange={(event)=>setJobExperience(event.target.value)} pattern="^\d*(\.\d{0,2})?$"></Input>
                        </div>
                        </div>
                        <div className='flex gap-5 justify-end'>
                            <Button type="button" variant="ghost" className='rounded-full px-5' onClick={()=>setOpenDialog(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading} className='rounded-full bg-slate-900 px-6 text-white hover:bg-slate-700'>{
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

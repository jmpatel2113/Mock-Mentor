"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link';

export default function Home() {

  const path = usePathname();

  useEffect(()=>{
    console.log(path)
  },[])

  return (
    <div>
      <div className='flex p-7 items-center justify-between bg-secondary shadow-sm'>
      <Link href="/"><Image src={"/logo.svg"} width={100} height={100} alt="logo" className='cursor-pointer'/></Link>
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-primary hover:font-bold transition-all 
        cursor-pointer ${path=='/dashboard'&&'text-primary font-bold'}`}>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className={`hover:text-primary hover:font-bold transition-all 
        cursor-pointer ${path=='/dashboard/questions'&&'text-primary font-bold'}`}>
          <Link href="/faq">FAQ</Link></li>
        <li className={`hover:text-primary hover:font-bold transition-all 
        cursor-pointer ${path=='/dashboard/upgrade'&&'text-primary font-bold'}`}>
          <Link href="/upgrade">Upgrade</Link>
          </li>
        <li className={`hover:text-primary hover:font-bold transition-all 
        cursor-pointer ${path=='/dashboard/howItWorks'&&'text-primary font-bold'}`}>
          <Link href="/howItWorks">How it Works?</Link>
        </li>
      </ul>
      <UserButton/>
    </div>
      <div className='flex flex-col items-center justify-center grid-cols'>
        <h2 className='pt-10 pb-3 text-bold text-8xl'>Welcome to Mock Mentor!</h2>
        <h2 className='text-2xl mb-20 underline'>Where your preparation gives results</h2>
      </div>
      
      <div className='p-16 flex justify-center'>
        <div className=' w-[60%] border rounded-3xl outline-double p-5 bg-emerald-100 text-blue-600 text-2xl'>
          <p className='text-center'>This is an <strong>AI-generated Mock Interview</strong> service where you can practice technical job interviews
            and sharpen your skills, confidence and results. 
          </p>
        </div>
      </div>

      <div className='flex justify-center'>
        <div className=' w-[70%] border rounded-3xl outline-double p-5 bg-emerald-100 text-blue-600 text-2xl'>
          <p className='text-center'>AI is integrated in this service to help you become better
            at job interviews. With the help of <strong>AI-Constructed Questions and Feedback</strong> and ratings, you can identify and strengthen your
            weaknesses.
          </p>
        </div>
      </div>
      
      <div className='p-16 flex justify-center'>
        <div className=' w-[90%] border rounded-3xl outline-double p-5 bg-emerald-100 text-blue-600 text-2xl'>
          <p className='text-center'>Follow the tabs on the above header to start practicing interviews with <strong>Mock Mentor!</strong></p>
        </div>
      </div>
      
    </div>
    
  );
}

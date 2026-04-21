"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link';

function Header() {

    const path = usePathname();
    useEffect(()=>{
        console.log(path)
    },[])

  return (
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
  )
}

export default Header

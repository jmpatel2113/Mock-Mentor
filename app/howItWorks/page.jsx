import React from 'react'
import Header from '../dashboard/_components/header'

const steps = [
  'Open the dashboard, sign in, and create a new interview session for the role you want to practice.',
  'Describe the job position, stack, and experience level. The AI generates a role-specific question set and ideal answers.',
  'Enable microphone access and optionally enable webcam access before entering the interview screen.',
  'Answer each question aloud. Your speech is converted into text and then reviewed to generate ratings and feedback.',
  'Open the feedback screen to compare your answer with the ideal response and plan your next practice run.',
];

function HowItWorks() {
  return (
    <div className='page-shell min-h-screen'>
        <Header></Header>
        <div className='page-content space-y-8 pt-10'>
            <section className='surface-panel px-6 py-8 sm:px-8'>
              <span className='eyebrow'>How it works</span>
              <h1 className='mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl'>
                The product should feel simple: create a session, answer aloud, and review with intent.
              </h1>
              <p className='mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg'>
                Mock Mentor is built around a repeatable practice loop for technical interviews, not a one-time gimmick.
              </p>
            </section>

            <section className='grid gap-5'>
              {steps.map((step, index) => (
                <div key={step} className='surface-panel grid gap-5 p-6 sm:grid-cols-[100px_1fr] sm:p-8'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-[22px] bg-slate-900 text-2xl font-semibold text-white'>
                    {index + 1}
                  </div>
                  <div>
                    <h2 className='text-2xl font-semibold text-slate-900'>Step {index + 1}</h2>
                    <p className='mt-3 text-sm leading-8 text-slate-600 sm:text-base'>{step}</p>
                  </div>
                </div>
              ))}
            </section>
        </div>
    </div>
  )
}

export default HowItWorks

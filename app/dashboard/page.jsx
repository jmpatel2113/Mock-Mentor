import React from 'react'
import AddNewInterview from './_components/addNewInterview'
import InterviewList from './_components/interviewList'
import UsageOverview from './_components/usageOverview'

function Dashboard() {
  return (
    <div className='space-y-8'>
      <section className='grid gap-6 lg:grid-cols-[1.15fr_0.85fr]'>
        <div className='surface-panel px-6 py-8 sm:px-8'>
          <span className='eyebrow'>Dashboard</span>
          <h1 className='mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl'>
            Build your next practice session without digging through clutter.
          </h1>
          <p className='mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg'>
            Create role-specific mock interviews, revisit past sessions, and keep your review loop in one place.
          </p>

          <div className='mt-8 grid gap-4 sm:grid-cols-3'>
            {[
              ['Targeted prompts', 'Role, stack, and experience are used to generate each interview.'],
              ['Voice-first practice', 'Record spoken answers instead of typing everything out.'],
              ['Stored feedback', 'Return to prior sessions and compare performance over time.'],
            ].map(([title, copy]) => (
              <div key={title} className='rounded-[22px] border border-[#dbd2c3] bg-[#fffaf2] p-5'>
                <h2 className='text-lg font-semibold text-slate-900'>{title}</h2>
                <p className='mt-2 text-sm leading-7 text-slate-600'>{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='soft-panel p-6 sm:p-7'>
          <div className='text-sm font-semibold uppercase tracking-[0.16em] text-[#1f5d55]'>
            Start a new session
          </div>
          <h2 className='mt-3 text-2xl font-semibold text-slate-900'>
            Generate a fresh interview and begin practicing.
          </h2>
          <p className='mt-3 text-sm leading-7 text-slate-600'>
            Your prompt should describe the role clearly enough for the AI to tailor the questions well.
          </p>
          <div className='mt-6'>
            <AddNewInterview/>
          </div>
        </div>
      </section>

      <section className='surface-panel p-6 sm:p-8'>
        <InterviewList/>
      </section>

      <UsageOverview/>
    </div>
  )
}

export default Dashboard

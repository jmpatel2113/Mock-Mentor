import React from 'react'
import Header from '../dashboard/_components/header'

const faqItems = [
  {
    question: "How do I get started?",
    answer:
      'Create an account, open the Dashboard, and create your first mock interview. The How It Works page explains the full flow from setup through feedback review.',
  },
  {
    question: "How many interviews can I create once I subscribe?",
    answer:
      'The intended paid experience is unlimited mock interviews and repeat access to past sessions through the dashboard.',
  },
  {
    question: "What payments do you accept?",
    answer:
      'The current copy references card payments plus Apple Pay, Cash App Pay, and Link through Stripe checkout.',
  },
  {
    question: "Can I retake interviews?",
    answer:
      'Yes. The product is built around repeated practice, so retaking interviews is part of the intended workflow.',
  },
  {
    question: "Do interviews include behavioral questions?",
    answer:
      'At the moment the project is centered on technical interviews. Behavioral interview coverage is planned work, not the current focus.',
  },
  {
    question: "How do I contact support?",
    answer:
      'The page currently points users to the project email address: jmpatel2113@gmail.com.',
  },
];

function Faq() {
  return (
    <div className='page-shell min-h-screen'>
      <Header></Header>
      <div className='page-content space-y-8 pt-10'>
        <section className='surface-panel px-6 py-8 text-center sm:px-8'>
          <span className='eyebrow'>FAQ</span>
          <h1 className='mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl'>
            Common questions, without the clutter.
          </h1>
          <p className='mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg'>
            This pass focuses on making the product easier to understand quickly. These are the current answers reflected by the codebase and existing product copy.
          </p>
        </section>

        <section className='grid gap-4'>
          {faqItems.map((item) => (
            <details key={item.question} className='surface-panel group p-0 open:bg-white/90'>
              <summary className='cursor-pointer list-none px-6 py-5 text-left text-xl font-semibold text-slate-900 marker:content-none sm:px-8'>
                <div className='flex items-center justify-between gap-6'>
                  <span>{item.question}</span>
                  <span className='rounded-full bg-[#f3ebdd] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                    Open
                  </span>
                </div>
              </summary>
              <div className='border-t border-[#ebe1d0] px-6 py-5 text-sm leading-8 text-slate-600 sm:px-8'>
                {item.answer}
              </div>
            </details>
          ))}
        </section>
      </div>
    </div>
  )
}

export default Faq

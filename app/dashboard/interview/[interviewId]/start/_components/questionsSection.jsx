import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSection({mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex}) {

    const textToSpeech = (text) => {
        if('speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        }
        else{
            alert('Sorry, your browser does not support text to speech');
        }
    }

  return mockInterviewQuestion&&(
    <div className='surface-panel p-6'>
        <div className='flex items-start justify-between gap-4'>
            <div>
                <div className='text-sm font-semibold uppercase tracking-[0.16em] text-[#1f5d55]'>Question navigator</div>
                <h2 className='mt-3 text-2xl font-semibold tracking-tight text-slate-900'>Stay anchored on the current prompt.</h2>
            </div>
            <button
              type='button'
              className='flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f3ef] text-[#14636e] transition hover:bg-[#d9ebe4]'
              onClick={()=>textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)}
            >
              <Volume2 className='h-5 w-5'/>
            </button>
        </div>

        <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4'>
            {mockInterviewQuestion&&mockInterviewQuestion.map((question, index)=>(
                <button
                type='button'
                key={index}
                className={`rounded-full px-4 py-3 text-sm font-medium text-center transition
                ${activeQuestionIndex==index ? 'bg-slate-900 text-white shadow-sm' : 'bg-[#f5eee0] text-slate-600 hover:bg-[#eee4d4]'}`}
                onClick={()=>setActiveQuestionIndex(index)}>Question #{index+1}</button>
            ))}
        </div>
        
        {mockInterviewQuestion[activeQuestionIndex]?.Question ? (
            <div className='mt-6 rounded-[24px] bg-[#fffaf2] p-6'>
              <div className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Current question</div>
              <h2 className='mt-3 text-lg leading-8 text-slate-900 md:text-xl'>{mockInterviewQuestion[activeQuestionIndex]?.Question}</h2>
            </div>
        ):(
            <h2>Loading questions...</h2>
        )
        }
        
        <div className='mt-8 rounded-[24px] border border-[#d8e2dc] bg-[#f1f8f5] p-5'>
            <h2 className='flex gap-2 items-center text-[#14636e]'>
                <Lightbulb className='h-5 w-5'/>
                <strong>Note:</strong>
            </h2>
            <h2 className='my-3 text-sm leading-7 text-slate-600'>
                Click on record answer when you are ready to answer. At the end of the interview,
                feedback will be provided along with a sample answer for each question. This way,
                you will be able to evaluate and compare your answer with an ideal response that
                will be expected in the interview.
            </h2>
        </div>
    </div>
  )
}

export default QuestionsSection

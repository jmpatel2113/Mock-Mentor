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
    <div className='p-5 border rounded-lg my-10 border-cyan-700 bg-cyan-100'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {mockInterviewQuestion&&mockInterviewQuestion.map((question, index)=>(
                <h2 className={`p-2 bg-secondary rounded-full test-xs md:text-sm text-center cursor-pointer 
                ${activeQuestionIndex==index ? 'bg-gray-900 text-white' : ''}`} onClick={()=>setActiveQuestionIndex(index)}>Question #{index+1}</h2>
            ))}
        </div>
        
        <Volume2 className='cursor-pointer mt-5' onClick={()=>textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)}/>
        {mockInterviewQuestion[activeQuestionIndex]?.Question ? (
            <h2 className='mb-5 mt-2 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.Question}</h2>
        ):(
            <h2>Loading questions...</h2>
        )
        }
        
        <div className='border rounded-lg p-5 bg-blue-200 border-blue-300 mt-20'>
            <h2 className='flex gap-2 items-center text-primary'>
                <Lightbulb/>
                <strong>Note:</strong>
            </h2>
            <h2 className='text-sm text-primary my-2'>
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

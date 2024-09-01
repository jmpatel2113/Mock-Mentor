import React from 'react'
import Header from '../dashboard/_components/header'

function HowItWorks() {
  return (
    <div>
        <Header></Header>
        <div className='m-10 p-10'>
            <div className='text-5xl font-normal mb-10 text-center'>In these <strong>Mock Mentor</strong> interviews, you will be able to practice your interiewing skills and improve
                your public speaking abilities which will help you tackle interviews.
            </div>
            <div className='text-3xl mt-32 mb-8'>Follow the steps below to get started!</div>
            <div>
                <ol className='list-decimal pl-14 pr-20 space-y-10 text-xl'>
                    <li className='p-3 rounded border border-gray-600 bg-gray-200'>
                        To get started, go to the Dashboard section and login to your account. If you don't have an
                        account, you can sign-up for free from the Dashboard section. Here you will be able to add 
                        new interview practice sessions. You can also view past sessions, retake your answers and 
                        view feedback on your interviews.
                    </li>
                    <li className='p-3 rounded border border-gray-600 bg-gray-200'>
                        Click on <strong>"Add New"</strong> and a pop-up will open up and ask you to enter job interview details.
                        It will ask you for job position, description or the tech stack involved for the position
                        and years of experience required/preferred by the job. Then click on <strong>"Start Interview"</strong> and
                        5 questions and ideal answers will be generated by AI based on the input you provide.
                    </li>
                    <li className='p-3 rounded border border-gray-600 bg-gray-200'>
                        Once the questions are generated, you will be redirected to a page where it will ask you
                        to enable camera and microphone access. Just click on <strong>"Enable Webcam and Microphone"</strong> and
                        confirm access. It is totally optional to enable camera access, because you will not be
                        rated based on how you look while answering the questions. However, it is necessary to
                        enable microphone access, because your speech will be converted to text and then the text
                        will be analyzed by AI to give rating and feedback. 
                        <h2 className='mt-3'><strong>Note:</strong> We do not store your recorded answer. However,
                        we do store the text that was converted from your speech answer.
                        </h2>
                    </li>
                    <li className='p-3 rounded border border-gray-600 bg-gray-200'>
                        After you answer all 5 questions, click on <strong>"End Interview"</strong> to end the interview. You will
                        then be shown feedback details of each question. Click on each question and you will see
                        the rating (out of 10), your answer (converted from speech to text), and AI-constructed
                        feedback and ideal response. You can look at the feedback and see what areas and skills
                        you need to improve and what already excel in. You can also compare your answer with the
                        ideal answer that recruiters and hiring managers may expect from you.
                    </li>
                    <li className='p-3 rounded border border-gray-600 bg-gray-200'>
                        You can also navigate to FAQs and upgrade section to look at the most frequently asked
                        questions and upgrade from free version to paid version in order to continue practicing 
                        and enhancing your interview skills. You can create two mock interviews for free and
                        once you reach this limit you would need to subscribe monthly or yearly to fully unlock the service
                        and create mock interviews.
                    </li>
                </ol>
                
            </div>
        </div>
        

    </div>
  )
}

export default HowItWorks

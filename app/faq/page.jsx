import React from 'react'
import Header from '../dashboard/_components/header'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible"

function Faq() {
  return (
    <div>
      <Header></Header>
      <div className='text-center my-20 text-7xl text-indigo-500'>
        Frequently Asked Questions
      </div>
      <div className='pt-4 mx-48'>
        <Collapsible className='my-10'>
          <CollapsibleTrigger className='flex justify-between text-2xl p-2 gap-7 w-full bg-secondary rounded-lg my-1 text-left'>
            How do I get started?
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex flex-col gap-2 p-4 text-xl border rounded-lg border-gray-950 bg-white'>
              <p>Get started by first creating an account, where we just need your email before you can start practicing your interviews.
                Once you have an account, go to <strong>"Dashboard"</strong> section and add your 1st interview. For more information,
                go to <strong>"How it Works?"</strong> section and you will find specific details on how to navigate through the website.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible className='my-10'>
          <CollapsibleTrigger className='flex justify-between text-2xl p-2 gap-7 w-full bg-secondary rounded-lg my-1 text-left'>
            How many interviews can I create once I pay for the subscription? 
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex flex-col gap-2 p-4 text-xl border rounded-lg border-gray-950 bg-white'>
              <p>Once you have subscribed to a plan, you can create unlimited amount of interviews and you can access
                them through the <strong>"Dashboard"</strong> section as well as retake them whenver you'd like.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible className='my-10'>
          <CollapsibleTrigger className='flex justify-between text-2xl p-2 gap-7 w-full bg-secondary rounded-lg my-1 text-left'>
            What type of payments do you accept? 
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex flex-col gap-2 p-4 text-xl border rounded-lg border-gray-950 bg-white'>
              <p>At the moment, we are accepting payments made from <strong>Credit Cards</strong>(Visa, Mastercard, American Express, 
                Discover, Diners Club, JCB, and China UnionPay), <strong>Apple Pay</strong>, <strong>Cash App Pay</strong>, and 
                <strong> Link</strong>.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible className='my-10'>
          <CollapsibleTrigger className='flex justify-between text-2xl p-2 gap-7 w-full bg-secondary rounded-lg my-1 text-left'>
            Can I retake my interviews or do I need to create a new interview?
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex flex-col gap-2 p-4 text-xl border rounded-lg border-gray-950 bg-white'>
              You can retake your interviews as many times as you'd like and you will get a feedback for every retake.
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible className='my-10'>
          <CollapsibleTrigger className='flex justify-between text-2xl p-2 gap-7 w-full bg-secondary rounded-lg my-1 text-left'>
            Will the mock interview contain behavioral questions? Or is it just technical questions?
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex flex-col gap-2 p-4 text-xl border rounded-lg border-gray-950 bg-white'>
              <p>At the moment, <strong>Mock Mentor</strong> provides only technical interviews. However, we are working
                to implement behavioral questions in the mock interviews pretty soon. Stay tuned!
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible className='my-10'>
          <CollapsibleTrigger className='flex justify-between text-2xl p-2 gap-7 w-full bg-secondary rounded-lg my-1 text-left'>
            How do I contact you if I have any questions or concerns? 
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex flex-col gap-2 p-4 text-xl border rounded-lg border-gray-950 bg-white'>
              You can contact us at the email link posted below. Just click on the link and it will redirect you to gmail page.
              <p>Email Link: <a href="https://mailto:jmpatel2113@gmail.com">jmpatel2113@gmail.com</a>
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
    </div>
  )
}

export default Faq

"use client"

import React, { useEffect, useState } from 'react'
import pricingPlan from '../../app/_data/pricingPlan'
import { Progress } from '../../components/ui/progress'
import Header from '../dashboard/_components/header'

function Upgrade() {
  const [billingStatus, setBillingStatus] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState('');
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(()=>{
    getBillingStatus();
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

  const startCheckout = async(planKey) => {
    setLoadingCheckout(planKey);
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planKey }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to start checkout');
      }

      window.location.href = result.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCheckout('');
    }
  };

  const openBillingPortal = async() => {
    setPortalLoading(true);
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to open billing portal');
      }

      window.location.href = result.url;
    } catch (error) {
      console.error(error);
    } finally {
      setPortalLoading(false);
    }
  };

  const quotaProgress = billingStatus ? Math.min((billingStatus.usedInterviews / billingStatus.quotaLimit) * 100, 100) : 0;
  const resetLabel = billingStatus?.resetOn
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(billingStatus.resetOn))
    : null;

  return (
    <div className='page-shell min-h-screen'>
      <Header></Header>
      <div className="page-content space-y-8 pt-10">
        <section className='surface-panel px-6 py-8 sm:px-8'>
          <span className='eyebrow'>Upgrade</span>
          <h1 className='mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl'>
            Keep practicing after the free sessions run out.
          </h1>
          <p className='mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg'>
            The current UI tracks the free-tier limit at two interviews, then directs the user toward a paid plan.
          </p>
        </section>

        <div className='surface-panel p-6 sm:p-8'>
          <div className='items-center flex flex-col'>
            <div className='text-sm font-semibold uppercase tracking-[0.16em] text-[#1f5d55]'>
              {billingStatus?.plan === 'free' ? 'Free usage' : 'Current usage'}
            </div>
            <Progress className="mt-4 h-3 w-full max-w-sm rounded-full bg-[#eadfce]" value={quotaProgress}></Progress>
            <div className="mt-4 text-sm leading-7 text-slate-600">
              {billingStatus
                ? `${billingStatus.remainingInterviews}/${billingStatus.quotaLimit} sessions remaining${resetLabel ? ` | resets ${resetLabel}` : ''}`
                : 'Loading current plan usage...'}
            </div>
          </div>
        </div>

        {billingStatus?.canManageBilling && (
          <div className='surface-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8'>
            <div>
              <div className='text-sm font-semibold uppercase tracking-[0.16em] text-[#1f5d55]'>Billing management</div>
              <h2 className='mt-2 text-2xl font-semibold text-slate-900'>Manage your existing subscription</h2>
            </div>
            <button
              type='button'
              onClick={openBillingPortal}
              disabled={portalLoading}
              className='rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60'
            >
              {portalLoading ? 'Opening...' : 'Open Billing Portal'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {pricingPlan.map((item, index)=>(
            <div key={index} className="surface-panel p-6 sm:px-8 lg:p-10">
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-900">
                  {item.duration} Plan
                  <span className="sr-only">Plan</span>
                </h2>

                <p className="mt-2 sm:mt-4">
                  <strong className="text-3xl font-bold text-gray-900 sm:text-4xl"> ${item.price} </strong>
                  <span className="text-sm font-medium text-gray-700">/{item.duration}</span>
                </p>
              </div>

              <ul className="mt-6 space-y-2">
                <li className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-indigo-950"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>

                  <span className="text-gray-700">{item.description}</span>
                </li>
              </ul>

              <button
                type='button'
                onClick={() => startCheckout(item.planKey)}
                disabled={loadingCheckout === item.planKey}
                className="mt-8 block w-full rounded-full border border-[#14636e] bg-[#14636e] px-12 py-3 text-center text-sm font-medium text-white transition hover:bg-[#0f4d56] focus:outline-none disabled:opacity-60"
              >
                {loadingCheckout === item.planKey ? 'Redirecting...' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Upgrade

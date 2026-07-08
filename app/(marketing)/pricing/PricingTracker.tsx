'use client'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export default function PricingTracker() {
  const posthog = usePostHog()
  useEffect(() => {
    if (posthog) {
      posthog.capture('pricing_viewed')
    }
  }, [posthog])
  return null
}

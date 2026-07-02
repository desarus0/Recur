import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import SignUp from './pages/signupPage.jsx'
import VerifyPage from './pages/verifyPage.jsx'
import Dashboard from './pages/dashboard.jsx'
import Analytics from './pages/analytics.jsx'
import Subscriptions from './pages/subscriptions.jsx'
import SignIn from './pages/signinPage.jsx'
import Pricing from './pages/pricing.jsx'
import Resources from './pages/resources.jsx'
import { AddSubProvider, useAddSub } from './context/addSubscriptionContext.jsx'
import { AddSubscriptionSheet } from './components/add-subscription-sheet.jsx'
import { Toaster } from '@/components/ui/sonner'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!PUBLISHABLE_KEY){
  throw new Error('Missing Clerk Key')
}

function GlobalSheet() {
  const { open, setOpen, triggerRefresh } = useAddSub()
  return <AddSubscriptionSheet open={open} onOpenChange={setOpen} onSuccess={triggerRefresh} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <TooltipProvider>
        <BrowserRouter>
          <AddSubProvider>
            <GlobalSheet />
            <Toaster />
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/resources" element={<Resources />} />
            </Routes>
          </AddSubProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ClerkProvider>
  </StrictMode>,
)

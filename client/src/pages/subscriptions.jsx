import { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SubscriptionsTable } from "@/components/subscriptions-table"
import { useAddSub } from "@/context/addSubscriptionContext"
import { toast } from "sonner"

function Subscriptions() {
  const { apiFetch } = useApi()
  const [subscriptions, setSubscriptions] = useState([])
  const { openSheet, refreshKey } = useAddSub()

  async function fetchSubscriptions() {
    const res = await apiFetch("/api/v1/subscriptions")
    const data = await res.json()
    setSubscriptions(data)
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [refreshKey])

  async function handleDelete(id) {
    await apiFetch(`/api/v1/subscriptions/${id}`, { method: "DELETE" })
    setSubscriptions(prev => prev.filter(s => s.id !== id))
  }

  async function handleTestReminder(id) {
    const p = apiFetch(`/api/v1/subscriptions/${id}/test-reminder`, { method: "POST" })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.detail || "Failed to send")
        }
        return res.json()
      })
    toast.promise(p, {
      loading: "Sending test reminder...",
      success: data => `Test reminder sent to ${data.to}`,
      error: "Couldn't send reminder. Check your email settings.",
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Subscriptions</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage all your active subscriptions.</p>
          </div>
          <SubscriptionsTable
            data={subscriptions}
            onDelete={handleDelete}
            onTestReminder={handleTestReminder}
            onAdd={openSheet}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Subscriptions

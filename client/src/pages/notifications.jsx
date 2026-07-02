import { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { BellIcon } from "lucide-react"

function Notifications() {
  const { apiFetch } = useApi()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchNotifications() {
    try {
      const res = await apiFetch("/api/v1/notifications")
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch {
      setNotifications([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">Every reminder email we've sent you.</p>
          </div>

          <div className="px-4 lg:px-6">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
                <BellIcon className="size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No emails sent yet.</p>
                <p className="text-xs text-muted-foreground/70">Reminders you receive will show up here.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {notifications.map(n => (
                  <div key={n.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <BellIcon className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {n.subscription_name}
                          <span className="text-muted-foreground font-normal"> · {n.platform}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Renews {new Date(n.renewal_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {" · sent to "}{n.to_email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {n.kind === "test" && <Badge variant="outline" className="text-muted-foreground">Test</Badge>}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(n.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Notifications

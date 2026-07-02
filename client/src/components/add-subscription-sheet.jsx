import { useState } from "react"
import { useApi } from "@/hooks/useApi"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const CATEGORIES = ["Entertainment", "Productivity", "Developer Tools", "Cloud Storage", "Health & Fitness", "News & Media", "Other"]

const NOTIFY_OPTIONS = [
    { value: 'off', label: 'Off' },
    { value: '0', label: 'On renewal day' },
    { value: '1', label: '1 day before' },
    { value: '3', label: '3 days before' },
    { value: '7', label: '7 days before' },
]

const empty = { name: '', platform: '', cost: '', billing_cycle: '', renewal_date: '', category: '', notify: 'off' }

export function AddSubscriptionSheet({ open, onOpenChange, onSuccess }) {
    const { apiFetch } = useApi()
    const [form, setForm] = useState(empty)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    function set(field, value) {
        setForm(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: '' }))
    }

    function validate() {
        const e = {}
        if (!form.name.trim()) e.name = 'Required'
        if (!form.platform.trim()) e.platform = 'Required'
        if (!form.cost || isNaN(parseFloat(form.cost))) e.cost = 'Enter a valid amount'
        if (!form.billing_cycle) e.billing_cycle = 'Required'
        if (!form.renewal_date) e.renewal_date = 'Required'
        return e
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const e_ = validate()
        if (Object.keys(e_).length) { setErrors(e_); return }

        setIsLoading(true)
        try {
            const res = await apiFetch('/api/v1/subscriptions', {
                method: 'POST',
                body: JSON.stringify({
                    name: form.name.trim(),
                    platform: form.platform.trim(),
                    cost: parseFloat(form.cost),
                    billing_cycle: form.billing_cycle,
                    renewal_date: form.renewal_date,
                    category: form.category || null,
                    notify_days_before: form.notify === 'off' ? null : parseInt(form.notify, 10),
                }),
            })
            if (res.ok) {
                setForm(empty)
                setErrors({})
                onOpenChange(false)
                onSuccess?.()
            } else {
                const data = await res.json()
                setErrors({ general: data.detail || 'Something went wrong.' })
            }
        } catch {
            setErrors({ general: 'Something went wrong.' })
        }
        setIsLoading(false)
    }

    function handleClose() {
        setForm(empty)
        setErrors({})
        onOpenChange(false)
    }

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent className="flex flex-col gap-0 p-0">
                <SheetHeader className="border-b px-6 py-4">
                    <SheetTitle>Add Subscription</SheetTitle>
                    <SheetDescription>Track a new recurring subscription.</SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-5 px-6 py-5">

                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label>Name</Label>
                                <Input placeholder="e.g. Personal Plan" value={form.name} onChange={e => set('name', e.target.value)} />
                                {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label>Platform</Label>
                                <Input placeholder="e.g. Netflix" value={form.platform} onChange={e => set('platform', e.target.value)} />
                                {errors.platform && <span className="text-xs text-red-500">{errors.platform}</span>}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label>Cost</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                    <Input className="pl-7" placeholder="0.00" type="number" step="0.01" min="0" value={form.cost} onChange={e => set('cost', e.target.value)} />
                                </div>
                                {errors.cost && <span className="text-xs text-red-500">{errors.cost}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label>Billing Cycle</Label>
                                <Select value={form.billing_cycle} onValueChange={v => set('billing_cycle', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.billing_cycle && <span className="text-xs text-red-500">{errors.billing_cycle}</span>}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label>Renewal Date</Label>
                                <Input type="date" value={form.renewal_date} onChange={e => set('renewal_date', e.target.value)} />
                                {errors.renewal_date && <span className="text-xs text-red-500">{errors.renewal_date}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label>Category <span className="text-muted-foreground">(optional)</span></Label>
                                <Select value={form.category} onValueChange={v => set('category', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label>Email reminder</Label>
                            <Select value={form.notify} onValueChange={v => set('notify', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Off" />
                                </SelectTrigger>
                                <SelectContent>
                                    {NOTIFY_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <span className="text-xs text-muted-foreground">We'll email you before this subscription renews.</span>
                        </div>

                        {errors.general && <p className="text-xs text-red-500">{errors.general}</p>}
                    </div>

                    <SheetFooter className="border-t px-6 py-4">
                        <Button type="button" variant="outline" onClick={handleClose} className="hover:cursor-pointer">Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="hover:cursor-pointer">
                            {isLoading ? 'Adding...' : 'Add Subscription'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

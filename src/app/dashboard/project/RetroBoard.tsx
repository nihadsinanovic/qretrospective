'use client'

import { addRetroItem } from "@/app/actions/retro"
import { useState } from "react"
import { useRouter } from "next/navigation"

type RetroItem = {
    id: string
    content: string
    type: string
    userId: string | null
}

type RetroBoardProps = {
    retroId: string
    initialItems: RetroItem[]
    currentUser: { id: string; name?: string | null }
}

export function RetroBoard({ retroId, initialItems, currentUser }: RetroBoardProps) {
    const [items, setItems] = useState(initialItems)
    const router = useRouter()

    // Group items
    const startItems = items.filter(i => i.type === 'START')
    const stopItems = items.filter(i => i.type === 'STOP')
    const keepItems = items.filter(i => i.type === 'KEEP')

    async function handleAddItem(e: React.FormEvent<HTMLFormElement>, type: string) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const content = formData.get("content") as string
        if (!content) return

        // Optimistic update
        const tempId = Math.random().toString()
        const newItem = { id: tempId, content, type, userId: currentUser.id }
        setItems([...items, newItem])

            // Reset form
            ; (e.target as HTMLFormElement).reset()

        // Server action
        formData.append("type", type)
        formData.append("retroId", retroId)

        const res = await addRetroItem(formData)
        if (res?.error) {
            // Revert on error (simplified)
            setItems(prev => prev.filter(i => i.id !== tempId))
            alert("Failed to add item")
        } else {
            router.refresh()
        }
    }

    const renderColumn = (title: string, type: string, columnItems: RetroItem[], colorClass: string) => (
        <div className={`card flex flex-col h-full border-t-4 ${colorClass}`}>
            <h3 className="font-bold text-lg mb-4 text-center sticky top-0 bg-card p-2 z-10">{title}</h3>
            <div className="flex-1 overflow-y-auto min-h-[200px] flex flex-col gap-3">
                {columnItems.map(item => (
                    <div key={item.id} className="p-3 bg-background rounded border border-border text-sm">
                        {item.content}
                    </div>
                ))}
                {columnItems.length === 0 && (
                    <div className="text-center text-muted text-xs py-4">No items yet</div>
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
                <form onSubmit={(e) => handleAddItem(e, type)} className="flex gap-2">
                    <input name="content" className="input text-sm p-2" placeholder="Add item..." required autoComplete="off" />
                    <button className="btn btn-secondary px-3">+</button>
                </form>
            </div>
        </div>
    )

    return (
        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {renderColumn("Start Doing", "START", startItems, "border-green-500")}
            {renderColumn("Stop Doing", "STOP", stopItems, "border-red-500")}
            {renderColumn("Keep Doing", "KEEP", keepItems, "border-blue-500")}
        </div>
    )
}

"use client"

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { persistQueryClient } from "@tanstack/react-query-persist-client"
import { useState, useEffect } from "react"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    if (typeof window === "undefined") return

    const localStoragePersister = createSyncStoragePersister({
      key: "offline_images",
      storage: window.localStorage,
    })

    persistQueryClient({
      queryClient,
      persister: localStoragePersister,
    })
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

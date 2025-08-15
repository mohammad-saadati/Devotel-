'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { TodoApp } from '@/components/TodoApp'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

export default function Home() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <TodoApp />
        </main>
      </QueryClientProvider>
    </Provider>
  )
}

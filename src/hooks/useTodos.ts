import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { setTodos, addTodo, updateTodo, deleteTodo } from '@/store/todoSlice'
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo'

const API_BASE_URL = '/api'

// Fetch all todos
export const useTodos = () => {
  const dispatch = useDispatch()
  
  return useQuery({
    queryKey: ['todos'],
    queryFn: async (): Promise<Todo[]> => {
      console.log('Fetching todos from API...')
      const response = await fetch(`${API_BASE_URL}/todos`)
      if (!response.ok) {
        throw new Error('Failed to fetch todos')
      }
      const data = await response.json()
      const todos = data.todos || data
      console.log('Fetched todos:', todos)
      // Sync with Redux store
      dispatch(setTodos(todos))
      return todos
    },
  })
}

// Create a new todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  
  return useMutation({
    mutationFn: async (todoData: CreateTodoRequest): Promise<Todo> => {
      console.log('Sending request to create todo:', todoData)
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create todo')
      }
      
      const newTodo = await response.json()
      console.log('Created todo:', newTodo)
      return newTodo
    },
    onSuccess: (newTodo) => {
      console.log('Todo created successfully:', newTodo)
      // Add to Redux store immediately for optimistic update
      dispatch(addTodo(newTodo))
      // Invalidate and refetch todos to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error) => {
      console.error('Failed to create todo:', error)
    },
  })
}

// Update a todo
export const useUpdateTodo = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: number } & UpdateTodoRequest): Promise<Todo> => {
      console.log('Updating todo:', id, updateData)
      
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updateData }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update todo')
      }
      
      const updatedTodo = await response.json()
      console.log('Updated todo:', updatedTodo)
      return updatedTodo
    },
    onSuccess: (updatedTodo) => {
      // Update Redux store immediately for optimistic update
      dispatch(updateTodo(updatedTodo))
      // Invalidate and refetch todos to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

// Delete a todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      console.log('Deleting todo:', id)
      
      const response = await fetch(`${API_BASE_URL}/todos?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }
      
      console.log('Todo deleted successfully:', id)
    },
    onSuccess: (_, deletedId) => {
      // Remove from Redux store immediately for optimistic update
      dispatch(deleteTodo(deletedId))
      // Invalidate and refetch todos to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

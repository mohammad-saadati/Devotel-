import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { setTodos, addTodo, updateTodo, deleteTodo } from '@/store/todoSlice'
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo'

const API_BASE_URL = 'https://dummyjson.com'

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
      // DummyJSON doesn't actually persist data, so we'll create a mock response
      // that simulates a successful creation
      const mockTodo: Todo = {
        id: Date.now(), // Generate a unique ID
        todo: todoData.todo,
        completed: todoData.completed,
        userId: todoData.userId,
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('Created mock todo:', mockTodo)
      return mockTodo
    },
    onSuccess: (newTodo) => {
      console.log('Todo created successfully:', newTodo)
      // Add to Redux store immediately for optimistic update
      dispatch(addTodo(newTodo))
      // Don't invalidate queries since we're using mock data and managing state in Redux
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Return mock updated todo
      const mockUpdatedTodo: Todo = {
        id,
        todo: updateData.todo || 'Updated todo',
        completed: updateData.completed || false,
        userId: updateData.userId || 1,
      }
      
      console.log('Updated todo:', mockUpdatedTodo)
      return mockUpdatedTodo
    },
    onSuccess: (updatedTodo) => {
      // Update Redux store immediately for optimistic update
      dispatch(updateTodo(updatedTodo))
      // Don't invalidate queries since we're using mock data and managing state in Redux
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      console.log('Todo deleted successfully:', id)
    },
    onSuccess: (_, deletedId) => {
      // Remove from Redux store immediately for optimistic update
      dispatch(deleteTodo(deletedId))
      // Don't invalidate queries since we're using mock data and managing state in Redux
    },
  })
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Todo } from '@/types/todo'

interface TodoState {
  todos: Todo[]
  loading: boolean
  error: string | null
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
}

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.unshift(action.payload)
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(todo => todo.id === action.payload.id)
      if (index !== -1) {
        state.todos[index] = action.payload
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload)
    },
    reorderTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  reorderTodos,
  setLoading,
  setError,
} = todoSlice.actions

export default todoSlice.reducer

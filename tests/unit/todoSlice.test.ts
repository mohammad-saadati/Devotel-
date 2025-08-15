import todoReducer, {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  reorderTodos,
  setLoading,
  setError,
} from '@/store/todoSlice'
import { Todo } from '@/types/todo'

const mockTodo: Todo = {
  id: 1,
  todo: 'Test todo',
  completed: false,
  userId: 1,
}

const mockTodo2: Todo = {
  id: 2,
  todo: 'Test todo 2',
  completed: true,
  userId: 1,
}

describe('todoSlice', () => {
  const initialState = {
    todos: [],
    loading: false,
    error: null,
  }

  it('should return the initial state', () => {
    expect(todoReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle setTodos', () => {
    const todos = [mockTodo, mockTodo2]
    const actual = todoReducer(initialState, setTodos(todos))
    expect(actual.todos).toEqual(todos)
  })

  it('should handle addTodo', () => {
    const actual = todoReducer(initialState, addTodo(mockTodo))
    expect(actual.todos).toEqual([mockTodo])
  })

  it('should handle updateTodo', () => {
    const state = { ...initialState, todos: [mockTodo] }
    const updatedTodo = { ...mockTodo, completed: true }
    const actual = todoReducer(state, updateTodo(updatedTodo))
    expect(actual.todos[0].completed).toBe(true)
  })

  it('should handle deleteTodo', () => {
    const state = { ...initialState, todos: [mockTodo, mockTodo2] }
    const actual = todoReducer(state, deleteTodo(1))
    expect(actual.todos).toEqual([mockTodo2])
  })

  it('should handle reorderTodos', () => {
    const state = { ...initialState, todos: [mockTodo, mockTodo2] }
    const reorderedTodos = [mockTodo2, mockTodo]
    const actual = todoReducer(state, reorderTodos(reorderedTodos))
    expect(actual.todos).toEqual(reorderedTodos)
  })

  it('should handle setLoading', () => {
    const actual = todoReducer(initialState, setLoading(true))
    expect(actual.loading).toBe(true)
  })

  it('should handle setError', () => {
    const errorMessage = 'Test error'
    const actual = todoReducer(initialState, setError(errorMessage))
    expect(actual.error).toBe(errorMessage)
  })
})

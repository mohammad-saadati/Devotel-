import React, { useState, useMemo } from 'react'
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos'
import { Todo } from '@/types/todo'
import { useDispatch, useSelector } from 'react-redux'
import { reorderTodos } from '@/store/todoSlice'
import { RootState } from '@/store'
import { AddTodoForm } from './AddTodoForm'
import { TodoList } from './TodoList'
import { TodoFilters } from './TodoFilters'
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog'
import { ThemeToggle } from './ThemeToggle'
import { Loader2 } from 'lucide-react'

export const TodoApp: React.FC = () => {
  const dispatch = useDispatch()
  
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    todoId: number | null
    todoTitle: string
  }>({
    isOpen: false,
    todoId: null,
    todoTitle: '',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'incomplete'>('all')

  const { isLoading, error } = useTodos()
  const todos = useSelector((state: RootState) => state.todos.todos)
  
  console.log('TodoApp render:', { isLoading, error, todosCount: todos.length, deleteDialog })
  const createTodoMutation = useCreateTodo()
  const updateTodoMutation = useUpdateTodo()
  const deleteTodoMutation = useDeleteTodo()

  const handleAddTodo = (todoData: { todo: string; completed: boolean; userId: number }) => {
    console.log('Adding todo:', todoData)
    createTodoMutation.mutate(todoData)
  }

  const handleToggleTodo = (id: number, completed: boolean) => {
    updateTodoMutation.mutate({ id, completed })
  }

  const handleDeleteTodo = (id: number) => {
    console.log('Delete todo clicked:', id)
    const todo = todos.find(t => t.id === id)
    if (todo) {
      console.log('Setting delete dialog for todo:', todo.todo)
      setDeleteDialog({
        isOpen: true,
        todoId: id,
        todoTitle: todo.todo,
      })
    }
  }

  const confirmDelete = () => {
    if (deleteDialog.todoId) {
      deleteTodoMutation.mutate(deleteDialog.todoId)
      setDeleteDialog({ isOpen: false, todoId: null, todoTitle: '' })
    }
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, todoId: null, todoTitle: '' })
  }

  const handleReorderTodos = (newTodos: Todo[]) => {
    // Update the Redux store with the new order
    // This will persist the order in the application state
    dispatch(reorderTodos(newTodos))
  }

  // Filter and search todos
  const filteredTodos = useMemo(() => {
    let filtered = todos

    // Filter by status
    if (filterStatus === 'completed') {
      filtered = filtered.filter(todo => todo.completed)
    } else if (filterStatus === 'incomplete') {
      filtered = filtered.filter(todo => !todo.completed)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(todo =>
        todo.todo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [todos, filterStatus, searchTerm])

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400">Error loading todos: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ThemeToggle />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Todo App</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your tasks efficiently</p>
      </div>

      <div className="mb-6">
        <AddTodoForm
          onSubmit={handleAddTodo}
          isLoading={createTodoMutation.isPending}
        />
      </div>

      <TodoFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
        </div>
      ) : (
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onReorder={handleReorderTodos}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        todoTitle={deleteDialog.todoTitle}
        isLoading={deleteTodoMutation.isPending}
      />
    </div>
  )
}

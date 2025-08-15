import React from 'react'
import { Todo } from '@/types/todo'
import { Button } from '@/components/ui/button'
import { Trash2, CheckCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
  isDragging?: boolean
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  isDragging = false,
}) => {
  return (
    <div
      data-testid="todo-item"
      className={cn(
        "flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md dark:hover:shadow-lg",
        isDragging && "opacity-50 rotate-2",
        todo.completed && "bg-gray-50 dark:bg-gray-700"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onToggle(todo.id, !todo.completed)
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
        className="flex-shrink-0"
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400" />
        )}
      </Button>
      
      <span
        className={cn(
          "flex-1 text-sm font-medium transition-all duration-200 text-gray-900 dark:text-gray-100",
          todo.completed && "line-through text-gray-500 dark:text-gray-400"
        )}
      >
        {todo.todo}
      </span>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('Delete button clicked for todo:', todo.id, todo.todo)
          onDelete(todo.id)
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
        aria-label="Delete todo"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

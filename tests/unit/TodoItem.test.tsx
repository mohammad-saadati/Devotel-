import React from 'react'
import { render, screen, fireEvent } from './test-utils'
import { TodoItem } from '@/components/TodoItem'
import { Todo } from '@/types/todo'

const mockTodo: Todo = {
  id: 1,
  todo: 'Test todo item',
  completed: false,
  userId: 1,
}

const mockOnToggle = jest.fn()
const mockOnDelete = jest.fn()

describe('TodoItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders todo item correctly', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Test todo item')).toBeInTheDocument()
  })

  it('shows completed state correctly', () => {
    const completedTodo = { ...mockTodo, completed: true }
    
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const todoText = screen.getByText('Test todo item')
    expect(todoText).toHaveClass('line-through')
  })

  it('calls onToggle when toggle button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const toggleButton = screen.getByRole('button', { name: /mark as complete/i })
    fireEvent.click(toggleButton)

    expect(mockOnToggle).toHaveBeenCalledWith(1, true)
  })

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete todo/i })
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(1)
  })

  it('applies dragging styles when isDragging is true', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        isDragging={true}
      />
    )

    const todoItem = screen.getByText('Test todo item').closest('div')
    expect(todoItem).toHaveClass('opacity-50', 'rotate-2')
  })
})

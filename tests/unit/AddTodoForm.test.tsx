import React from 'react'
import { render, screen, fireEvent, waitFor } from './test-utils'
import { AddTodoForm } from '@/components/AddTodoForm'

const mockOnSubmit = jest.fn()

describe('AddTodoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form correctly', () => {
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: /add/i })

    fireEvent.change(input, { target: { value: 'New todo item' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        todo: 'New todo item',
        completed: false,
        userId: 1,
      })
    })
  })

  it('shows validation error for empty todo', async () => {
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /add/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Todo title is required')).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error for todo that is too long', async () => {
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: /add/i })

    const longTodo = 'a'.repeat(101)
    fireEvent.change(input, { target: { value: longTodo } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Todo title must be less than 100 characters')).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('disables submit button when loading', () => {
    render(<AddTodoForm onSubmit={mockOnSubmit} isLoading={true} />)

    const submitButton = screen.getByRole('button', { name: /add/i })
    expect(submitButton).toBeDisabled()
  })

  it('clears form after successful submission', async () => {
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: /add/i })

    fireEvent.change(input, { target: { value: 'New todo item' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    expect(input).toHaveValue('')
  })
})

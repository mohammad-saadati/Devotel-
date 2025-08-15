import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTodoSchema, CreateTodoFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddTodoFormProps {
  onSubmit: (data: CreateTodoFormData) => void
  isLoading?: boolean
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      todo: '',
      completed: false,
      userId: 1,
    },
  })

  const handleFormSubmit = (data: CreateTodoFormData) => {
    console.log('Form submitted with data:', data)
    onSubmit(data)
    reset()
  }

  return (
    <form 
      onSubmit={(e) => {
        console.log('Form submit event triggered')
        handleSubmit(handleFormSubmit)(e)
      }} 
      className="space-y-4"
    >
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            {...register('todo')}
            placeholder="Add a new todo..."
            className={cn(
              errors.todo && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.todo && (
            <p className="mt-1 text-sm text-red-500">{errors.todo.message}</p>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          onClick={() => console.log('Add button clicked')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
    </form>
  )
}



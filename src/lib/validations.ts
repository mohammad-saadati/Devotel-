import { z } from "zod"

export const createTodoSchema = z.object({
  todo: z.string().min(1, "Todo title is required").max(100, "Todo title must be less than 100 characters"),
  completed: z.boolean().default(false),
  userId: z.number().default(1)
})

export const updateTodoSchema = z.object({
  todo: z.string().min(1, "Todo title is required").max(100, "Todo title must be less than 100 characters").optional(),
  completed: z.boolean().optional()
})

export type CreateTodoFormData = z.infer<typeof createTodoSchema>
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>

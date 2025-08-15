export interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export interface CreateTodoRequest {
  todo: string
  completed: boolean
  userId: number
}

export interface UpdateTodoRequest {
  completed?: boolean
  todo?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface TodosResponse {
  todos: Todo[]
  total: number
  skip: number
  limit: number
}

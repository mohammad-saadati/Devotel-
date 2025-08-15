import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for testing
let todos = [
  {
    id: 1,
    todo: "Learn React",
    completed: false,
    userId: 1
  },
  {
    id: 2,
    todo: "Build a todo app",
    completed: true,
    userId: 1
  },
  {
    id: 3,
    todo: "Write tests",
    completed: false,
    userId: 1
  }
]

export async function GET() {
  return NextResponse.json({ todos })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newTodo = {
    id: Date.now(),
    todo: body.todo,
    completed: body.completed || false,
    userId: body.userId || 1
  }
  todos.push(newTodo)
  return NextResponse.json(newTodo, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, ...updateData } = body
  
  const todoIndex = todos.findIndex(todo => todo.id === id)
  if (todoIndex === -1) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }
  
  todos[todoIndex] = { ...todos[todoIndex], ...updateData }
  return NextResponse.json(todos[todoIndex])
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id') || '0')
  
  // Special case: if id is 0, reset all todos (for testing)
  if (id === 0) {
    todos = [
      {
        id: 1,
        todo: "Learn React",
        completed: false,
        userId: 1
      },
      {
        id: 2,
        todo: "Build a todo app",
        completed: true,
        userId: 1
      },
      {
        id: 3,
        todo: "Write tests",
        completed: false,
        userId: 1
      }
    ]
    return NextResponse.json({ success: true, message: 'Todos reset' })
  }
  
  const todoIndex = todos.findIndex(todo => todo.id === id)
  if (todoIndex === -1) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  }
  
  todos.splice(todoIndex, 1)
  return NextResponse.json({ success: true })
}

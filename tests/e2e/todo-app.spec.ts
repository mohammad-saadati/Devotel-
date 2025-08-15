import { test, expect } from '@playwright/test'

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    // Reset the API state by making a request to reset todos
    await page.request.delete('/api/todos?id=0')
    
    // Navigate to the page
    await page.goto('/')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
  })

  test('should display the todo app title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible()
    await expect(page.getByText('Manage your tasks efficiently')).toBeVisible()
  })

  test('should load todos from API', async ({ page }) => {
    // Wait for todos to load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 })
    
    // Check that todos are displayed
    const todoItems = await page.locator('[data-testid="todo-item"]').count()
    expect(todoItems).toBeGreaterThan(0)
  })

  test('should add a new todo', async ({ page }) => {
    const newTodoText = `Test new todo item ${Date.now()}`
    
    // Fill the input and submit
    await page.fill('input[placeholder="Add a new todo..."]', newTodoText)
    await page.click('button:has-text("Add")')
    
    // Wait for the new todo to appear
    await expect(page.getByText(newTodoText)).toBeVisible()
  })

  test('should toggle todo completion status', async ({ page }) => {
    // Wait for todos to load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 })
    
    // Get the first todo item
    const firstTodo = page.locator('[data-testid="todo-item"]').first()
    const todoText = await firstTodo.locator('span').textContent()
    
    // Click the toggle button
    await firstTodo.locator('button').first().click()
    
    // Check that the todo is marked as completed
    await expect(firstTodo.locator('span')).toHaveClass(/line-through/)
  })

  test('should show delete confirmation dialog', async ({ page }) => {
    // Wait for todos to load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 })
    
    // Get the first todo item
    const firstTodo = page.locator('[data-testid="todo-item"]').first()
    const todoText = await firstTodo.locator('span').textContent()
    
    // Click the delete button
    await firstTodo.locator('button').last().click()
    
    // Check that the confirmation dialog appears
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Delete Todo')).toBeVisible()
    await expect(page.getByText(`Are you sure you want to delete "${todoText}"?`)).toBeVisible()
  })

  test('should cancel delete operation', async ({ page }) => {
    // Wait for todos to load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 })
    
    // Get the first todo item
    const firstTodo = page.locator('[data-testid="todo-item"]').first()
    const initialCount = await page.locator('[data-testid="todo-item"]').count()
    
    // Click the delete button
    await firstTodo.locator('button').last().click()
    
    // Click cancel in the dialog
    await page.click('button:has-text("Cancel")')
    
    // Check that the dialog is closed and todo still exists
    await expect(page.getByRole('dialog')).not.toBeVisible()
    const finalCount = await page.locator('[data-testid="todo-item"]').count()
    expect(finalCount).toBe(initialCount)
  })

  test('should show validation error for empty todo', async ({ page }) => {
    // Try to submit empty form
    await page.click('button:has-text("Add")')
    
    // Check that validation error appears
    await expect(page.getByText('Todo title is required')).toBeVisible()
  })

  test('should show validation error for long todo', async ({ page }) => {
    const longTodo = 'a'.repeat(101)
    
    // Fill the input with a very long todo
    await page.fill('input[placeholder="Add a new todo..."]', longTodo)
    
    // Try to submit the form
    await page.click('button:has-text("Add")')
    
    // Wait a bit for validation to process
    await page.waitForTimeout(100)
    
    // Check that validation error appears
    await expect(page.getByText('Todo title must be less than 100 characters')).toBeVisible()
  })
})

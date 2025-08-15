import { renderHook, act } from '@testing-library/react'
import { useTheme } from '@/hooks/useTheme'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    document.documentElement.classList.remove('dark')
  })

  it('should initialize with light theme by default', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should load theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark')
    
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should toggle theme correctly', () => {
    localStorageMock.getItem.mockReturnValue('light')
    
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.theme).toBe('light')
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('should save theme to localStorage when toggled', () => {
    localStorageMock.getItem.mockReturnValue('light')
    
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark')
  })
})

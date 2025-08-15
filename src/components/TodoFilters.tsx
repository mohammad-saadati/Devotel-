import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'

interface TodoFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  filterStatus: 'all' | 'completed' | 'incomplete'
  onFilterChange: (status: 'all' | 'completed' | 'incomplete') => void
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('all')}
        >
          All
        </Button>
        <Button
          variant={filterStatus === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('completed')}
        >
          Completed
        </Button>
        <Button
          variant={filterStatus === 'incomplete' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('incomplete')}
        >
          Incomplete
        </Button>
      </div>
    </div>
  )
}

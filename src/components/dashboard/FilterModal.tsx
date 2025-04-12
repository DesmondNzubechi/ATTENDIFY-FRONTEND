
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export type FilterOption = {
  id: string;
  label: string;
  checked: boolean;
  group?: string;
};

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  options: FilterOption[];
  onApplyFilters: (filteredOptions: FilterOption[]) => void;
  groups?: string[];
}

export function FilterModal({
  open,
  onOpenChange,
  title = 'Filter content',
  options,
  onApplyFilters,
  groups = [],
}: FilterModalProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>(options);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCheckboxChange = (id: string) => {
    setFilterOptions(
      filterOptions.map((option) =>
        option.id === id ? { ...option, checked: !option.checked } : option
      )
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters(filterOptions);
    onOpenChange(false);
  };

  const filteredOptions = filterOptions.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Filter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          {groups.length > 0 && (
            <div className="flex gap-2">
              {groups.map((group) => (
                <Button
                  key={group}
                  variant="outline"
                  className={group === 'Faculty' ? 'bg-blue-500 text-white' : ''}
                >
                  {group}
                </Button>
              ))}
            </div>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={option.checked}
                  onCheckedChange={() => handleCheckboxChange(option.id)}
                />
                <label
                  htmlFor={option.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleApplyFilters}>Apply</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  academicSessions?: { sessionId: string; sessionName: string }[];
  onSelectAcademicSession?: (id: string) => void;
  selectedAcademicSession?: string;
}

export function FilterModal({
  open,
  onOpenChange,
  title = "Filter content",
  options,
  onApplyFilters,
  groups = [],
  academicSessions = [],
  onSelectAcademicSession,
  selectedAcademicSession = "",
}: FilterModalProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>(options);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(
    groups.length > 0 ? groups[0] : null
  );
  const [localSelectedSession, setLocalSelectedSession] = useState(
    selectedAcademicSession
  );

  console.log("Academic session is here", academicSessions);
  const handleCheckboxChange = (id: string) => {
    setFilterOptions(
      filterOptions.map((option) =>
        option.id === id ? { ...option, checked: !option.checked } : option
      )
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters(filterOptions);
    if (onSelectAcademicSession && localSelectedSession) {
      onSelectAcademicSession(localSelectedSession);
    }
    onOpenChange(false);
  };

  const handleAcademicSessionChange = (value: string) => {
    setLocalSelectedSession(value);
  };

  const filteredOptions = filterOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!activeGroup || !option.group || option.group === activeGroup)
  );

  const handleResetFilters = () => {
    setFilterOptions(options.map((opt) => ({ ...opt, checked: false })));
    setSearchQuery("");
    setActiveGroup(groups.length > 0 ? groups[0] : null);
    setLocalSelectedSession("");
    onOpenChange(false);
  };

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
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <Button
                  key={group}
                  variant="outline"
                  className={
                    activeGroup === group ? "bg-blue-500 text-white" : ""
                  }
                  onClick={() => setActiveGroup(group)}
                >
                  {group}
                </Button>
              ))}
            </div>
          )}

          {academicSessions.length > 0 && onSelectAcademicSession && (
            <div className="space-y-2">
              <Label htmlFor="academic-session">Academic Session</Label>
              <Select
                value={localSelectedSession}
                onValueChange={handleAcademicSessionChange}
              >
                <SelectTrigger id="academic-session">
                  <SelectValue placeholder="Select Academic Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  {academicSessions.map((session) => (
                    <SelectItem
                      key={session.sessionId}
                      value={session.sessionId}
                    >
                      {session.sessionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <div className="flex gap-4 justify-between">
              <Button variant="outline" onClick={handleResetFilters}>
                Reset
              </Button>
              <Button onClick={handleApplyFilters}>Apply</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

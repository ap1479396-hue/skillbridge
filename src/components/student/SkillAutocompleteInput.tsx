import React, { useState, useEffect, useRef, useMemo } from 'react';
import { searchIndustrySkills, IndustrySkill } from '../../data/industrySkills';
import { Skill } from '../../types';
import { Search, Check, Sparkles, AlertCircle } from 'lucide-react';

interface SkillAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectSkill: (skill: IndustrySkill) => void;
  existingSkills: Skill[];
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const SkillAutocompleteInput: React.FC<SkillAutocompleteInputProps> = ({
  value,
  onChange,
  onSelectSkill,
  existingSkills,
  placeholder = 'Enter skill name (e.g. React, Docker)',
  className = '',
  onKeyDown: parentKeyDown
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Search industry skills based on typed value
  const suggestions = useMemo(() => {
    if (!value || value.trim().length === 0) return [];
    return searchIndustrySkills(value, 8);
  }, [value]);

  // Check if current input matches an existing skill in student profile
  const isAlreadyAdded = useMemo(() => {
    if (!value.trim()) return false;
    return existingSkills.some(
      (s) => s.name.toLowerCase() === value.trim().toLowerCase()
    );
  }, [value, existingSkills]);

  // Open dropdown when suggestions change and input is focused
  useEffect(() => {
    if (suggestions.length > 0 && document.activeElement === inputRef.current) {
      setIsOpen(true);
      setSelectedIndex(0); // Default to first item for quick Enter selection
    } else {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [suggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Ensure active list item stays visible in scroll view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (skill: IndustrySkill) => {
    onChange(skill.name);
    onSelectSkill(skill);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isOpen && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        return;
      }
      if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          handleSelect(suggestions[selectedIndex]);
          return;
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        return;
      }
      if (e.key === 'Tab') {
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          handleSelect(suggestions[selectedIndex]);
          return;
        }
      }
    }

    if (parentKeyDown) {
      parentKeyDown(e);
    }
  };

  // Helper to render matched text with bold highlighting
  const renderHighlightedName = (name: string, query: string) => {
    if (!query.trim()) return name;
    const cleanQuery = query.trim();
    const index = name.toLowerCase().indexOf(cleanQuery.toLowerCase());
    if (index === -1) return name;

    const before = name.substring(0, index);
    const match = name.substring(index, index + cleanQuery.length);
    const after = name.substring(index + cleanQuery.length);

    return (
      <span>
        {before}
        <span className="text-indigo-400 font-bold underline decoration-indigo-500/50 underline-offset-2">
          {match}
        </span>
        {after}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen && e.target.value.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full text-xs px-3 py-2 bg-slate-900 border ${
            isAlreadyAdded
              ? 'border-amber-500/60 focus:border-amber-400'
              : 'border-slate-800 focus:border-indigo-500'
          } text-white placeholder-slate-500 rounded-lg focus:outline-none transition shadow-inner ${className}`}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Existing skill duplicate warning badge inside input */}
        {isAlreadyAdded && (
          <div className="absolute right-2.5 flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 pointer-events-none">
            <Check className="w-3 h-3" />
            <span>Already Added</span>
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-slate-900/98 backdrop-blur-xl border border-indigo-500/30 rounded-xl shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-indigo-400">
              <Sparkles className="w-3 h-3" />
              Predefined Industry Skills
            </span>
            <span className="hidden sm:inline text-slate-500">
              Use ↑ ↓ to navigate, Enter to select
            </span>
          </div>

          <ul
            ref={listRef}
            className="max-h-56 overflow-y-auto divide-y divide-slate-800/60 p-1 space-y-0.5"
            role="listbox"
          >
            {suggestions.map((skill, index) => {
              const isSelected = index === selectedIndex;
              const alreadyHas = existingSkills.some(
                (s) => s.name.toLowerCase() === skill.name.toLowerCase()
              );

              return (
                <li
                  key={skill.name}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleSelect(skill)}
                  className={`px-3 py-2 rounded-lg cursor-pointer text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/25 text-white border-l-2 border-indigo-500 pl-2.5'
                      : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {renderHighlightedName(skill.name, value)}
                    </span>
                    {skill.inDemand && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                        In-Demand
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800">
                      {skill.category}
                    </span>
                    {alreadyHas && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-medium">
                        <Check className="w-3 h-3" />
                        <span className="hidden sm:inline">In Profile</span>
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="px-3 py-1 bg-slate-950/90 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
            <span>{suggestions.length} matched from verified industry database</span>
            <span className="font-mono text-indigo-400/80">SkillBridge Verified</span>
          </div>
        </div>
      )}
    </div>
  );
};

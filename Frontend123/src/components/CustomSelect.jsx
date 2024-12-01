import React from 'react';
import CreatableSelect from "react-select/creatable";




const CustomSelect = ({ options, value, onChange, onCreateOption  , placeholder = 'Select option...' ,isSearchable = false }) => {
  return (
    <div className="w-full">
      <CreatableSelect 
        options={options}
        value={value}
        onChange={onChange}
        isSearchable={isSearchable}
        onCreateOption={onCreateOption}
        placeholder={placeholder}
        className="text-sm"
        classNamePrefix="select"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            neutral0: 'var(--select-bg)',
            neutral5: 'var(--select-hover)',
            neutral10: 'var(--select-hover)',
            neutral20: 'var(--select-border)',
            neutral30: 'var(--select-border-hover)',
            neutral40: 'var(--select-text-placeholder)',
            neutral50: 'var(--select-text-placeholder)',
            neutral60: 'var(--select-text-placeholder)',
            neutral70: 'var(--select-text)',
            neutral80: 'var(--select-text)',
            neutral90: 'var(--select-text)',
            primary: 'var(--select-primary)',
            primary25: 'var(--select-primary-hover)',
            primary50: 'var(--select-primary-hover)',
            primary75: 'var(--select-primary-hover)'
          },
        })}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: 'var(--select-bg)',
            borderColor: state.isFocused ? 'var(--select-border-focus)' : 'var(--select-border)',
            boxShadow: state.isFocused ? '0 0 0 1px var(--select-border-focus)' : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'var(--select-border-hover)',
              backgroundColor: 'var(--select-hover)'
            }
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'var(--select-bg)',
            border: '1px solid var(--select-border)'
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected 
              ? 'var(--select-primary)' 
              : isFocused 
                ? 'var(--select-primary-hover)'
                : 'transparent',
            color: isSelected 
              ? 'white' 
              : 'var(--select-text)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, var(--select-gradient-start), var(--select-gradient-end))',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              zIndex: -1
            },
            '&:active': {
              backgroundColor: 'var(--select-primary)',
              color: 'white'
            },
            '&:hover': {
              color: 'white',
              backgroundColor: 'transparent',
              transform: 'translateX(4px)',
              '&::before': {
                opacity: 1
              }
            }
          }),
          singleValue: (base) => ({
            ...base,
            color: 'var(--select-text)'
          }),
          input: (base) => ({
            ...base,
            color: 'var(--select-text)'
          }),
          indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: 'var(--select-border)'
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: 'var(--select-text-placeholder)',
            transition: 'color 0.2s ease',
            '&:hover': {
              color: 'var(--select-text)'
            }
          })
        }}
      />

      <style>{`
        :root {
          --select-hover: #f7fafc;
          --select-primary-hover: #ebf8ff;
          --select-bg: white;
          --select-text: #1a202c;
          --select-text-placeholder: #718096;
          --select-border: #e2e8f0;
          --select-border-hover: #cbd5e0;
          --select-border-focus: #4299e1;
          --select-primary: #4299e1;
          --select-primary-darker: #3182ce;
          --select-gradient-start: #4299e1;
          --select-gradient-end: #667eea;
        }

        .dark {
          --select-hover: #374151;
          --select-primary-hover: #1f2937;
          --select-bg: #1f2937;
          --select-text: #f3f4f6;
          --select-text-placeholder: #9ca3af;
          --select-border: #374151;
          --select-border-hover: #4b5563;
          --select-border-focus: #60a5fa;
          --select-primary: #3b82f6;
          --select-primary-darker: #2563eb;
          --select-gradient-start: #3b82f6;
          --select-gradient-end: #6366f1;
        }
      `}</style>
    </div>
  );
};


export default CustomSelect;
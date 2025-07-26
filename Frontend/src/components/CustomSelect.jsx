import React from 'react';
import CreatableSelect from "react-select/creatable";




const CustomSelect = ({ options, value, onChange, onCreateOption  , placeholder = 'Select option...' ,isSearchable = false }) => {
  return (
    <div className="w-full ">
      <CreatableSelect 
        options={options}
        value={value}
        onChange={onChange}
        isSearchable={isSearchable}
        onCreateOption={onCreateOption}
        placeholder={placeholder}
        className="text-base"
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
            backdropFilter: 'blur(20px)',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'var(--select-border-hover)',
              backgroundColor: 'var(--select-hover)'
            }
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'var(--select-bg)',
            border: '1px solid var(--select-border)',
            backdropFilter: 'blur(20px)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
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
          --select-hover: rgba(255, 255, 255, 0.1);
          --select-primary-hover: rgba(99, 102, 241, 0.1);
          --select-bg: rgba(255, 255, 255, 0.1);
          --select-text: #ffffff;
          --select-text-placeholder: #d1d5db;
          --select-border: rgba(255, 255, 255, 0.2);
          --select-border-hover: rgba(255, 255, 255, 0.3);
          --select-border-focus: rgba(99, 102, 241, 0.5);
          --select-primary: rgba(99, 102, 241, 0.8);
          --select-primary-darker: rgba(79, 70, 229, 0.9);
          --select-gradient-start: #6366f1;
          --select-gradient-end: #8b5cf6;
        }

        .dark {
          --select-hover: rgba(0, 0, 0, 0.1);
          --select-primary-hover: rgba(59, 130, 246, 0.1);
          --select-bg: rgba(0, 0, 0, 0.1);
          --select-text: #ffffff;
          --select-text-placeholder: #d1d5db;
          --select-border: rgba(255, 255, 255, 0.1);
          --select-border-hover: rgba(255, 255, 255, 0.2);
          --select-border-focus: rgba(59, 130, 246, 0.5);
          --select-primary: rgba(59, 130, 246, 0.8);
          --select-primary-darker: rgba(37, 99, 235, 0.9);
          --select-gradient-start: #3b82f6;
          --select-gradient-end: #6366f1;
        }
      `}</style>
    </div>
  );
};


export default CustomSelect;
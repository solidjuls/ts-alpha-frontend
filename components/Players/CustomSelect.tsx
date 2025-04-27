import React from "react";
import { components } from "react-select";

// Custom Option component with checkbox
export const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
            style={{ marginRight: '8px' }}
          />
          <label>{props.label}</label>
        </div>
      </components.Option>
    </div>
  );
};

// Custom component to separate input from selected values
export const CustomSelectContainer = ({ children, ...props }: any) => {
  const { getValue, selectProps } = props;
  const selectedValues = getValue();
  
  // Function to clear the input element
  const clearInput = () => {
    // Find the input element within the container
    const inputElement = document.querySelector(`input[aria-label="${selectProps['aria-label'] || 'Select'}"]`) as HTMLInputElement;
    if (inputElement) {
      // Clear the input value
      inputElement.value = '';
      
      // Dispatch an input event to trigger React Select's internal handlers
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(inputEvent);
    }
    
    // Also call the onInputChange handler
    if (selectProps.onInputChange) {
      selectProps.onInputChange('', { action: 'input-change' });
    }
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%',
      maxWidth: '300px',
      position: 'relative'
    }}>
      <div style={{ 
        border: '1px solid #ccc', 
        borderRadius: '4px',
        padding: '8px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {children}
      </div>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '4px', 
        marginTop: '4px',
        padding: '4px',
        height: '40px',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        {selectedValues && selectedValues.length > 0 ? (
          selectedValues.map((value: any, index: number) => (
            <div 
              key={index}
              style={{
                backgroundColor: '#e2e8f0',
                borderRadius: '4px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '12px',
                maxWidth: '100%',
                height: '24px',
                overflow: 'hidden'
              }}
            >
              <span style={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap',
                maxWidth: '150px'
              }}>
                {value.label}
              </span>
              <button
                onClick={() => {
                  const newValue = [...selectedValues];
                  newValue.splice(index, 1);
                  selectProps.onChange(newValue, { action: 'remove-value', removedValue: value });
                  
                  // Clear the input
                  clearInput();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  marginLeft: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#666',
                  flexShrink: 0,
                  padding: '0 2px'
                }}
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <div style={{
            color: '#999',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}>
            
          </div>
        )}
      </div>
    </div>
  );
}; 
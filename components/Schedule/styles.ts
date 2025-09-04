import { styled } from "stitches.config";

export const Title = styled('span', {
    fontWeight: '600',
    textDecoration: 'underline'
})


export const FileInput = styled('input', {
  padding: '8px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '14px',
  backgroundColor: 'white',
  cursor: 'pointer',
  color: '$text',
  '&::file-selector-button': {
    padding: '6px 12px',
    border: 'none',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    marginRight: '12px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
});
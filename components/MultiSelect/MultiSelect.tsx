import { useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { globalMultiselectStyles, styled } from "stitches.config";

const StyledMultiSelect = styled(MultiSelect, {
  width: '250px',
  padding: '0',
  // '&.p-multiselect-header': {
  //   display: 'none'
  // }
});

// '& .p-multiselect-header': {
//   display: (props) => (props.filter ? 'flex' : 'none'),
// },
const MultiSelectComponent = ({
  items,
  onChange,
  placeholder,
  selectedValues,
  setSelectedValues,
  filter = true,
  selectionLimit = null
}) => {
  // useEffect(() => {
  //   globalMultiselectStyles(filter)();
  // }, []);

  if (!items) return null;

  const selectedItemTemplate = (option) => option?.name

  return (
    <StyledMultiSelect
      className="w-full"
      value={selectedValues}
      showSelectAll={false}
      onChange={(e) => setSelectedValues(e.value)}
      options={items}
      optionLabel="name"
      placeholder={placeholder}
      selectionLimit={selectionLimit}
      selectedItemTemplate={selectionLimit === 1 ? selectedItemTemplate : null}
      maxSelectedLabels={selectionLimit === 1 ? 1 : 0}
      className={'p-multiselect-hidden'}
      filter={filter}
    />
  );
};

export default MultiSelectComponent;

import { useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { styled } from "stitches.config";

const StyledMultiSelect = styled(MultiSelect, {
  width: "250px",
  padding: "0",
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
  closeOnSelect = true,
  selectionLimit = null,
}) => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  if (!items) return null;

  const selectedItemTemplate = (option) => option?.name;

  const handleChange = (e) => {
    setSelectedValues(e.value);
    setOverlayVisible(false);
    console.log("give some rope");
  };

  const handleShow = () => setOverlayVisible(true);

  const handleHide = () => setOverlayVisible(false);

  const getOptionalProps = () => {
    if (closeOnSelect) {
      return {
        onShow: handleShow,
        onHide: handleHide,
      };
    }

    return undefined;
  };

  return (
    <StyledMultiSelect
      className="w-full"
      value={selectedValues}
      showSelectAll={false}
      onChange={handleChange}
      options={items}
      optionLabel="name"
      overlayVisible={overlayVisible}
      placeholder={placeholder}
      selectionLimit={selectionLimit}
      // onToggle={(e) => {
      //   console.log("e.visible", e.visible);
      //   setOverlayVisible(e.visible);
      // }}
      selectedItemTemplate={selectionLimit === 1 ? selectedItemTemplate : null}
      maxSelectedLabels={selectionLimit === 1 ? 1 : 0}
      filter={filter}
      {...getOptionalProps()}
    />
  );
};

export default MultiSelectComponent;

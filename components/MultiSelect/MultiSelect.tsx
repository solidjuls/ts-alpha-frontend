import { useState } from "react";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { styled } from "stitches.config";
import { MultiSelectItemType } from "types/types";

const StyledMultiSelect = styled(MultiSelect, {
  width: "250px",
  padding: "0",
});

type MultiSelectComponentProps = {
  items: MultiSelectItemType[];
  placeholder: string;
  selectedValues: string[];
  setSelectedValues: (value: string) => void;
  filter?: boolean;
  closeOnSelect?: boolean;
  selectionLimit?: number;
};

const MultiSelectComponent: React.FC<MultiSelectComponentProps> = ({
  items,
  placeholder,
  selectedValues,
  setSelectedValues,
  filter = true,
  closeOnSelect = true,
  selectionLimit,
}) => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  if (!items) return null;

  const selectedItemTemplate = (option: MultiSelectItemType) => option?.name;

  const handleChange = (e: MultiSelectChangeEvent) => {
    setSelectedValues(e.value);
    setOverlayVisible(false);
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
      selectedItemTemplate={selectionLimit === 1 ? selectedItemTemplate : null}
      maxSelectedLabels={selectionLimit === 1 ? 1 : 0}
      filter={filter}
      showClear
      {...getOptionalProps()}
    />
  );
};

export default MultiSelectComponent;

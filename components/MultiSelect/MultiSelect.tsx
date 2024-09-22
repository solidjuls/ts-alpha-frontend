import { useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { globalMultiselectStyles } from "stitches.config";

const MultiSelectComponent = ({
  items,
  onChange,
  placeholder,
  selectedValues,
  setSelectedValues,
}) => {
  if (!items) return null;
  globalMultiselectStyles();

  return (
    <MultiSelect
      className="w-full"
      value={selectedValues}
      showSelectAll={false}
      onChange={(e) => setSelectedValues(e.value)}
      options={items}
      optionLabel="name"
      placeholder={placeholder}
      maxSelectedLabels={0}
      filter
      showClear
    />
  );
};

export default MultiSelectComponent;

import { useMemo, useState } from "react";
import useFetchInitialData from "hooks/useFetchInitialData";

import { MultiSelect } from "primereact/multiselect";
import { globalMultiselectStyles } from "stitches.config";

const MultiSelectComponent = ({ items, onChange, placeholder }) => {
  const [selectedValues, setSelectedValues] = useState([]);

  if (!items) return null;
  globalMultiselectStyles();
  return (
    <MultiSelect
      className="w-full"
      value={selectedValues}
      showSelectAll={false}
      onChange={(e) => {
        onChange(e.value.map((item) => item.code));
        setSelectedValues(e.value);
      }}
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

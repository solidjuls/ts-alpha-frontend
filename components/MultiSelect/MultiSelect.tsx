import { useMemo, useState } from "react";
import useFetchInitialData from "hooks/useFetchInitialData";

import { MultiSelect } from "primereact/multiselect";
import { globalMultiselectStyles } from "stitches.config";

const getNameFromUsers = (data) => data?.map((item) => ({ code: item.id, name: item.name }));
const MultiSelectComponent = ({ items }) => {
  const { data, error } = useFetchInitialData({ url: "/api/user", cacheId: "user-list" });
  const [selectedValues, setSelectedValues] = useState([]);

  const dataMemo = useMemo(() => {
    return getNameFromUsers(data);
  }, [data]);

  if (!data) return null;
  globalMultiselectStyles();
  return (
    <MultiSelect
      value={selectedValues}
      showSelectAll={false}
      onChange={(e) => setSelectedValues(e.value)}
      options={dataMemo}
      optionLabel="name"
      filter
      placeholder="Select Players..."
      maxSelectedLabels={0}
      showClear
      className="w-full"
    />
  );
};

export default MultiSelectComponent;

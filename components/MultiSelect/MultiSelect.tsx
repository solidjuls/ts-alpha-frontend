"use client";
import { useMemo, useState, useTransition } from "react";
import * as Ariakit from "@ariakit/react";
// import { matchSorter } from 'match-sorter';

const list = [
  "Apple",
  "Bacon",
  "Banana",
  "Broccoli",
  "Burger",
  "Cake",
  "Candy",
  "Carrot",
  "Cherry",
  "Chocolate",
  "Cookie",
  "Cucumber",
  "Donut",
  "Fish",
  "Fries",
  "Grape",
  "Green apple",
  "Hot dog",
  "Ice cream",
  "Kiwi",
  "Lemon",
  "Lollipop",
  "Onion",
  "Orange",
  "Pasta",
  "Pineapple",
  "Pizza",
  "Potato",
  "Salad",
  "Sandwich",
  "Steak",
  "Strawberry",
  "Tomato",
  "Watermelon",
];

const popoverStyles = {
  position: "relative",
  zIndex: 50,
  display: "flex",
  maxHeight: "min(var(--popover-available-height, 300px), 300px)",
  flexDirection: "column",
  overflow: "auto",
  overscrollBehavior: "contain",
  borderRadius: "0.5rem",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "hsl(204 20% 88%)",
  backgroundColor: "hsl(204 20% 100%)",
  padding: "0.5rem",
  color: "hsl(204 10% 10%)",
  outline: "2px solid transparent",
  outlineOffset: "2px",
  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
};

const comboBoxStyles = {
  height: "2.5rem",
  width: "250px",
  borderRadius: "0.375rem",
  borderStyle: "none",
  backgroundColor: "hsl(204 20% 100%)",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  fontSize: "1rem",
  lineHeight: "1.5rem",
  color: "hsl(204 10% 10%)",
  outlineWidth: "2px",
  outlineOffset: "-1px",
  outlineColor: "hsl(204 100% 40%)",
  boxShadow: "inset 0 0 0 1px rgba(0 0 0/0.15), inset 0 2px 5px 0 rgba(0 0 0/0.08)",
};

const comboboxItem = {
  display: "flex",
  cursor: "default",
  scrollMargin: "0.5rem",
  alignItems: "center",
  gap: "0.5rem",
  borderRadius: "0.25rem",
  padding: "0.5rem",
  outline: "none !important",
  opacity: "var(--item-opacity, 1)",
  transitionProperty: "opacity",
  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  transitionDuration: "150ms",
  "&[hover]": {
    backgroundColor: "hsl(204 100% 80% / 0.4)",
  },
};
const MultiSelect = () => {
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState(["Bacon"]);

  // const matches = useMemo(() => matchSorter(list, searchValue), [searchValue]);

  return (
    <Ariakit.ComboboxProvider
      selectedValue={selectedValues}
      setSelectedValue={setSelectedValues}
      setValue={(value) => {
        startTransition(() => {
          setSearchValue(value);
        });
      }}
    >
      <Ariakit.ComboboxLabel className="label">Your favorite food</Ariakit.ComboboxLabel>
      <Ariakit.Combobox placeholder="e.g., Apple, Burger" style={comboBoxStyles} />
      <Ariakit.ComboboxPopover sameWidth gutter={8} style={popoverStyles} aria-busy={isPending}>
        {list.map((value) => (
          <Ariakit.ComboboxItem key={value} value={value} focusOnHover style={comboboxItem}>
            <Ariakit.ComboboxItemCheck />
            {value}
          </Ariakit.ComboboxItem>
        ))}
        {!list.length && <div className="no-results">No results found</div>}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  );
};

// function App() {
//   return (
//     <>
//       <div>
//         <Example />
//       </div>
//     </>
//   );
// }

export default MultiSelect;

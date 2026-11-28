import { useState, useMemo, useRef, useCallback } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { MultiSelectItemType } from "types/types";
import {
  StyledTrigger,
  StyledContent,
  SearchWrapper,
  SearchIcon,
  SearchInput,
  OptionItem,
  ItemIndicator,
  Pill,
  Placeholder,
  ChevronIcon,
  NoResults,
  ClearButton,
} from "./MultiSelect.styled";

type MultiSelectProps = {
  items: MultiSelectItemType[];
  placeholder: string;
  selectedValues: MultiSelectItemType[];
  setSelectedValues: (value: MultiSelectItemType[]) => void;
  filter?: boolean;
  closeOnSelect?: boolean;
  selectionLimit?: number;
  width?: string;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  items,
  placeholder,
  selectedValues,
  setSelectedValues,
  filter = true,
  closeOnSelect = true,
  selectionLimit,
  width,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedCodes = useMemo(
    () => new Set(selectedValues.map((v) => v.code)),
    [selectedValues],
  );

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const lower = search.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(lower));
  }, [items, search]);

  const handleToggle = useCallback(
    (item: MultiSelectItemType) => {
      if (selectedCodes.has(item.code)) {
        setSelectedValues(selectedValues.filter((v) => v.code !== item.code));
      } else {
        if (selectionLimit && selectedValues.length >= selectionLimit) return;
        if (closeOnSelect) {
          setOpen(false);
        }
        setSelectedValues([...selectedValues, item]);
      }
    },
    [selectedCodes, selectedValues, setSelectedValues, closeOnSelect, selectionLimit],
  );

  const handlePillRemove = useCallback(
    (e: React.MouseEvent, code: string) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedValues(selectedValues.filter((v) => v.code !== code));
    },
    [selectedValues, setSelectedValues],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedValues([]);
    },
    [setSelectedValues],
  );

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setSearch("");
  }, []);

  if (!items) return null;

  const atLimit = selectionLimit !== undefined && selectedValues.length >= selectionLimit;

  return (
    <DropdownMenu.Root open={open} onOpenChange={handleOpenChange}>
      <StyledTrigger style={width ? { width, maxWidth: width } : undefined}>
        {selectedValues.length === 0 && <Placeholder>{placeholder}</Placeholder>}
        {selectedValues.map((item) => (
          <Pill key={item.code} onClick={(e) => handlePillRemove(e, item.code)}>
            {item.name}
            <Cross2Icon width={12} height={12} />
          </Pill>
        ))}
        <ChevronIcon width={14} height={14} />
      </StyledTrigger>

      <StyledContent
        onOpenAutoFocus={(e) => {
          if (filter) {
            e.preventDefault();
            searchRef.current?.focus();
          }
        }}
      >
        {filter && (
          <SearchWrapper>
            <SearchIcon width={14} height={14} />
            <SearchInput
              ref={searchRef}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </SearchWrapper>
        )}

        {filteredItems.length === 0 && <NoResults>No results</NoResults>}

        {filteredItems.map((item) => {
          const isSelected = selectedCodes.has(item.code);
          const disabled = !isSelected && atLimit;

          return (
            <OptionItem
              key={item.code}
              checked={isSelected}
              disabled={disabled}
              onSelect={(e) => {
                e.preventDefault();
                handleToggle(item);
              }}
            >
              <ItemIndicator>
                <CheckIcon width={14} height={14} />
              </ItemIndicator>
              {item.name}
            </OptionItem>
          );
        })}

        {selectedValues.length > 0 && (
          <ClearButton onClick={handleClear}>Clear all</ClearButton>
        )}
      </StyledContent>
    </DropdownMenu.Root>
  );
};

export default MultiSelect;

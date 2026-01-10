import React, { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Label } from "components/Label";
import { PageBox, PageButton, IconButton, PageInput } from "./Pagination.styled";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [pageText, setPageText] = useState<string>(String(currentPage));

  // Keep input synced when parent changes page (buttons, filters, etc.)
  useEffect(() => {
    setPageText(String(currentPage));
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    const next = clamp(page, 1, totalPages);
    if (next !== currentPage) onPageChange(next);
  };

  const commitTypedPage = () => {
    if (!pageText.trim()) {
      setPageText(String(currentPage));
      return;
    }

    const parsed = Number(pageText);

    if (Number.isNaN(parsed)) {
      setPageText(String(currentPage));
      return;
    }

    const next = clamp(Math.trunc(parsed), 1, totalPages);
    setPageText(String(next));
    handlePageChange(next);
  };

  return (
    <PageBox>
      <PageButton disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
        First
      </PageButton>

      <IconButton
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </IconButton>

      <PageInput
        value={pageText}
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Current page"
        onChange={(e) => {
          // allow only digits (and empty) while typing
          const next = e.target.value.replace(/[^\d]/g, "");
          setPageText(next);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur(); 
          } else if (e.key === "Escape") {
            setPageText(String(currentPage));
            e.currentTarget.blur();
          }
        }}
        onBlur={commitTypedPage}
      />

      <Label>of {totalPages}</Label>

      <IconButton
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </IconButton>

      <PageButton disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
        Last
      </PageButton>
    </PageBox>
  );
};

export { PaginationComponent as Pagination };

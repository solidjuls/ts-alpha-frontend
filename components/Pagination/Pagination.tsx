import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Label } from "components/Label";
import { PageBox, PageButton, IconButton } from "./Pagination.styled";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <PageBox>
      <PageButton disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
        First
      </PageButton>
      <IconButton disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
        <ChevronLeftIcon />
      </IconButton>
      <Label>{currentPage}</Label>
      <Label>of {totalPages}</Label>
      <IconButton disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
        <ChevronRightIcon />
      </IconButton>
      <PageButton disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
        Last
      </PageButton>
    </PageBox>
  );
};

export { PaginationComponent as Pagination };

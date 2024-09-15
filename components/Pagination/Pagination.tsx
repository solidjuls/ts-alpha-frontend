import { useState } from "react";
import { Button } from "components/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Label } from "components/Label";
import { Box } from "components/Atoms";

const PaginationComponent = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };

  return (
    <Box css={{ ...styles.paginationContainer }}>
      <Button onClick={() => handlePageChange(1)}>
        <b>First Page</b>
      </Button>
      <Button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
        <ChevronLeftIcon />
      </Button>
      <Label>
        {currentPage} of {totalPages}
      </Label>
      <Button onClick={() => handlePageChange(currentPage + 1)}>
        <ChevronRightIcon />
      </Button>
      <Button onClick={() => handlePageChange(totalPages)}>
        <b>Last Page</b>
      </Button>
    </Box>
  );
};

// Styles for the Pagination component
const styles = {
  paginationContainer: {
    display: "flex",
    alignItems: "center",
    padding: "8px",
  },
  pageInput: {
    width: "30px",
  },
};

export { PaginationComponent as Pagination };

import { useRouter } from "next/router";
import styled from "styled-components";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

const ChevronSpan = styled.span`
  display: inline-flex;
  align-self: center;
  flex-shrink: 0;
  margin-inline-end: 0.5rem;
`;

const LinkButton = styled.a`
  display: inline-flex;
  appearance: none;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
  white-space: nowrap;
  vertical-align: baseline;
  outline: transparent solid 2px;
  outline-offset: 2px;
  line-height: normal;
  border-radius: 0.375rem;
  font-weight: 600;
  height: auto;
  min-width: 2.5rem;
  font-size: 1rem;
  padding: 0px;
  color: #DD6B20;
  cursor: pointer;
  border: none;
  background: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    outline: 2px solid #DD6B20;
    outline-offset: 2px;
  }
`;

const Backbutton = () => {
  const router = useRouter();

  return (
    <LinkButton as="button" type="button" onClick={() => router.back()}>
      <ChevronSpan>
        <ChevronLeftIcon />
      </ChevronSpan>
      Back
    </LinkButton>
  );
};

export { Backbutton };

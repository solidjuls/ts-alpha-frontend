import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { ChevronSpan, LinkButton } from './Backbutton.styled';

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

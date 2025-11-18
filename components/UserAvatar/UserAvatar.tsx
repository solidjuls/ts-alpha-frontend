import { FormattedMessage, useIntl } from "react-intl";
import styled, { keyframes } from "styled-components";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { blackA } from "@radix-ui/colors";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { Root, Trigger, Content, Item, Arrow, Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "contexts/AuthProvider";
import Text from "components/Text";
import { Box } from "components/Atoms";

const StyledAvatar = styled(AvatarPrimitive.Root)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  user-select: none;
  width: 45px;
  height: 45px;
  border-radius: 100%;
  background-color: ${blackA.blackA3};
`;

const StyledImage = styled(AvatarPrimitive.Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

const StyledTrigger = styled(Trigger)`
  padding: 0px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const StyledTriangleDownIcon = styled(TriangleDownIcon)`
  color: black;
`;

const slideUpAndFade = keyframes`
  0% { opacity: 0; transform: translateY(2px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const slideRightAndFade = keyframes`
  0% { opacity: 0; transform: translateX(-2px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const slideDownAndFade = keyframes`
  0% { opacity: 0; transform: translateY(-2px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const slideLeftAndFade = keyframes`
  0% { opacity: 0; transform: translateX(2px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const StyledArrow = styled(Arrow)`
  fill: white;
`;

const StyledSeparator = styled(Separator)`
  height: 1px;
  background-color: #24292f;
`;

const StyledText = styled(Text)`
  display: flex;
  cursor: pointer;
  font-weight: 600;
  color: black;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledContent = styled(Content)`
  min-width: 120px;
  border-radius: 6px;
  padding: 5px;
  background-color: var(--gray-200);
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);

  @media (prefers-reduced-motion: no-preference) {
    animation-duration: 400ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;

    &[data-state="open"] {
      &[data-side="top"] { animation-name: ${slideDownAndFade}; }
      &[data-side="right"] { animation-name: ${slideLeftAndFade}; }
      &[data-side="bottom"] { animation-name: ${slideUpAndFade}; }
      &[data-side="left"] { animation-name: ${slideRightAndFade}; }
    }
  }
`;

const StyledItem = styled(Item)`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
  font-size: ${props => props.theme.fontSizes.fontSizeM};
  line-height: 1;
  color: ${props => props.theme.colors.textDark};
  cursor: pointer;
  border-radius: 4px;
  margin: 5px;
  height: 25px;
  padding: 0 5px;
  padding-left: 25px;
  transition: all 50ms;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &:focus {
    outline: none;
    background-color: darkBlue;
    color: ${props => props.theme.colors.textLight};
  }
`;

const FlexContainer = styled(Box)`
  display: flex;
  flex-direction: row;
`;

const StyledTextWithMargin = styled(StyledText)`
  margin-right: 12px;
`;

const UserAvatar = ({ name }: { name: string }) => {
  const intl = useIntl();
  const router = useRouter();
  const { logout } = useSession();
  return (
    <FlexContainer>
      <Root>
        <StyledTrigger>
          <StyledTextWithMargin>
            {`${intl.formatMessage({ id: "greeting" })} ${name}`}
          </StyledTextWithMargin>
          {/* <StyledAvatar>
            <StyledImage src="https://pbs.twimg.com/profile_images/1361968864171618316/T8jfJHNo_400x400.jpg"></StyledImage>
          </StyledAvatar> */}
          <StyledTriangleDownIcon />
        </StyledTrigger>
        <StyledContent align="end">
          <StyledItem
            onClick={async () => {
              if (logout) {
                await logout();
                router.push("/");
              }
            }}
          >
            {intl.formatMessage({ id: "signOut" })}
          </StyledItem>
          <Item />
          <StyledArrow offset={30} />
        </StyledContent>
      </Root>
    </FlexContainer>
  );
};

export { UserAvatar };

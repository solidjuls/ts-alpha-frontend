import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { SkeletonPlayers } from "components/Skeletons";
import useFetchInitialData from "hooks/useFetchInitialData";
import { UserType } from "types/user.types";
import {
  SidePanelStyled,
  UserContainer,
  UserInfo,
  PlayersContainer,
  TitleText
} from './TopPlayerRating.styled';

const User = ({ name, rating, countryCode }: UserType) => {
  return (
    <UserContainer>
      <UserInfo>
        <FlagIcon code={countryCode} />
        <Text>{name}</Text>
      </UserInfo>
      <Text>{rating}</Text>
    </UserContainer>
  );
};

const Announcement = () => {
  return (
    <SidePanelStyled>
      <Text>Next match on action round zero</Text>
    </SidePanelStyled>
  );
};

const TopPlayerRating = () => {
  const { data, isLoading } = useFetchInitialData({ url: "/api/rating?p=1&pso=5" });
  if (!data) return null;

  return (
    <SidePanelStyled>
      <TitleText strong="bold">
        Top Players
      </TitleText>
      {isLoading && <SkeletonPlayers />}
      <PlayersContainer>
        {(data as any).results?.map((item: any, index: number) => (
          <User key={index} name={item.name} rating={item.rating} countryCode={item.countryCode} />
        ))}
      </PlayersContainer>
    </SidePanelStyled>
  );
};

export { TopPlayerRating, Announcement };

import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { SkeletonPlayers } from "components/Skeletons";
import { usePlayerRatings } from "hooks/useRating";
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
  const {
    data: playersData,
    isLoading,
    error
  } = usePlayerRatings({
    page: 1,
    pageSize: 5,
    orderBy: 'rating',
    orderDirection: 'desc',
  });

  if (error) {
    return (
      <SidePanelStyled>
        <TitleText strong="bold">
          Top Players
        </TitleText>
        <Text>Error loading top players</Text>
      </SidePanelStyled>
    );
  }

  return (
    <SidePanelStyled>
      <TitleText strong="bold">
        Top Players
      </TitleText>
      {isLoading && <SkeletonPlayers />}
      <PlayersContainer>
        {playersData?.results?.map((player) => (
          <User
            key={player.id}
            name={player.name}
            rating={player.rating}
            countryCode={player.countryCode || ''}
          />
        ))}
      </PlayersContainer>
    </SidePanelStyled>
  );
};

export { TopPlayerRating, Announcement };

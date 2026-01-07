import Text from "components/Text";
import Link from "next/link";
import { FlagIcon } from "components/FlagIcon";
import { SkeletonPlayers } from "components/Skeletons";
import { usePlayerRatings } from "hooks/useRating";
import { UserType } from "types/user.types";
import {
  SidePanelStyled,
  UserContainer,
  UserInfo,
  PlayersContainer,
  TitleText,
  NumericText
} from './TopPlayerRating.styled';

const User = ({ id, name, rating, countryCode }: UserType) => {
  return (
    <UserContainer>
      <UserInfo>
        <FlagIcon code={countryCode} />
        <Link href={`/userprofile/${id}`} passHref><Text>{name}</Text></Link>
      </UserInfo>
      <NumericText>{rating}</NumericText>
    </UserContainer>
  );
};

const Announcement = () => {
  return (
    <SidePanelStyled>
      <Text>Next Match on Action Round Zero</Text>
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
        <TitleText>
          Top Players
        </TitleText>
        <Text>Error Loading Top Players</Text>
      </SidePanelStyled>
    );
  }

  return (
    <SidePanelStyled>
      <TitleText>
        Top Players
      </TitleText>
      {isLoading && <SkeletonPlayers />}
      <PlayersContainer>
        {playersData?.results?.map((player) => (
          <User
            key={player.id}
            id={player.id}
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

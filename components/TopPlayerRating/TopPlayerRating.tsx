import styled from "styled-components";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { SkeletonPlayers } from "components/Skeletons";
import useFetchInitialData from "hooks/useFetchInitialData";
import { UserType } from "types/user.types";

const SidePanelStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f8f9fa;
  margin: 0 12px 0 12px;
  padding: 12px;
  border-radius: 12px;
  width: 240px;
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PlayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleText = styled(Text)`
  text-align: center;
  font-size: 20px;
  border-bottom: solid 1px #e5e7eb;
  padding-bottom: 8px;
  margin-bottom: 12px;
`;

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

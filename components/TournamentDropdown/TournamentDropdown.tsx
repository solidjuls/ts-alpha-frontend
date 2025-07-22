import { DropdownWithLabel } from "components/EditFormComponents"
import useFetchInitialData from "hooks/useFetchInitialData";
import { tournamentStatus } from "utils/constants";

const TournamentDropdown = ({ onChange }) => {
    const { data: tournaments, isLoading: loadingTournaments } = useFetchInitialData({
        url: `/api/game/tournaments?status=${tournamentStatus["ongoing"]}`,
        cacheId: "tournament-list",
    });
if (loadingTournaments) return null

  const leagueTypes = tournaments?.map((item) => ({
    value: item.id.toString(),
    text: item.tournament_name,
  }));
  
     return <DropdownWithLabel
                labelText="typeOfGame"
                key="gameType"
                items={leagueTypes}
                placeholder="Select tournament"
                height="270px"
                css={{ width: '200px' }}
                onSelect={(value) => onChange(value)}
            />
}

export { TournamentDropdown }

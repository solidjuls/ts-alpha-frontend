import * as React from 'react';
import { Checkbox } from "components/Checkbox";
import { styled } from '@stitches/react';
import ReplacePlayers from './ReplacePlayers';
import AddNewSchedule from './AddNewSchedule';
import CsvUploadButton from './CsvButtonUpload';
import { TournamentsType } from 'types/game.types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'redux/store';
import { deletePlayerFromSchedule, setAdminView, setPlayerFilter } from "../../redux/scheduleSlice";
import UserTypeahead from 'pages/submitform/UserTypeahead';
import { DropdownItemType } from 'types/types';
import useFetchInitialData from 'hooks/useFetchInitialData';
import { UserType } from 'types/user.types';
import { Flex } from 'components/Atoms';

const Panel = styled('div', {
  padding: '16px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  marginBottom: '8px'
});

interface ScheduleFilterProps {
  userAdminTournaments: TournamentsType | null
}

const ScheduleFilter: React.FC<ScheduleFilterProps> = ({ userAdminTournaments, noSchedule, tournament }) => {
  const [checked, setChecked] = React.useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { filters } = useSelector(
    (state: RootState) => state.scheduleList,
  );
  const { data: users, isLoading: isLoadingUsers } = useFetchInitialData<
    UserType[]
  >({
    url: `/api/user?t=${tournament}`,
    cacheId: "tournaments-list",
  });

  const usersFilter: DropdownItemType[] = users?.map((item: UserType) => ({
    value: item.id,
    text: item.name,
  })) || []

  return (
    <div>
      <Checkbox text="Show Admin Options" checked={checked} onCheckedChange={setChecked} />
      {checked && (
        <Panel>
          <CsvUploadButton tournament={userAdminTournaments} />
          <Checkbox text="Show full schedule" checked={filters.adminView} onCheckedChange={() => dispatch(setAdminView(!filters.adminView))} />
          <Flex>
            <>
              <UserTypeahead
                labelText="players"
                // selectedItem={filters.playerToDelete}
                // error={form.admins.error}
                users={usersFilter}
                placeholder="Type the player name..."
                css={{ width: '320px', marginRight: "8px" }}
                onBlur={() => {
                  // onInputValueChange("admins", "");
                }}
                onSelect={(item: DropdownItemType) =>
                  dispatch(setPlayerFilter(item.value))
                }
              />
              <UserTypeahead
                labelText="removePlayer"
                // selectedItem={filters.playerToDelete}
                // error={form.admins.error}
                users={usersFilter}
                placeholder="Type the player name..."
                css={{ width: '320px' }}
                onBlur={() => {
                  // onInputValueChange("admins", "");
                }}
                onSelect={(item: DropdownItemType) =>
                  dispatch(deletePlayerFromSchedule(item.value))
                }
              />
            </>
          </Flex>
          {/* {!noSchedule && <ReplacePlayers tournament={userAdminTournaments} />}
          {!noSchedule && <AddNewSchedule tournament={userAdminTournaments} />} */}
        </Panel>
      )}
    </div>
  );
};

// SUPER ADMIN 
// all tournaments with a schedule
// upload csv. I can see the option if I'm admin of the tournament (or super admin), and the tournament is still "registering"
// replace players -> old player, new player, tournament filter selected

// ADMIN
  // admin view: I can see my tournament schedules with a tournament filter,
      // I can update due date,
      // I can replace players,
      // I can add a scheduleI can reset a game

// PLAYER VIEW
// tournament filter should display only the allowed tournaments

// add new schedule -> players, tournament, due date
// super admin view: I can see everything with a tournament filter, and do everything
// // player view. I can only see submit option and the tournament filter with my open tournaments

export default ScheduleFilter

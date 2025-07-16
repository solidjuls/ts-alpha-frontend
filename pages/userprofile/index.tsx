import { Spinner } from "@radix-ui/themes";
import { getInfoFromCookies } from "utils/cookies";
import UserProfileForm from "./UserProfileForm";
import useFetchInitialData from "hooks/useFetchInitialData";
import { City, Country, ServerType } from "types/types";
import { User } from "types/game.types";

interface UserProfileProps {
  id: string;
}

const UserProfileContainer: React.FC<UserProfileProps> = ({ id }) => {
  const { data, isLoading } = useFetchInitialData<User>({ url: `/api/user?id=${id}` });
  const { data: countries, isLoading: countriesLoading } = useFetchInitialData<Country[]>({
    url: `/api/countries`,
  });
  const { data: cities, isLoading: citiesLoading } = useFetchInitialData<City[]>({
    url: `/api/cities`,
  });

  if (isLoading || countriesLoading || citiesLoading || !data) return <Spinner size="3" />;

  return (
    <UserProfileForm
      data={data}
      countries={countries?.map((item) => ({ value: item.id, text: item.country_name }))}
      cities={cities?.map((city) => ({ value: city.id, text: city.name }))}
    />
  );
};

export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);

  if (!payload) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: { id: payload.id || null } };
}

export default UserProfileContainer;

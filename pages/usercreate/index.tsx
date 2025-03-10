import { Spinner } from "@radix-ui/themes";
import { getInfoFromCookies } from "utils/cookies";
import UserCreateForm from "./UserCreateForm";
import useFetchInitialData from "hooks/useFetchInitialData";
import { userRoles } from "utils/constants";
import { City, Country, ServerType } from "types/types";

const UserCreateContainer = () => {
  const { data, isLoading } = useFetchInitialData<Country[]>({ url: `/api/countries` });
  const { data: cities, isLoading: citiesLoading } = useFetchInitialData<City[]>({
    url: `/api/cities`,
  });

  if (isLoading || citiesLoading) return <Spinner size="3" />;

  return (
    <UserCreateForm
      cities={cities?.map((city) => ({ value: city.id, text: city.name }))}
      countries={data?.map((item) => ({ value: item.id, text: item.country_name }))}
    />
  );
};

export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);

  if (!payload || payload?.role !== userRoles.SUPERADMIN) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: { role: payload.role || null } };
}

export default UserCreateContainer;

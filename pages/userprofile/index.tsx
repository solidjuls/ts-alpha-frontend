import { Spinner } from "@radix-ui/themes";
import { EditTextComponent } from "components/EditFormComponents";
import { useSession } from "contexts/AuthProvider";
import { NextApiRequest, NextApiResponse } from "next";
import { getInfoFromCookies } from "utils/cookies";
import UserProfileForm from "./UserProfileForm";
import useFetchInitialData from "hooks/useFetchInitialData";
import { ServerType } from "types/types";

const UserProfileContainer = ({ id }) => {
  const { data, isLoading } = useFetchInitialData({ url: `/api/user?id=${id}` });
  const { data: countries, isLoading: countriesLoading } = useFetchInitialData({
    url: `/api/countries`,
  });
  const { data: cities, isLoading: citiesLoading } = useFetchInitialData({
    url: `/api/cities`,
  });

  if (isLoading || countriesLoading || citiesLoading) return <Spinner size="3" />;

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

import useFetchInitialData from "hooks/useFetchInitialData";

const Standings = () => {
  const {
    data: standings,
    isLoading,
    error,
  } = useFetchInitialData({ url: "/api/standings?id=313&division=TORUN" });

    console.log("standings", standings)
  return <div>let's see</div>
}

export default Standings;

import Head from "next/head";
import Homepage from "components/Homepage";
import { useIsAuthenticated } from "hooks/useAuth";

export default function Home() {
  const { user } = useIsAuthenticated();
  const role = user?.role ?? null;

  return (
    <>
      <Head>
        <title>Twilight Struggle</title>
        <meta
          name="description"
          content="The place where competitive twilight struggle happens. Online tournaments with Round Robin and Swiss format. All skill levels are welcome."
        />
        <link rel="icon" href="/ts-icon.webp" />
      </Head>
      <Homepage role={role} />
    </>
  );
}

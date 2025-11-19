import Head from "next/head";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInfoFromCookies } from "utils/cookies";
import Homepage from "components/Homepage";
import { MainLayout } from "components/Layout";
import { Server, ServerType } from "types/types";

export default function Home({ role }: { role: number }) {
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
      <MainLayout>
        <Homepage role={role} />
      </MainLayout>
    </>
  );
}

export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);
  return { props: { role: payload?.role || null } };
}

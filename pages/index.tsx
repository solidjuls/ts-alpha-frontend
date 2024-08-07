import Head from "next/head";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInfoFromCookies } from "utils/cookies";
import Homepage from "components/Homepage";

export default function Home({ role }: { role: number }) {
  return (
    <>
      <Head>
        <title>TS ALPHA</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <br />
      <Homepage role={role} />
    </>
  );
}

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const payload = getInfoFromCookies(req, res);
  console.log("payload", payload);
  return { props: { role: payload?.role || null } };
}

import React, { ReactNode, useState } from "react";
import { styled } from "stitches.config";
import Image from "next/image";
import Header from "components/Header";
import { Sidebar, HorizontalNavigation } from "components/Sidebar";
import { Box, Span } from "components/Atoms";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getInfoFromCookies } from "utils/cookies";

const containerStyles = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  width: "100%",
  height: "100%",
};
const contentStyles = {
  display: "flex",
  flexGrow: "1",
};

const Main = styled("main", {
  alignItems: "center",
  flexDirection: "column",
  display: "flex",
  backgroundColor: "#eeeeee",
});

const StyledFooter = styled("footer", {
  display: "flex",
  padding: "2rem 0",
  borderTop: "1px solid #eaeaea",
  justifyContent: "center",
  alignItems: "center",
  ["footer a"]: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
});
const logoCss = {
  height: "1em",
  marginLeft: "0.5rem",
};
const Footer = () => {
  return (
    <StyledFooter>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{" "}
        <Span css={logoCss}>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </Span>
      </a>
    </StyledFooter>
  );
};
const Layout = ({ children, name }: { children: ReactNode, name: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Box css={containerStyles}>
      {/* <Header openSidebar={() => setIsOpen(!isOpen)} /> */}
      {isOpen ? <Sidebar /> : <HorizontalNavigation name={name} />}
      <Main css={contentStyles}>{children}</Main>
      {/* <Footer /> */}
    </Box>
  );
};

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const payload = getInfoFromCookies(req, res);
  console.log("payload", payload);
  if (!payload) {
    return { props: { name: payload.name } };
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: { role: payload.role || null } };
}

export { Layout };

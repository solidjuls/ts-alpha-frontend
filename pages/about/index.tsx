import React from "react";
import { styled } from "stitches.config";

const PageContainer = styled("div", {
  fontFamily: "$body",
  lineHeight: 1.6,
  margin: 0,
  padding: 0,
  backgroundColor: "var(--surface-ground)",
  color: "$text",
});

const Header = styled("header", {
  backgroundColor: "$headerBg",
  color: "$headerText",
  padding: "$small",
  textAlign: "center",
});

const Main = styled("main", {
  maxWidth: "800px",
  margin: "$medium auto",
  padding: "$small",
  backgroundColor: "var(--surface-ground)",
  borderRadius: "$default",
  boxShadow: "$default",
});

const Title = styled("h1", {
  color: "$text",
});

const Subtitle = styled("h2", {
  color: "$text",
});

const Section = styled("section", {
  marginBottom: "$medium",

    // Apply left padding to all direct children...
  "& > *": {
    paddingLeft: "$large",
  },

  // ...but remove that padding for Subtitles
  [`& > ${Subtitle}`]: {
    paddingLeft: 0,
  },
});

const List = styled("ul", {
  listStyle: "disc",
  paddingLeft: "$large",
});

const Link = styled("a", {
  color: "$link",
  textDecoration: "none",
  fontWeight: "bold",

  "&:hover": {
    textDecoration: "underline",
    color: "$linkHover",
  },
});

const Footer = styled("footer", {
  textAlign: "center",
  margin: "$medium 0",
});

const AboutPage = () => (
  <PageContainer>
    <Header>
      <Title>Welcome to Twilight-Struggle.com</Title>
    </Header>

    <Main>
      <Section>
        <p>
          Welcome to <strong>twilight-struggle.com</strong>, the home of competitive Twilight
          Struggle.
        </p>
        <p>
          Published by GMT Games in 2005, Twilight Struggle is regarded by many as one of the best
          competitive board games of all time. This website is run and maintained by the{" "}
          <strong>ITS Junta</strong>, a group of enthusiasts who organize online and live
          tournaments.
        </p>
      </Section>

      <Section>
        <Subtitle>Our Tournaments</Subtitle>
        <p>
          We have a large database of over 30,000 competitive games, from 2006 to the present,
          played by over 1,500 players in over 100 tournaments. Some of the tournaments include:
        </p>
        <List>
          <li>
            <Link href="https://docs.google.com/spreadsheets/d/18OxXxu_pjwxMAI2PNFzyGm7LiP6iOuKdDbQPucboQmI/edit?gid=235090196#gid=235090196">ITSL</Link> - The largest yearly international league with geographic
            divisions (~200 players, 20-game regular season + playoffs).
          </li>
          <li>
            <Link href="https://docs.google.com/spreadsheets/d/1h9T_3mAAAhV34ldcqQ549pOCEGy1EjMGl8Fc7XWmb18/">OTSL</Link> - A smaller, more casual two-tiered league with non-geographic
            divisions.
          </li>
          <li>
            <Link href="https://docs.google.com/spreadsheets/d/1aJCCk4sGkTTB0caYjvz0-coSHyKVz4UI5RNo6MF-0OY/">RTSL</Link> - A four-tiered league with relegation/promotion each season
            (formerly the Reddit tournament).
          </li>
          <li>
            <strong>RATS</strong> - A series of asynchronous (21- or <Link href="https://docs.google.com/spreadsheets/d/1dzL5lhVCkImqEI63V6fpvcWKIIgFj-dyp2URi3o0a04/edit?gid=1417942401#gid=1417942401">7-day</Link>) leagues.
          </li>
          <li>
            <strong>World Cup</strong> - The largest weekend tournament of the year, featuring an
            8-game Swiss format.
          </li>
          <li>
            <strong>Grand Slam Series</strong> - A yearly series of shorter, one-day tournaments.
          </li>
          <li>
            <strong>Convention</strong> - A yearly in-person two-day event held in various cities.
          </li>
          <li>
            <Link href="https://docs.google.com/spreadsheets/d/1Lbg7YN8YCI0lXoqlNI2_C1D6EUyl3y_7xABpp2IVuAk/edit?gid=446700816#gid=446700816">Nations Cup</Link> / <Link href="https://docs.google.com/spreadsheets/d/1Lbg7YN8YCI0lXoqlNI2_C1D6EUyl3y_7xABpp2IVuAk/edit?gid=1173919445#gid=1173919445">US Cup</Link> - Regional team tournaments.
          </li>
          <li>
            <Link href="https://docs.google.com/spreadsheets/d/1zHJoK051Z01fQpmVEtvDhz2ZiwUEGSmJ80QhTZKoYS8/">Champions League</Link> - An invite-only tournament inspired by UEFA,
            featuring winners of regional and grand tournaments.
          </li>
          <li>
            <strong>Regional/National Leagues</strong> - Local leagues feeding into the
            Champions League.
            <List>
              <li>Atlantic League (US) - President Justin Abramson</li>
              <li>Basque League - President Markel Elortza</li>
              <li>Canadian League - President Max Goldman</li>
              <li>Chinese League - President Weiran Xie</li>
              <li>Dutch League - President Aleksei Lobunko</li>
              <li>Eastern European League - President Juri Golomako</li>
              <li>French League - President Franck Rondepierre</li>
              <li>Greek League - President Tasos Manolopoulos</li>
              <li>Italian League - President Daniel Squindo</li>
              <li>Korean Twilight Struggle League (KTSL) - President Youngbae Park</li>
              <li>Liga de Federaciones de Twilight Struggle (LFTS) - President Jarib Flores</li>
              <li>Midwest League (US) - President Derek Miller</li>
              <li>Nordic Cup - President Anton Skott</li>
              <li>Polish League - President Ziemowit Pazderski</li>
              <li>Western US League - President Patrick Gong</li>
              <li>UK League - President Tasos Manolopoulos</li>
            </List>
          </li>
        </List>
      </Section>

      <Section>
        <Subtitle>ITSR Rating System</Subtitle>
        <p>
          Although most of our games are played on Playdek’s online app, their rating system can be
          gamed. Thus, we use our own <strong>ITSR</strong>, an Elo-based system. Here’s a summary
          of how it works:
        </p>
        <ol>
          <li>Calculate the rating difference between the two players.</li>
          <li>Take 5% of the difference and round it. For friendly games, halve this value.</li>
          <li>
            Apply a baseline (100 points for regular, 50 for friendly games) and adjust the ratings
            based on the result:
          </li>
          <ul>
            <li>
              If the lower-rated player wins, they gain the baseline + 5% of the difference, and the
              higher-rated player loses the same amount.
            </li>
            <li>If the higher-rated player wins, they gain the baseline - 5% of the difference.</li>
            <li>
              In case of a tie, the higher-rated player loses, and the lower-rated player gains 5%
              of the difference.
            </li>
          </ul>
          <li>Minimum change: ±1 point; maximum change: ±200 points per game.</li>
        </ol>
      </Section>

      <Section>
        <Subtitle>Community and Resources</Subtitle>
        <p>
          Most of our communication happens on <Link href="https://chat.whatsapp.com/FkFFVR3D2KrEPtHWtmtufD?mode=r_t">WhatsApp</Link> and <Link href="https://discord.gg/ZVCQJDxdnb" target="_blank">Discord</Link>, but players can also set up
          games via email.
        </p>
        <p>
          You can find the full ITS rules and the names of Junta members{" "}
          <Link
            href="https://docs.google.com/document/d/1tfDV_R2GXQfTmBAEjzlPUIY__BsU1Yd3eauIfzMVBI4/edit?usp=drivesdk"
            target="_blank"
          >
            here
          </Link>
          .
        </p>
        <p>
          To sign up for tournaments and create a user profile, please use this{" "}
          <Link href="https://forms.gle/3tj6uSNHnY9vr8KH9" target="_blank">
            Google form
          </Link>
          .
        </p>
        <p>
          For questions, contact JR Jones at{" "}
          <Link href="mailto:its.junta@gmail.com" target="_blank">
            its.junta@gmail.com
          </Link>
          .
        </p>
      </Section>

      <Section>
        <Subtitle>Useful Resources</Subtitle>
        <List>
          <li>
            <Link href="https://www.reddit.com/r/twilightstruggle" target="_blank">
              Twilight Struggle Reddit
            </Link>
          </li>
          <li>
            <Link href="https://gentle-island-0bac64303.5.azurestaticapps.net/" target="_blank">
              Juri Golomako’s Card Tracker
            </Link>
          </li>
          <li>
            <Link href="https://david.mcwebsite.net/ts/" target="_blank">
              David McHealy’s Card Tracker
            </Link>
          </li>
          <li>
            <Link
              href="https://www.gmtgames.com/p-927-twilight-struggle-deluxe-edition-8th-printing.aspx"
              target="_blank"
            >
              GMT Twilight Struggle Page
            </Link>
          </li>
          <li>
            <Link href="https://www.playdekgames.com/twilight-struggle" target="_blank">
              Playdek Twilight Struggle
            </Link>
          </li>
          <li>
            <Link href="https://twilightstrategy.com/" target="_blank">
              Twilight Strategy Guide
            </Link>
          </li>
        </List>
      </Section>
      <Section>
        <Subtitle>Community Twilight Struggle Videos</Subtitle>
        <p>
          The videos and streams below are from members of the ITS community. Watching videos of Twilight Struggle with people commenting is one of the best ways to learn the game.
        </p>
        <List>
          <li>
            <strong>Action Round Zero</strong> (Official ITS Community Stream): <Link href="https://www.twitch.tv/actionroundzero" target="_blank">Twitch</Link> - <Link href="https://www.youtube.com/@ActionRoundZero" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1844">Derek Miller</Link> (DRock1984): <Link href="https://www.twitch.tv/drock1984" target="_blank">Twitch</Link> - <Link href="https://www.youtube.com/@drock1984" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2232">Justin Abramson</Link> (PioneerTowel): <Link href="https://www.twitch.tv/pioneertowel" target="_blank">Twitch</Link> - <Link href="https://www.youtube.com/@pioneertowel" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2878">Ziemowit Pazderski</Link> (Ziemowit): <Link href="https://www.youtube.com/@Ziemowit_TS" target="_blank">YouTube</Link>
          </li>
        </List>
      </Section>
    </Main>

    <Footer>
      <p>&copy; {new Date().getFullYear()} Twilight-Struggle.com | All rights reserved.</p>
    </Footer>
  </PageContainer>
);

export default AboutPage;

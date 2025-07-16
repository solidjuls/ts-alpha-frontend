import React from "react";
import { Box } from "components/Atoms";
import { TopPlayerRating } from "components/TopPlayerRating";
import { styled } from "stitches.config";
import Image from 'next/image'

const WIDTH = 24;
const HEIGHT = 16;

const RightBox = styled(Box, {
  float: "right",
});

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

  variants: {
    inactive: {
      true: {
        textDecoration: "line-through",
      },
    },
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
            <strong>RATS</strong> - A series of asynchronous leagues (<Link href="https://docs.google.com/spreadsheets/d/1ivRRIPGt-iQsRj8_Mi_6y0GtbQ8lXhrZgm6Bsid8wDs/edit?usp=sharing">RATS League</Link>, <Link href="https://docs.google.com/spreadsheets/d/1dzL5lhVCkImqEI63V6fpvcWKIIgFj-dyp2URi3o0a04/edit?gid=1723138185">RATS 7D</Link>, <Link href="https://docs.google.com/spreadsheets/d/1UgJg4ciPpudJ0VhmTBk2N41NV2QP8C3yukvsQQZXVoY/edit?gid=2025014817">RATS Swiss</Link>, <Link href="https://docs.google.com/spreadsheets/d/1b5-KpwKhB8tyWLioxABaZ5M3Cv_aYxKbmnBF8NteoMg/edit?gid=1457881874">RATS Cup</Link>).
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
              <li>Atlantic League (US) - <Link href="https://twilight-struggle.com/userprofile/2232">President Justin Abramson</Link></li>
              <li>Basque League - <Link href="https://twilight-struggle.com/userprofile/2971">President Markel Elortza</Link></li>
              <li>Canadian League - <Link href="https://twilight-struggle.com/userprofile/2415">President Max Goldman</Link></li>
              <li>Chinese League - <Link href="https://twilight-struggle.com/userprofile/2886">President Weiran Xie</Link></li>
              <li>Dutch League - <Link href="https://twilight-struggle.com/userprofile/2556">President Peter Heuvelman</Link></li>
              <li>Eastern European League - <Link href="https://twilight-struggle.com/userprofile/2281">President Konstantin Zakharov</Link></li>
              <li>French League - <Link href="https://twilight-struggle.com/userprofile/1928">President Franck Rondepierre</Link></li>
              <li>Greek League - <Link href="https://twilight-struggle.com/userprofile/2743">President Tasos Manolopoulos</Link></li>
              <li>Italian League - <Link href="https://twilight-struggle.com/userprofile/1798">President Daniel Squindo</Link></li>
              <li>Korean Twilight Struggle League (KTSL) - <Link href="https://twilight-struggle.com/userprofile/2853">President Youngbae Park</Link></li>
              <li>Liga de Federaciones de Twilight Struggle (LFTS) - <Link href="https://twilight-struggle.com/userprofile/2084">President Jarib Flores</Link></li>
              <li>Midwest League (US) - <Link href="https://twilight-struggle.com/userprofile/1844">President Derek Miller</Link></li>
              <li>Nordic Cup - <Link href="https://twilight-struggle.com/userprofile/1630">President Anton Skott</Link></li>
              <li>Polish League - <Link href="https://twilight-struggle.com/userprofile/2878">President Ziemowit Pazderski</Link></li>
              <li>Western US League - <Link href="https://twilight-struggle.com/userprofile/2525">President Patrick Gong</Link></li>
              <li>UK League - <Link href="https://twilight-struggle.com/userprofile/2743">President Tasos Manolopoulos</Link></li>
            </List>
          </li>
        </List>
      </Section>

      <Section>
        <Subtitle>ITSR Rating System</Subtitle>
        <RightBox>
          <TopPlayerRating />
        </RightBox>
        <p>
          Although most of our games are played on Playdek’s online app, their rating system can be
          gamed. Thus, we use our own <strong>ITSR</strong> based on the AREA rating system. Here’s a summary
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
        <p>You can see a more detailed explanation of the ITSR system and an example in our <Link href="https://docs.google.com/document/d/1tfDV_R2GXQfTmBAEjzlPUIY__BsU1Yd3eauIfzMVBI4/edit?tab=t.0#heading=h.azamypt6qhvt">community rules</Link>.</p>
      </Section>

      <Section>
        <Subtitle>ITS Community</Subtitle>
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
        <Subtitle>How to Play Twilight Struggle</Subtitle>
        <p>
          Twilight Struggle has a STEEP learning curve. Watching gameplay videos is a great way to learn (you can see many of those videos in the next section), but the resources below may also be helpful.
        </p>
        <dl>
          <dt>
            <Link href="https://www.reddit.com/r/twilightstruggle" target="_blank">Twilight Struggle Reddit</Link>
          </dt>
          <dd>
            A great Reddit community that answers your questions about Twilight Struggle without snark or judgement (since we all know how hard this game is to learn).
          </dd>
          <dt>
            <Link href="https://david.mcwebsite.net/ts/" target="_blank">David McHealy&apos;s Card Tracker</Link>
          </dt>
          <dd>
            One of the first online card trackers for Twilight Struggle and it is used by many members of the ITS community. ITS tournaments generally allow the use of card trackers.
          </dd>
          <dt>
            <Link href="https://gentle-island-0bac64303.5.azurestaticapps.net/" target="_blank">
              Juri Golomako&apos;s Card Tracker
            </Link>
          </dt>
          <dd>
            A more recent card tracker for Twilight Struggle, created by a member of the ITS community.
          </dd>
          
          <dt>
            <Link href="https://www.gmtgames.com/p-927-twilight-struggle-deluxe-edition-8th-printing.aspx" target="_blank">
              GMT Twilight Struggle Page
            </Link>
          </dt>
          <dd>
            The official GMY page of the tabletop version of Twilight Struggle.
          </dd>
          <dt>
            <Link href="https://www.playdekgames.com/twilight-struggle" target="_blank">
              Playdek Twilight Struggle
            </Link>
          </dt>
          <dd>
            Playdek is the most popular digital edition of Twilight Struggle. It is also the version used in ITS leagues.
          </dd>
          <dt>
            <Link href="https://twilightstrategy.com/" target="_blank">Twilight Strategy Guide</Link>
          </dt>
          <dd>
            Twilight Strategy is a website and a great resource for beginners. While some of the strategies may be dated, the card descriptions and much of the other information are still helpful.
          </dd>
          <dt>
            <Link href="https://www.youtube.com/watch?v=2Hnxkl0O68k" target="_blank">Legendary Tactics Twilight Struggle Strategy</Link>
          </dt>
          <dd>
            A long (maybe the longest tabletop video of all-time) compilation video of Legendary Tactics&apos; individual Twilight Struggle card videos, featuring strategies that are somewhat more up-to-date than those on the Twilight Strategy website.
          </dd>
          <dt>
            <Link href="https://maninmotiongoingnowhere.wordpress.com/2017/02/14/twilight-struggle-the-collected-musings-of-sankt/" target="_blank">Sankt Strategy</Link>
          </dt>
          <dd>
            A synopsis of the more current strategy used by top-level Twilight Struggle players, developed by members of the Chinese Twilight Struggle community and compiled by ITS member <Link href="https://twilight-struggle.com/userprofile/2287">Kris Wei</Link>.
          </dd>
        </dl>
      </Section>
      <Section>
        <Subtitle>Community Twilight Struggle Videos</Subtitle>
        <p>
          The videos and streams below are from members of the ITS community. Watching videos of Twilight Struggle with commentary is one of the best ways to learn the game. Links with a flag may indicate content in a language other than English. Crossed-out links lead to pages that are no longer actively posting videos, but may have some past videos of Twilight Struggle. Contact <Link href="https://twilight-struggle.com/userprofile/1844">Derek Miller</Link> for updates to this page.
        </p>
        <List>
          <li>
            <strong>Action Round Zero</strong> (Official ITS Community Stream): <Link href="https://www.youtube.com/@ActionRoundZero" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1572">Alex Yoosup Lim</Link> (FreeTibet): <Link href="https://www.youtube.com/@Alex-YSL" target="_blank">YouTube</Link> <Image src="/flags/KR.png"  width={WIDTH} height={HEIGHT} alt="Korean Speaker" />
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1620">Ani Palmer</Link> (ani palmer): <Link href="https://www.youtube.com/@AniPalmerTS" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1627">Antoine Danel</Link> (tonio76): <Link href="https://www.youtube.com/@tonio76ts4" target="_blank">YouTube</Link> <Image src="/flags/FR.png"  width={WIDTH} height={HEIGHT} alt="French Speaker" />
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1630">Anton Skott</Link> (stenskott): <Link href="https://www.twitch.tv/thegoddessashlee" target="_blank">Twitch</Link> - <Link href="https://www.youtube.com/@ashleefreeman1219" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1634">Aran Warszawski</Link> (aranwar): <Link href="https://www.youtube.com/@aranwar" target="_blank">YouTube</Link> <Image src="/flags/IL.png"  width={WIDTH} height={HEIGHT} alt="Hebrew Speaker" />
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1645">Ashlee Freeman</Link> (TheGoddessAshlee): <Link href="https://www.twitch.tv/stenskott_" target="_blank">Twitch</Link> - <Link href="https://www.youtube.com/asprayofrocks" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1658">Bartosz Wróbel</Link> (Sparrov): <Link href="https://www.youtube.com/@SparrovTS/featured" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1780">Craig Richards</Link> (Caecius): <Link href="https://www.twitch.tv/caecius" target="_blank" inactive>Twitch</Link> - <Link href="https://www.youtube.com/c/CaeciusG" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1781">Crow Crowlas</Link> (Cardlinger): <Link href="https://www.twitch.tv/crowcrowlas" target="_blank">Twitch</Link> - <Link href="https://www.youtube.com/channel/UC8jyJ0oldrJUxNEGBZEGS6w" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1844">Derek Miller</Link> (DRock1984): <Link href="https://www.twitch.tv/drock1984" target="_blank">Twitch</Link> - <Link href="https://www.youtube.com/@drock1984" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1879">Edward Prem</Link> (EdPrem): <Link href="https://www.youtube.com/c/GamingwiththeColonel" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1928">Franck Rondepierre</Link> (N3ige): <Link href="https://www.youtube.com/@neige856" target="_blank">YouTube</Link> <Image src="/flags/FR.png"  width={WIDTH} height={HEIGHT} alt="French Speaker" />
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/1984">Guangheng Wu</Link> (harrywgh): <Link href="https://www.youtube.com/channel/UCHg3vmoH73MJ79D7-Umpwjw" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2000">Hasan Jamil</Link> (peacetreaty): <Link href="https://www.youtube.com/channel/UCMq--dchvaIWVk-m5O3Cdbw" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2011">Hervé Godinot</Link> (Peace Turtle): <Link href="https://www.youtube.com/@defcon1335/" target="_blank" inactive>YouTube</Link> <Image src="/flags/FR.png"  width={WIDTH} height={HEIGHT} alt="French Speaker" />
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2084">Jarib Flores</Link> (Blacklisted): <Link href="https://www.youtube.com/@BlacklistedTS" target="_blank">YouTube</Link> <Image src="/flags/ES.png"  width={WIDTH} height={HEIGHT} alt="Spanish Speaker" />
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2129">Jesse Marshall</Link> (Jessemarshall): <Link href="https://www.twitch.tv/thewinningagenda" target="_blank" inactive>Twitch</Link> - <Link href="https://www.youtube.com/@TheWinningAgenda" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2190">Jordan Cass</Link> (donzobean12): <Link href="https://www.youtube.com/channel/UCe4Z-vDM3eAuOS_180DLw5A" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2215">Josiah Emery</Link> (aunthemod): <Link href="https://www.youtube.com/channel/UCHg3vmoH73MJ79D7-Umpwjw" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2216">JR Jones</Link> (dsotc27): <Link href="https://www.twitch.tv/dsotc" target="_blank">Twitch</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2230">Juri Golomako</Link> (Partisan.Bel): <Link href="https://www.youtube.com/@twilightstrugglebelarus2769/" target="_blank">YouTube</Link> <Image src="/flags/BY.png"  width={WIDTH} height={HEIGHT} alt="Russian Speaker" />
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2232">Justin Abramson</Link> (PioneerTowel): <Link href="https://www.twitch.tv/pioneertowel/" target="_blank">Twitch</Link> - <Link href="https://www.youtube.com/@pioneertowel" target="_blank">YouTube</Link> 
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2235">Justin Nordstrom</Link> (Flour Power): <Link href="https://www.youtube.com/user/justnord2010" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2271">Kevin Gute</Link> (gute321): <Link href="https://www.twitch.tv/gute321" target="_blank">Twitch</Link> - <Link href="https://www.youtube.com/user/gute321" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2415">Max Goldman</Link> (gute321): <Link href="https://www.twitch.tv/maxgolds12" target="_blank">Twitch</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2431">Michael Panettieri</Link> (meta11ic): <Link href="https://www.twitch.tv/yaymeta11ic" target="_blank">Twitch</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2437">Michael Stone</Link> (kmmesq): <Link href="https://www.twitch.tv/headlineolympics" target="_blank">Twitch</Link> - <Link href="https://www.youtube.com/@Headline_Olympics" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2509">Onur Ulusel</Link> (NacRuno): <Link href="https://www.youtube.com/channel/UCwYZsrT1dTfKUY04y9P3_UQ" target="_blank" inactive>YouTube</Link> <Image src="/flags/TR.png"  width={WIDTH} height={HEIGHT} alt="Turkish Speaker" />
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2537">Paweł Januszewski</Link> (PawelJanuszewski): <Link href="https://www.youtube.com/channel/UCVf9V2S0unETHDNpspdqNOg" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2555">Peter Frantz</Link> (Frantzypantz): <Link href="https://www.youtube.com/user/Roguefire05" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2606">Ricki McLaughlin</Link> (Feallsanachail): <Link href="https://www.youtube.com/@feallsanachail" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2670">Sean Wanschoor</Link> (Hannarchie): <Link href="https://www.youtube.com/channel/UCRvAqSws-5hgewoaz49UlTw" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2701">Siu Chun Mok</Link> (Miracle_JM): <Link href="https://www.youtube.com/channel/UCItukdJLRnm1IXsotlA-BFA" target="_blank" inactive>YouTube</Link> <Image src="/flags/HK.png"  width={WIDTH} height={HEIGHT} alt="Chinese Speaker" />
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2705">Sophie Askew</Link> (passengera34): <Link href="https://www.youtube.com/@soaskew" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <strong>Team Catalunya:</strong> <Link href="https://www.youtube.com/@twilightcatalunya9604" target="_blank">YouTube</Link> <Image src="/flags/CAT.png"  width={WIDTH} height={HEIGHT} alt="Spanish Speaker" />
          </li>
          <li>
            <strong>Team Hong Kong:</strong> <Link href="https://www.youtube.com/channel/UC9MOfg1UizgFNZX3fUIB--Q" target="_blank" inactive>YouTube</Link> <Image src="/flags/HK.png"  width={WIDTH} height={HEIGHT} alt="Chinese Speaker" />
          </li>
          <li>
            <strong>Team Washington:</strong> <Link href="https://www.youtube.com/channel/UCGlIPl6x2zMfrvuZ1B76QPg" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <strong>Team United Kingdom:</strong> <Link href="https://www.youtube.com/channel/UChJInzqac0tPrlFO8CcknjQ" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2762">Tim Furrow</Link> (eelusion): <Link href="https://www.twitch.tv/eelusion/videos" target="_blank" inactive>Twitch</Link> - <Link href="https://www.youtube.com/@eelusion5397/videos" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2769">Tin Sum Cheng</Link> (tscheng): <Link href="https://www.youtube.com/user/s081023" target="_blank" inactive>YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2827">Wojciech Pietrzak</Link> (Ultima Tulinka): <Link href="https://www.youtube.com/@wojciechpietrzak1981/" target="_blank">YouTube</Link>
          </li>
          <li>
            <Link href="https://twilight-struggle.com/userprofile/2853">Youngbae Park</Link> (ybloveej): <Link href="https://www.youtube.com/c/%ED%99%A9%ED%88%AC%EB%8D%B0%EC%9D%B4" target="_blank">YouTube</Link> <Image src="/flags/KR.png"  width={WIDTH} height={HEIGHT} alt="Korean Speaker" />
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

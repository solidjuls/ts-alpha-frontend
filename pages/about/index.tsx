import React from "react";
import { TopPlayerRating } from "components/TopPlayerRating";
import Image from "next/image";
import { 
  BaseCard,
  CardInner,
  HeaderCard,
  HeaderInner,
  Page,
  Stack,
  Title,
  Subtitle,
  Subheading,
  Paragraph,
  SmallNote,
  ExternalLink,
  InternalLink,
  List,
  NestedList,
  OrderedList,
  BulletList,
  Dl,
  Dt,
  Dd,
  LanguagePill,
  FlagWrap,
  ITSRGrid,
  RatingWrapper,
  Inline
 } from "styles/about.styled";

const WIDTH = 24;
const HEIGHT = 16;

const Card = ({ children, ...rest }: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) => (
  <BaseCard {...rest}>
    <CardInner>{children}</CardInner>
  </BaseCard>
);

const AboutPage = () => (
  <Page>
    <Stack>
      <HeaderCard>
        <HeaderInner>
          <Title>About the International Twilight Struggle Community</Title>
          <Paragraph>
            Welcome to <strong>twilight-struggle.com</strong>, the home of competitive Twilight Struggle and the International Twilight Struggle community.
          </Paragraph>
          <Paragraph>
            Published by GMT Games in 2005, Twilight Struggle is regarded by many as one of the best competitive board
            games of all time. This website is run and maintained by the <strong>ITS Junta</strong>, a group of
            enthusiasts who organize online and live tournaments. You can check out our{" "}
            <ExternalLink href="https://docs.google.com/document/d/1tfDV_R2GXQfTmBAEjzlPUIY__BsU1Yd3eauIfzMVBI4/">
              community rules
            </ExternalLink>{" "}
            to learn more.
          </Paragraph>
        </HeaderInner>
      </HeaderCard>

      <Card>
        <Subtitle>Our Tournaments</Subtitle>
        <Paragraph>
          We have a large database of over 30,000 competitive games, from 2006 to the present, played by over 1,500
          players in over 100 tournaments. Some of the tournaments include:
        </Paragraph>

        <List>
          <li>
            <InternalLink href="/standings">ITSL</InternalLink> - The largest yearly international league with geographic divisions (~200
            players, 20-game regular season + playoffs).
          </li>
          <li>
            <ExternalLink href="https://docs.google.com/spreadsheets/d/1h9T_3mAAAhV34ldcqQ549pOCEGy1EjMGl8Fc7XWmb18/">
              OTSL
            </ExternalLink>{" "}
            - A smaller, more casual two-tiered league with non-geographic divisions.
          </li>
          <li>
            <ExternalLink href="https://tiny.cc/RTSL" target="_blank" rel="noreferrer">
              RTSL
            </ExternalLink>{" "}
            - A four-tiered league with relegation/promotion each season (formerly the Reddit tournament).
          </li>
          <li>
            <ExternalLink
              href="https://docs.google.com/spreadsheets/d/1VG6d0s1NEP5CufFsa8wjwZfK6tcvpzuJzYxtsFIX98s/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Evergreen Cup
            </ExternalLink>{" "}
            - A single-elimination tournament with 10 days to complete each round. Four cups are held per year with the
            top players competing for the championship at the end.
          </li>
          <li>
            <strong>RATS</strong> - A series of asynchronous leagues (
            <ExternalLink
              href="https://docs.google.com/spreadsheets/d/1ivRRIPGt-iQsRj8_Mi_6y0GtbQ8lXhrZgm6Bsid8wDs/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              RATS League
            </ExternalLink>
            ,{" "}
            <ExternalLink
              href="https://docs.google.com/spreadsheets/d/1dzL5lhVCkImqEI63V6fpvcWKIIgFj-dyp2URi3o0a04/edit?gid=1723138185"
              target="_blank"
              rel="noreferrer"
            >
              RATS 7D
            </ExternalLink>
            ,{" "}
            <ExternalLink
              href="https://docs.google.com/spreadsheets/d/1UgJg4ciPpudJ0VhmTBk2N41NV2QP8C3yukvsQQZXVoY/edit?gid=2025014817"
              target="_blank"
              rel="noreferrer"
            >
              RATS Swiss
            </ExternalLink>
            ,{" "}
            <ExternalLink
              href="https://docs.google.com/spreadsheets/d/1b5-KpwKhB8tyWLioxABaZ5M3Cv_aYxKbmnBF8NteoMg/edit?gid=1457881874"
              target="_blank"
              rel="noreferrer"
            >
              RATS Cup
            </ExternalLink>
            ,{" "}
            <ExternalLink
              href="https://docs.google.com/spreadsheets/d/1s83QIQSoFFWLeAq_Q_RRGq0yr6sUDavny7H9GdcL1Pg/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              RATS Double Elimination
            </ExternalLink>
            ).
          </li>
          <li>
            <strong>King&apos;s Cup</strong> - The largest weekend tournament of the year, featuring an 8-game Swiss
            format.
          </li>
          <li>
            <strong>Grand Slam Series</strong> - A yearly series of shorter, one-day tournaments.
          </li>
          <li>
            <strong>Convention</strong> - A yearly in-person two-day event held in various cities.
          </li>
          <li>
            <ExternalLink
              target="_blank"
              rel="noreferrer"
              href="https://docs.google.com/spreadsheets/d/1Lbg7YN8YCI0lXoqlNI2_C1D6EUyl3y_7xABpp2IVuAk/edit?gid=446700816#gid=446700816"
            >
              Nations Cup
            </ExternalLink>{" "}
            /{" "}
            <ExternalLink
              target="_blank"
              rel="noreferrer"
              href="https://docs.google.com/spreadsheets/d/1Lbg7YN8YCI0lXoqlNI2_C1D6EUyl3y_7xABpp2IVuAk/edit?gid=1173919445#gid=1173919445"
            >
              US Cup
            </ExternalLink>{" "}
            - Regional team tournaments.
          </li>
          <li>
            <ExternalLink
              target="_blank"
              rel="noreferrer"
              href="https://docs.google.com/spreadsheets/d/1zHJoK051Z01fQpmVEtvDhz2ZiwUEGSmJ80QhTZKoYS8/"
            >
              Champions League
            </ExternalLink>{" "}
            - An invite-only tournament inspired by UEFA, featuring winners of regional and grand tournaments.
          </li>
          <li>
            <strong>Regional/National Leagues</strong> - Local leagues feeding into the Champions League.
            <NestedList>
              <li>
                Arab Tournament - <InternalLink href="/userprofile/3163">Driss Kadata</InternalLink>
              </li>
              <li>
                Atlantic League (US) - <InternalLink href="/userprofile/2232">Justin Abramson</InternalLink>
              </li>
              <li>
                Basque League - <InternalLink href="/userprofile/2971">Markel Elortza</InternalLink>
              </li>
              <li>
                Canadian League - <InternalLink href="/userprofile/2415">Max Goldman</InternalLink>
              </li>
              <li>
                Chinese League - <InternalLink href="/userprofile/2886">Weiran Xie</InternalLink>
              </li>
              <li>
                Dutch League - <InternalLink href="/userprofile/2556">Peter Heuvelman</InternalLink>
              </li>
              <li>
                Eastern European League -{" "}
                <InternalLink href="/userprofile/2281">Konstantin Zakharov</InternalLink> and{" "}
                <InternalLink href="/userprofile/2535">Pavel Lobatsevich</InternalLink>
              </li>
              <li>
                French League - <InternalLink href="/userprofile/1928">Franck Rondepierre</InternalLink>
              </li>
              <li>Greek League</li>
              <li>
                Italian League - <InternalLink href="/userprofile/1597">Andrea Ciappi</InternalLink> and{" "}
                <InternalLink href="/userprofile/1600">Andrea Mancuso</InternalLink>
              </li>
              <li>
                Korean Twilight Struggle League (KTSL) -{" "}
                <InternalLink href="/userprofile/2853">Youngbae Park</InternalLink>
              </li>
              <li>
                Liga de Federaciones de Twilight Struggle (LFTS) -{" "}
                <InternalLink href="/userprofile/2084">Jarib Flores</InternalLink>
              </li>
              <li>
                Midwest League (US) - <InternalLink href="/userprofile/1844">Derek Miller</InternalLink>
              </li>
              <li>
                Nordic League - <InternalLink href="/userprofile/1630">Anton Skott</InternalLink>
              </li>
              <li>
                Polish League - <InternalLink href="/userprofile/2878">Ziemowit Pazderski</InternalLink>
              </li>
              <li>
                Western US League - <InternalLink href="/userprofile/2525">Patrick Gong</InternalLink>
              </li>
              <li>UK League</li>
            </NestedList>
          </li>
        </List>
      </Card>

      <Card>
        <Subtitle>ITSR Rating System</Subtitle>

        <ITSRGrid>
          <div>
            <Paragraph>
              Although most of our games are played on Playdek’s online app, their rating system can be gamed. Thus, we
              use our own <strong>ITSR</strong> based on the AREA rating system. Here’s a summary of how it works:
            </Paragraph>

            <OrderedList>
              <li>Calculate the rating difference between the two players.</li>
              <li>Take 5% of the difference and round it. For friendly games, halve this value.</li>
              <li>
                Apply a baseline (100 points for regular, 50 for friendly games) and adjust the ratings based on the
                result:
                <BulletList>
                  <li>
                    If the lower-rated player wins, they gain the baseline + 5% of the difference, and the higher-rated
                    player loses the same amount.
                  </li>
                  <li>If the higher-rated player wins, they gain the baseline - 5% of the difference.</li>
                  <li>
                    In case of a tie, the higher-rated player loses, and the lower-rated player gains 5% of the
                    difference.
                  </li>
                </BulletList>
              </li>
              <li>Minimum change: ±1 point; maximum change: ±200 points per game.</li>
            </OrderedList>

            <SmallNote>
              You can see a more detailed explanation of the ITSR system and an example in our{" "}
              <ExternalLink href="https://docs.google.com/document/d/1tfDV_R2GXQfTmBAEjzlPUIY__BsU1Yd3eauIfzMVBI4/edit?tab=t.0#heading=h.azamypt6qhvt">
                community rules
              </ExternalLink>
              .
            </SmallNote>
          </div>

          <RatingWrapper>
            <TopPlayerRating />
          </RatingWrapper>
        </ITSRGrid>
      </Card>

      <Card>
        <Subtitle>ITS Community</Subtitle>
        <Paragraph>
          Most of our communication happens on{" "}
          <ExternalLink target="_blank" rel="noreferrer" href="https://chat.whatsapp.com/FkFFVR3D2KrEPtHWtmtufD?mode=r_t">
            WhatsApp
          </ExternalLink>{" "}
          and{" "}
          <ExternalLink target="_blank" rel="noreferrer" href="https://discord.gg/ZVCQJDxdnb">
            Discord
          </ExternalLink>
          , but players can also set up games via email.
        </Paragraph>

        <Paragraph>
          You can find the full ITS rules and the names of Junta members{" "}
          <ExternalLink
            href="https://docs.google.com/document/d/1tfDV_R2GXQfTmBAEjzlPUIY__BsU1Yd3eauIfzMVBI4/edit?usp=drivesdk"
            target="_blank"
            rel="noreferrer"
          >
            here
          </ExternalLink>
          .
        </Paragraph>

        <Paragraph>
          To sign up for tournaments and create a user profile, please use this{" "}
          <ExternalLink href="https://forms.gle/3tj6uSNHnY9vr8KH9" target="_blank" rel="noreferrer">
            Google form
          </ExternalLink>
          .
        </Paragraph>

        <Paragraph>
          For questions, contact Junta at{" "}
          <ExternalLink href="mailto:its.junta@gmail.com" target="_blank" rel="noreferrer">
            its.junta@gmail.com
          </ExternalLink>
          .
        </Paragraph>
      </Card>

      <Card>
        <Subtitle>How to Play Twilight Struggle</Subtitle>
        <Paragraph>
          Twilight Struggle has a STEEP learning curve. Watching gameplay videos is a great way to learn (you can see
          many of those videos in the next section), but the resources below may also be helpful.
        </Paragraph>

        <Subheading>Strategy</Subheading>
        <Dl>
          <div>
            <Dt>
              <ExternalLink href="https://www.reddit.com/r/twilightstruggle" target="_blank" rel="noreferrer">
                Twilight Struggle Reddit
              </ExternalLink>
            </Dt>
            <Dd>
              A great Reddit community that answers your questions about Twilight Struggle without snark or judgement
              (since we all know how hard this game is to learn).
            </Dd>
          </div>

          <div>
            <Dt>
              <ExternalLink href="https://twilightstrategy.com/" target="_blank" rel="noreferrer">
                Twilight Strategy Guide
              </ExternalLink>
            </Dt>
            <Dd>
              Twilight Strategy is a website and a great resource for beginners. While some of the strategies may be
              dated, the card descriptions and much of the other information are still helpful.
            </Dd>
          </div>

          <div>
            <Dt>
              <ExternalLink href="https://www.youtube.com/watch?v=2Hnxkl0O68k" target="_blank" rel="noreferrer">
                Legendary Tactics Twilight Struggle Strategy
              </ExternalLink>
            </Dt>
            <Dd>
              A long compilation video of Legendary Tactics&apos; individual Twilight Struggle card videos, featuring
              strategies that are somewhat more up-to-date than those on the Twilight Strategy website.
            </Dd>
          </div>

          <div>
            <Dt>
              <ExternalLink
                href="https://maninmotiongoingnowhere.wordpress.com/2017/02/14/twilight-struggle-the-collected-musings-of-sankt/"
                target="_blank"
                rel="noreferrer"
              >
                Sankt Strategy
              </ExternalLink>
            </Dt>
            <Dd>
              A synopsis of the more current strategy used by top-level Twilight Struggle players. This strategy was
              developed by members of the Chinese Twilight Struggle community and compiled by ITS community member{" "}
              <InternalLink href="/userprofile/2287">Kris Wei</InternalLink>.
            </Dd>
          </div>
        </Dl>

        <Subheading>Tools and Resources</Subheading>
        <Dl>
          <div>
            <Dt>
              <ExternalLink href="https://david.mcwebsite.net/ts/" target="_blank" rel="noreferrer">
                David McHealy&apos;s Card Tracker
              </ExternalLink>
            </Dt>
            <Dd>
              One of the first online card trackers for Twilight Struggle and it is used by many members of the ITS
              community. ITS tournaments generally allow the use of card trackers.
            </Dd>
          </div>

          <div>
            <Dt>
              <ExternalLink href="https://gentle-island-0bac64303.5.azurestaticapps.net/" target="_blank" rel="noreferrer">
                Juri Golomako&apos;s Card Tracker
              </ExternalLink>
            </Dt>
            <Dd>
              A more recent card tracker for Twilight Struggle, created by a member of the ITS community.
            </Dd>
          </div>

          <div>
            <Dt>
              <ExternalLink href="https://ts-replayer.fly.dev/" target="_blank" rel="noreferrer">
                Twilight Struggle Replay
              </ExternalLink>
            </Dt>
            <Dd>
              A page created by <InternalLink href="/userprofile/3155">Joris Vandenbroeck</InternalLink> to
              upload and visualize your game&apos;s log files. Just upload your log files and it will generate a
              beautiful chart of your game data.
            </Dd>
          </div>

          <div>
            <Dt>
              <InternalLink
                href="https://www.gmtgames.com/p-927-twilight-struggle-deluxe-edition-8th-printing.aspx"
                target="_blank"
                rel="noreferrer"
              >
                GMT Twilight Struggle Page
              </InternalLink>
            </Dt>
            <Dd>The official page from the publisher (GMT) of the tabletop version of Twilight Struggle.</Dd>
          </div>

          <div>
            <Dt>
              <ExternalLink href="https://www.playdekgames.com/twilight-struggle" target="_blank" rel="noreferrer">
                Playdek Twilight Struggle
              </ExternalLink>
            </Dt>
            <Dd>
              Playdek is the most popular digital edition of Twilight Struggle. It is also the version used in ITS
              leagues.
            </Dd>
          </div>
        </Dl>
      </Card>

      <Card>
        <Subtitle>Community Twilight Struggle Videos</Subtitle>
        <Paragraph>
          The videos and streams below are from members of the ITS community. Watching videos of Twilight Struggle with
          commentary is one of the best ways to learn the game. Links with a flag may indicate content in a language
          other than English. Crossed-out links lead to pages that are no longer actively posting videos, but may have
          some past videos of Twilight Struggle. Contact{" "}
          <InternalLink href="/userprofile/1844">Derek Miller</InternalLink> for updates to this page.
        </Paragraph>

        <List>
          <li>
            <strong>Action Round Zero</strong> (Official ITS Community Stream):{" "}
            <ExternalLink href="https://www.youtube.com/@ActionRoundZero" target="_blank" rel="noreferrer">
              YouTube
            </ExternalLink>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1572">Alex Yoosup Lim</InternalLink> (FreeTibet):{" "}
              <ExternalLink href="https://www.youtube.com/@Alex-YSL" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Korean Speaker">
                <FlagWrap>
                  <Image src="/flags/KR.png" width={WIDTH} height={HEIGHT} alt="Korean Speaker" />
                </FlagWrap>
                KR
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1620">Ani Palmer</InternalLink> (ani palmer):{" "}
              <ExternalLink href="https://www.youtube.com/@AniPalmerTS" target="_blank" rel="noreferrer" $inactive>
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1627">Antoine Danel</InternalLink> (tonio76):{" "}
              <ExternalLink href="https://www.youtube.com/@tonio76ts4" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="French Speaker">
                <FlagWrap>
                  <Image src="/flags/FR.png" width={WIDTH} height={HEIGHT} alt="French Speaker" />
                </FlagWrap>
                FR
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1630">Anton Skott</InternalLink> (stenskott):{" "}
              <ExternalLink href="https://www.twitch.tv/stenskott_" target="_blank" rel="noreferrer">
                Twitch
              </ExternalLink>{" "}
              -{" "}
              <ExternalLink href="https://www.youtube.com/asprayofrocks" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1634">Aran Warszawski</InternalLink> (aranwar):{" "}
              <ExternalLink href="https://www.youtube.com/@aranwar" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Hebrew Speaker">
                <FlagWrap>
                  <Image src="/flags/IL.png" width={WIDTH} height={HEIGHT} alt="Hebrew Speaker" />
                </FlagWrap>
                IL
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1645">Ashlee Freeman</InternalLink> (TheGoddessAshlee):{" "}
              <ExternalLink href="https://www.twitch.tv/thegoddessashlee" target="_blank" rel="noreferrer">
                Twitch
              </ExternalLink>{" "}
              -{" "}
              <ExternalLink href="https://www.youtube.com/@ashleefreeman1219" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1658">Bartosz Wróbel</InternalLink> (Sparrov):{" "}
              <ExternalLink href="https://www.youtube.com/@SparrovTS/featured" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2953">Cole Jarvis</InternalLink> (Cole_JW):{" "}
              <ExternalLink href="https://www.youtube.com/@ColeJ_23" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1780">Craig Richards</InternalLink> (Caecius):{" "}
              <ExternalLink href="https://www.twitch.tv/caecius" target="_blank" rel="noreferrer" $inactive>
                Twitch
              </ExternalLink>{" "}
              -{" "}
              <ExternalLink href="https://www.youtube.com/c/CaeciusG" target="_blank" rel="noreferrer" $inactive>
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1781">Crow Crowlas</InternalLink> (Cardlinger):{" "}
              <ExternalLink href="https://www.twitch.tv/crowcrowlas" target="_blank" rel="noreferrer">
                Twitch
              </ExternalLink>{" "}
              -{" "}
              <ExternalLink
                href="https://www.youtube.com/channel/UC8jyJ0oldrJUxNEGBZEGS6w"
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1814">David Choo</InternalLink> (Churchill A):{" "}
              <ExternalLink href="https://www.youtube.com/@davidchoo0702" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Korean Speaker">
                <FlagWrap>
                  <Image src="/flags/KR.png" width={WIDTH} height={HEIGHT} alt="Korean Speaker" />
                </FlagWrap>
                KR
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1844">Derek Miller</InternalLink> (DRock1984):{" "}
              <ExternalLink href="https://www.twitch.tv/drock1984" target="_blank" rel="noreferrer">
                Twitch
              </ExternalLink>{" "}
              -{" "}
              <ExternalLink href="https://www.youtube.com/@drock1984" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1879">Edward Prem</InternalLink> (EdPrem):{" "}
              <ExternalLink href="https://www.youtube.com/c/GamingwiththeColonel" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1928">Franck Rondepierre</InternalLink> (N3ige):{" "}
              <ExternalLink href="https://www.youtube.com/@neige856" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="French Speaker">
                <FlagWrap>
                  <Image src="/flags/FR.png" width={WIDTH} height={HEIGHT} alt="French Speaker" />
                </FlagWrap>
                FR
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/1984">Guangheng Wu</InternalLink> (harrywgh):{" "}
              <ExternalLink href="https://www.youtube.com/channel/UCHg3vmoH73MJ79D7-Umpwjw" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2000">Hasan Jamil</InternalLink> (peacetreaty):{" "}
              <ExternalLink
                href="https://www.youtube.com/channel/UCMq--dchvaIWVk-m5O3Cdbw"
                target="_blank"
                rel="noreferrer"
                $inactive
              >
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2011">Hervé Godinot</InternalLink> (Peace Turtle):{" "}
              <ExternalLink href="https://www.youtube.com/@defcon1335/" target="_blank" rel="noreferrer" $inactive>
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="French Speaker">
                <FlagWrap>
                  <Image src="/flags/FR.png" width={WIDTH} height={HEIGHT} alt="French Speaker" />
                </FlagWrap>
                FR
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2084">Jarib Flores</InternalLink> (Blacklisted):{" "}
              <ExternalLink href="https://www.youtube.com/@BlacklistedTS" target="_blank" rel="noreferrer" $inactive>
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Spanish Speaker">
                <FlagWrap>
                  <Image src="/flags/ES.png" width={WIDTH} height={HEIGHT} alt="Spanish Speaker" />
                </FlagWrap>
                ES
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2129">Jesse Marshall</InternalLink> (Jessemarshall):{" "}
              <ExternalLink href="https://www.twitch.tv/thewinningagenda" target="_blank" rel="noreferrer" $inactive>
                Twitch
              </ExternalLink>{" "}
              -{" "}
              <ExternalLink href="https://www.youtube.com/@TheWinningAgenda" target="_blank" rel="noreferrer" $inactive>
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/3040">Jo&atilde;o Pereira</InternalLink> (Knight4):{" "}
              <ExternalLink href="https://www.youtube.com/@Knight4_TS" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2190">Jordan Cass</InternalLink> (donzobean12):{" "}
              <ExternalLink href="https://www.twitch.tv/donzobean" target="_blank" rel="noreferrer">
                Twitch
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2215">Josiah Emery</InternalLink> (aunthemod):{" "}
              <ExternalLink href="https://www.youtube.com/channel/UCe4Z-vDM3eAuOS_180DLw5A" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2216">JR Jones</InternalLink> (dsotc27):{" "}
              <ExternalLink href="https://www.twitch.tv/dsotc" target="_blank" rel="noreferrer">
                Twitch
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2229">JunRu Li</InternalLink> (whitesheep412):{" "}
              <ExternalLink href="https://v.douyu.com/author/08Aeq1GZeAqL" target="_blank" rel="noreferrer" $inactive>
                Douyu
              </ExternalLink>{" "}
              <LanguagePill title="Chinese Speaker">
                <FlagWrap>
                  <Image src="/flags/CN.png" width={WIDTH} height={HEIGHT} alt="Chinese Speaker" />
                </FlagWrap>
                CN
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2230">Juri Golomako</InternalLink> (Partisan.Bel):{" "}
              <ExternalLink href="https://www.youtube.com/@twilightstrugglebelarus2769/" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Russian Speaker">
                <FlagWrap>
                  <Image src="/flags/BY.png" width={WIDTH} height={HEIGHT} alt="Russian Speaker" />
                </FlagWrap>
                BY
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2232">Justin Abramson</InternalLink> (PioneerTowel):{" "}
              <ExternalLink href="https://www.twitch.tv/pioneertowel/" target="_blank" rel="noreferrer">
                Twitch
              </ExternalLink>{" "}
              -{" "}
              <ExternalLink href="https://www.youtube.com/@pioneertowel" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2235">Justin Nordstrom</InternalLink> (Flour Power):{" "}
              <ExternalLink href="https://www.youtube.com/user/justnord2010" target="_blank" rel="noreferrer" $inactive>
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/3083">Hyonsoo Park</InternalLink> (hiosjoa):{" "}
              <ExternalLink href="https://www.youtube.com/@hyonsoopark2832" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Korean Speaker">
                <FlagWrap>
                  <Image src="/flags/KR.png" width={WIDTH} height={HEIGHT} alt="Korean Speaker" />
                </FlagWrap>
                KR
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/3168">Hyungyu Sung</InternalLink> (making_chem):{" "}
              <ExternalLink href="https://www.youtube.com/@49dhehe" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2579">Itshu Nakashima</InternalLink> (Graphene):{" "}
              <ExternalLink href="https://v.douyu.com/author/08AeOjpM1wqL" target="_blank" rel="noreferrer" $inactive>
                Douyu
              </ExternalLink>{" "}
              <LanguagePill title="Chinese Speaker">
                <FlagWrap>
                  <Image src="/flags/CN.png" width={WIDTH} height={HEIGHT} alt="Chinese Speaker" />
                </FlagWrap>
                CN
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2137">Jie Huang</InternalLink> (MDZZ):{" "}
              <ExternalLink
                href="https://space.bilibili.com/1626326/lists/976714?type=series"
                target="_blank"
                rel="noreferrer"
                $inactive
              >
                Bilibili
              </ExternalLink>{" "}
              <LanguagePill title="Chinese Speaker">
                <FlagWrap>
                  <Image src="/flags/CN.png" width={WIDTH} height={HEIGHT} alt="Chinese Speaker" />
                </FlagWrap>
                CN
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2271">Kevin Gute</InternalLink> (gute321):{" "}
              <ExternalLink href="https://www.twitch.tv/gute321" target="_blank" rel="noreferrer">
                Twitch
              </ExternalLink>{" "}
              -{" "}
              <ExternalLink href="https://www.youtube.com/user/gute321" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2356">Marc Nuño</InternalLink> (AlfaMayor):{" "}
              <ExternalLink href="https://www.youtube.com/@AlfaMayor" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Spanish Speaker">
                <FlagWrap>
                  <Image src="/flags/CAT.png" width={WIDTH} height={HEIGHT} alt="Spanish Speaker" />
                </FlagWrap>
                CAT
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2415">Max Goldman</InternalLink> (maxgolds):{" "}
              <ExternalLink href="https://www.twitch.tv/maxgolds12" target="_blank" rel="noreferrer">
                Twitch
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2431">Michael Panettieri</InternalLink> (meta11ic):{" "}
              <ExternalLink href="https://www.twitch.tv/yaymeta11ic" target="_blank" rel="noreferrer">
                Twitch
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2437">Michael Stone</InternalLink> (kmmesq):{" "}
              <ExternalLink href="https://www.twitch.tv/headlineolympics" target="_blank" rel="noreferrer">
                Twitch
              </ExternalLink>{" "}
              -{" "}
              <ExternalLink href="https://www.youtube.com/@Headline_Olympics" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2509">Onur Ulusel</InternalLink> (NacRuno):{" "}
              <ExternalLink
                href="https://www.youtube.com/channel/UCwYZsrT1dTfKUY04y9P3_UQ"
                target="_blank"
                rel="noreferrer"
                $inactive
              >
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Turkish Speaker">
                <FlagWrap>
                  <Image src="/flags/TR.png" width={WIDTH} height={HEIGHT} alt="Turkish Speaker" />
                </FlagWrap>
                TR
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2537">Paweł Januszewski</InternalLink> (PawelJanuszewski):{" "}
              <ExternalLink
                href="https://www.youtube.com/channel/UCVf9V2S0unETHDNpspdqNOg"
                target="_blank"
                rel="noreferrer"
                $inactive
              >
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2555">Peter Frantz</InternalLink> (Frantzypantz):{" "}
              <ExternalLink href="https://www.youtube.com/user/Roguefire05" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2579">Qiyang Xiong</InternalLink> (YunFei):{" "}
              <ExternalLink
                href="https://space.bilibili.com/433398370/lists/1072004?type=season"
                target="_blank"
                rel="noreferrer"
                $inactive
              >
                Bilibili
              </ExternalLink>{" "}
              <LanguagePill title="Chinese Speaker">
                <FlagWrap>
                  <Image src="/flags/CN.png" width={WIDTH} height={HEIGHT} alt="Chinese Speaker" />
                </FlagWrap>
                CN
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2606">Ricki McLaughlin</InternalLink> (Feallsanachail):{" "}
              <ExternalLink href="https://www.youtube.com/@feallsanachail" target="_blank" rel="noreferrer" $inactive>
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2621">Rodrigo Laso</InternalLink> (Aldurini):{" "}
              <ExternalLink href="https://www.youtube.com/@aldurinii" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Spanish Speaker">
                <FlagWrap>
                  <Image src="/flags/ES.png" width={WIDTH} height={HEIGHT} alt="Spanish Speaker" />
                </FlagWrap>
                ES
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2670">Sean Wanschoor</InternalLink> (Hannarchie):{" "}
              <ExternalLink
                href="https://www.youtube.com/channel/UCRvAqSws-5hgewoaz49UlTw"
                target="_blank"
                rel="noreferrer"
                $inactive
              >
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2701">Siu Chun Mok</InternalLink> (Miracle_JM):{" "}
              <ExternalLink
                href="https://www.youtube.com/channel/UCItukdJLRnm1IXsotlA-BFA"
                target="_blank"
                rel="noreferrer"
                $inactive
              >
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Chinese Speaker">
                <FlagWrap>
                  <Image src="/flags/HK.png" width={WIDTH} height={HEIGHT} alt="Chinese Speaker" />
                </FlagWrap>
                HK
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2705">Sophie Askew</InternalLink> (passengera34):{" "}
              <ExternalLink href="https://www.youtube.com/@soaskew" target="_blank" rel="noreferrer" $inactive>
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <strong>Team Catalunya:</strong>{" "}
              <ExternalLink href="https://www.youtube.com/@twilightcatalunya9604" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Spanish Speaker">
                <FlagWrap>
                  <Image src="/flags/CAT.png" width={WIDTH} height={HEIGHT} alt="Spanish Speaker" />
                </FlagWrap>
                CAT
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <strong>Team Hong Kong:</strong>{" "}
              <ExternalLink
                href="https://www.youtube.com/channel/UC9MOfg1UizgFNZX3fUIB--Q"
                target="_blank"
                rel="noreferrer"
                $inactive
              >
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Chinese Speaker">
                <FlagWrap>
                  <Image src="/flags/HK.png" width={WIDTH} height={HEIGHT} alt="Chinese Speaker" />
                </FlagWrap>
                HK
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <strong>Team Washington:</strong>{" "}
              <ExternalLink
                href="https://www.youtube.com/channel/UCGlIPl6x2zMfrvuZ1B76QPg"
                target="_blank"
                rel="noreferrer"
                $inactive
              >
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <strong>Team United Kingdom:</strong>{" "}
              <ExternalLink
                href="https://www.youtube.com/channel/UChJInzqac0tPrlFO8CcknjQ"
                target="_blank"
                rel="noreferrer"
                $inactive
              >
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2762">Tim Furrow</InternalLink> (eelusion):{" "}
              <ExternalLink href="https://www.twitch.tv/eelusion/videos" target="_blank" rel="noreferrer" $inactive>
                Twitch
              </ExternalLink>{" "}
              -{" "}
              <ExternalLink href="https://www.youtube.com/@eelusion5397/videos" target="_blank" rel="noreferrer" $inactive>
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2769">Tin Sum Cheng</InternalLink> (tscheng):{" "}
              <ExternalLink href="https://www.youtube.com/user/s081023" target="_blank" rel="noreferrer" $inactive>
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2781">Tomasz Babicz</InternalLink> (Pacynka):{" "}
              <ExternalLink href="https://www.youtube.com/@teoem_be" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <strong>Twilight Struggle Club</strong>:{" "}
              <ExternalLink href="https://www.youtube.com/@twilightstruggleclub" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Russian Speaker">
                <FlagWrap>
                  <Image src="/flags/RU.png" width={WIDTH} height={HEIGHT} alt="Russian Speaker" />
                </FlagWrap>
                RU
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2827">Wojciech Pietrzak</InternalLink> (Ultima Tulinka):{" "}
              <ExternalLink href="https://www.youtube.com/@wojciechpietrzak1981/" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2832">Wuhao Yang</InternalLink> (OptNoob):{" "}
              <ExternalLink
                href="https://space.bilibili.com/24264350/lists/5501480?type=season"
                target="_blank"
                rel="noreferrer"
              >
                Bilibili
              </ExternalLink>{" "}
              <LanguagePill title="Chinese Speaker">
                <FlagWrap>
                  <Image src="/flags/CN.png" width={WIDTH} height={HEIGHT} alt="Chinese Speaker" />
                </FlagWrap>
                CN
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2853">Youngbae Park</InternalLink> (ybloveej):{" "}
              <ExternalLink href="https://www.youtube.com/c/%ED%99%A9%ED%88%AC%EB%8D%B0%EC%9D%B4" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>{" "}
              <LanguagePill title="Korean Speaker">
                <FlagWrap>
                  <Image src="/flags/KR.png" width={WIDTH} height={HEIGHT} alt="Korean Speaker" />
                </FlagWrap>
                KR
              </LanguagePill>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/2878">Ziemowit Pazderski</InternalLink> (Ziemowit):{" "}
              <ExternalLink href="https://www.youtube.com/@Ziemowit_TS" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>

          <li>
            <Inline>
              <InternalLink href="/userprofile/3170">Zihang Zhou</InternalLink> (bocchi152):{" "}
              <ExternalLink href="https://youtu.be/sG5BUkHs6h0" target="_blank" rel="noreferrer">
                YouTube
              </ExternalLink>
            </Inline>
          </li>
        </List>
      </Card>
    </Stack>
  </Page>
);

export default AboutPage;

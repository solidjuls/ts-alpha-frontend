import styled from "styled-components";

const Body = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 8px 16px;
`;

const BodyRow = styled.div`
  border-radius: 2px;
  height: 12px;
  margin-bottom: 8px;
  width: 100%;
  background-color: #e5e7eb;
`;

const SkeletonPlayers = () => (
  <>
    <Body>
      <BodyRow />
      <BodyRow />
      <BodyRow />
      <BodyRow />
      <BodyRow />
    </Body>
  </>
);

const SkeletonHomepage = () => (
  <>
    <Body>
      <BodyRow />
      <BodyRow />
    </Body>
    <Body>
      <BodyRow />
      <BodyRow />
    </Body>
    <Body>
      <BodyRow />
      <BodyRow />
    </Body>
    <Body>
      <BodyRow />
      <BodyRow />
    </Body>
    <Body>
      <BodyRow />
      <BodyRow />
    </Body>
  </>
);

export { SkeletonHomepage, SkeletonPlayers };

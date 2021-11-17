import { styled } from "@stitches/react";
import { Input } from "../Input";
import { Label } from "../Label";

const Flex = styled("div", { display: "flex" });
const cssLabel = { lineHeight: "35px", marginRight: 15 };
const cssFlex = { padding: "0 20px", flexWrap: "wrap", alignItems: "center" };
const cssLayout = { flexDirection: "column", alignItems: "center" };

const TextComponent = ({ labelText, inputValue }) => (
  <Flex css={cssFlex}>
    <Label htmlFor="video1" css={cssLabel}>
      {labelText}
    </Label>
    <Input type="text" id="video1" defaultValue={inputValue} />
  </Flex>
);
const SubmitForm = () => {
  return (
    <Flex css={cssLayout}>
      <TextComponent labelText="Type of game" inputValue="National League" />
      <TextComponent labelText="Check ID" inputValue="C000" />
      <TextComponent labelText="USA Player *" inputValue="345" />
      <TextComponent labelText="URSS Player *" inputValue="413" />
      <TextComponent labelText="Game winner" inputValue="413" />
      <TextComponent labelText="End Turn" inputValue="10" />
      <TextComponent labelText="How did it end?" inputValue="DEFCON" />
      <TextComponent labelText="Game date" inputValue="2021-11-17T09:49:22" />
      <TextComponent
        labelText="Video link 1"
        inputValue="http://www.brown.com/est-aut-aut-dicta-velit-possimus-expedita"
      />
      <TextComponent
        labelText="Video link 2"
        inputValue="http://russel.com/eos-occaecati-culpa-nulla-libero.html"
      />
      <TextComponent
        labelText="Video link 3"
        inputValue="http://www.kunde.com/ut-sunt-velit-hic-necessitatibus"
      />
    </Flex>
  );
};
export { SubmitForm };

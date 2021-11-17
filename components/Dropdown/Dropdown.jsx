import {
  Root,
  Trigger,
  Content,
  Label,
  Item,
  Group,
  CheckboxItem,
  ItemIndicator,
  RadioGroup,
  Arrow,
  RadioItem,
  TriggerItem,
  Separator,
} from "@radix-ui/react-dropdown-menu";

const Dropdown666 = () => (
  <Root>
    <Trigger />

    <Content>
      <Label />
      <Item />

      <Group>
        <Item />
      </Group>

      <CheckboxItem>
        <ItemIndicator />
      </CheckboxItem>

      <RadioGroup>
        <RadioItem>
          <ItemIndicator />
        </RadioItem>
      </RadioGroup>

      <Root>
        <TriggerItem />
        <Content />
      </Root>

      <Separator />
      <Arrow />
    </Content>
  </Root>
);
const Dropdown = () => (
    <Root>
      <Trigger />
  
      <Content>
        <Label>item 1</Label>
        <Label>item 1</Label>
        <Label>item 1</Label>
        <Item />
  
        <Arrow />
      </Content>
    </Root>
  );
export { Dropdown };

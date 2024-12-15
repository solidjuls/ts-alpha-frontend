import React, { useState } from "react";
import { Wrapper } from "./LabelCopy.styles";
import { Button } from "components/Button";

interface LabelCopyProps {
  text: string;
  className?: string;
}

const LabelCopy: React.FC<LabelCopyProps> = ({ text, css }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <Wrapper>
      <span className="label-text">{text}</span>
      <Button onClick={handleCopy} aria-label="Copy to clipboard">
        {copied ? "Copied!" : "Copy"}
      </Button>
    </Wrapper>
  );
};

export default LabelCopy;

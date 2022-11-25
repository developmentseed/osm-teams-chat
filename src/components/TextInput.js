import { Button, Textarea, Flex } from "@chakra-ui/react";
import React, { useRef, useState } from "react";

export default function TextInput({ loading, sendMessage }) {
  const inputRef = useRef();
  const [message, setMessage] = useState("");

  function handleSend() {
    sendMessage(inputRef.current.value);
    setMessage("");
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <Flex direction="column">
      <Textarea
        ref={inputRef}
        disabled={loading}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={"Type your message here..."}
        resize="vertical"
      />
      <Button onClick={handleSend}>Send</Button>
    </Flex>
  );
}

import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React, { useRef, useState } from "react";

export default function TextInput({ loading, sendMessage }) {
  const inputRef = useRef();
  const [message, setMessage] = useState("");

  function handleSend() {
    sendMessage(inputRef.current.value);
    inputRef.current.value = "";
    setMessage("");
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      handleSend();
    }
  }

  return (
    <InputGroup>
      <Input
        ref={inputRef}
        disabled={loading}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={"Type your message here..."}
      />
      <InputRightElement w={60} justifyContent="right">
        <Button colorScheme="teal" onClick={handleSend}>
          Send
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

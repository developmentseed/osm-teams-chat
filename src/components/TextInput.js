import { Textarea, Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";

export default function TextInput({ loading, sendMessage }) {
  const [message, setMessage] = useState("");

  function handleSend() {
    sendMessage(message);
    setMessage("");
  }

  return (
    <Box>
      <Textarea
        disabled={loading}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={"Type your message here..."}
        size="m"
      />
      <Button colorScheme="teal" mt={6} onClick={handleSend}>
        Send
      </Button>
    </Box>
  );
}

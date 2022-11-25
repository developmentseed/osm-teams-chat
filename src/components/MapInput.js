import React, { useState } from "react";
import { Draggable, Map, Marker } from "pigeon-maps";
import { Stack, Input, Textarea, Button, Text } from "@chakra-ui/react";
import { all } from "ramda";

export default function MapInput({ sendMessage }) {
  const [anchor, setAnchor] = useState([40.749444, -73.968056]);
  const [msgValue, setMessage] = useState("");
  const [textCoords, setTextCoords] = useState(anchor);

  function handleTextCoords(e) {
    const value = e.target?.value;

    const coords = value.split(",").map((x) => parseFloat(x));
    if (coords.length === 2 && all((x) => !isNaN(x), coords)) {
      setAnchor(coords);
    }

    setTextCoords(value);
  }

  function handleDragEnd(anchor) {
    setTextCoords(anchor.join(","));
    setAnchor(anchor);
  }

  function handleSend() {
    sendMessage({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [anchor[1], anchor[0]],
      },
      properties: {
        note: msgValue,
      },
    });
    setMessage("");
  }

  return (
    <>
      <Stack>
        <Text>Drag the marker on the map to set a location</Text>
        <Map
          height={300}
          defaultCenter={[40.749444, -73.968056]}
          defaultZoom={11}
        >
          <Draggable
            offset={[15, 30]}
            width={30}
            height={30}
            anchor={anchor}
            onDragEnd={handleDragEnd}
          >
            <Marker style={{ filter: "none" }} />
          </Draggable>
        </Map>
        <Input value={textCoords} onChange={handleTextCoords} />
        <Textarea
          p={2}
          value={msgValue}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={"Add a note here..."}
          size="m"
        />
      </Stack>
      <Button colorScheme="teal" onClick={handleSend} mt={6}>
        Send
      </Button>
    </>
  );
}

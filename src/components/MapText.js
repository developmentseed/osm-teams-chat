import React from "react";
import { Map, Marker } from "pigeon-maps";
import { Stack } from "@chakra-ui/react";
import MessageText from "./MessageText";

export function MapText({ feature }) {
  const coords = feature?.geometry?.coordinates;
  const note = feature?.properties?.note || "";
  const anchor = [coords[1], coords[0]];

  return (
    <Stack>
      <Map
        height={150}
        width={300}
        defaultCenter={anchor}
        defaultZoom={15}
        mouseEvents={false}
        touchEvents={false}
      >
        <Marker width={20} anchor={anchor} />
      </Map>
      <MessageText width={300}>{note}</MessageText>
    </Stack>
  );
}

import React from "react";
import { Map, Marker } from "pigeon-maps";
import { Stack, Text } from "@chakra-ui/react";

export function MapText({ feature }) {
  const anchor = feature?.geometry?.coordinates || [0, 0];
  const note = feature?.properties?.note || "";

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
        <Marker width={20} anchor={anchor}></Marker>
      </Map>
      <Text width={300}>{note}</Text>
    </Stack>
  );
}

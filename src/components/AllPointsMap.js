import { useState } from "react";
import { Map, GeoJson } from "pigeon-maps";
import { prop } from "ramda";
import geoViewport from "@mapbox/geo-viewport";
import turfBbox from "@turf/bbox";
import { Stack, Text } from "@chakra-ui/react";

export default function AllPointsMap({ data }) {
  const [note, setNote] = useState("...");

  function centerZoomFromLocations(fc, width = 564, height = 300) {
    const bounds = turfBbox(fc);

    const { center, zoom } = geoViewport.viewport(bounds, [width, height]);

    return {
      center: [center[1], center[0]],
      zoom: Math.min(zoom, 13),
    };
  }

  if (!data || data.length === 0) return;
  let mapFeatures = data.map((msg) => {
    let feature = prop("text", msg);
    feature.properties.from = prop("from", msg);
    return feature;
  });

  const gj = {
    type: "FeatureCollection",
    features: mapFeatures,
  };
  console.log(data, gj);
  const { center, zoom } = centerZoomFromLocations(gj);

  return (
    <Stack>
      <Map height={300} center={center} zoom={zoom}>
        <GeoJson
          data={gj}
          onMouseOver={({ payload }) => {
            setNote(`${payload.properties.from}: ${payload.properties.note}`);
          }}
          onMouseOut={() => setNote("...")}
          styleCallback={() => {
            return {
              fill: "blue",
              fillOpacity: "0.3",
              strokeWidth: "1",
              stroke: "white",
              r: "20",
            };
          }}
        />
      </Map>
      <Text>{note}</Text>
    </Stack>
  );
}

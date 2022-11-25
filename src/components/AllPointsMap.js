import { useEffect, useState } from "react";
import { Map, GeoJson } from "pigeon-maps";
import { prop } from "ramda";
import geoViewport from "@mapbox/geo-viewport";
import turfBbox from "@turf/bbox";
import { Stack, Text } from "@chakra-ui/react";

export default function AllPointsMap({ channelId, accessToken }) {
  const [mapData, setMapData] = useState("");
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [mapZoom, setMapZoom] = useState(1);
  const [note, setNote] = useState("...");

  function centerZoomFromLocations(fc, width = 564, height = 300) {
    const bounds = turfBbox(fc);

    const { center, zoom } = geoViewport.viewport(bounds, [width, height]);

    return {
      center: [center[1], center[0]],
      zoom: Math.min(zoom, 13),
    };
  }

  useEffect(() => {
    if (!accessToken) return;
    fetch(`/api/chat/${channelId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(({ mapHistory }) => {
        let mapFeatures = mapHistory.map((msg) => {
          let feature = prop("text", msg);
          feature.properties.from = prop("from", msg);
          return feature;
        });

        let gj = {
          type: "FeatureCollection",
          features: mapFeatures,
        };
        setMapData(gj);
        const { center, zoom } = centerZoomFromLocations(gj);
        setMapCenter(center);
        setMapZoom(zoom);
      });
  }, [channelId, accessToken]);
  return (
    <Stack>
      <Map
        height={300}
        center={mapCenter}
        zoom={mapZoom}
        onBoundsChanged={({ center, zoom }) => {
          setMapCenter(center);
          setMapZoom(zoom);
        }}
      >
        <GeoJson
          data={mapData}
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

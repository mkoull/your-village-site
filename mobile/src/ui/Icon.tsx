import React from "react";
import Svg, { Circle, Path, SvgXml } from "react-native-svg";
import { serviceFor } from "../domain/catalog";
import { c } from "./theme";
const paths: Record<string, string> = {
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  plan: "M8 4H5v17h15V4h-3M9 2h7v5H9zM9 12h6M9 16h6",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2",
  plus: "M12 5v14M5 12h14",
  check: "M5 12l4 4L19 6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  external: "M14 3h7v7M21 3L10 14M10 4H4v16h16v-6",
  back: "M19 12H5m6-6-6 6 6 6",
  close: "M6 6l12 12M6 18L18 6",
  bell: "M18 8a6 6 0 0 0-12 0v7l-2 3h16l-2-3V8M10 21h4",
  share: "M12 16V2M7 7l5-5 5 5M5 12H3v10h18V12h-2",
};
export function Mark({
  size = 38,
  light = false,
}: {
  size?: number;
  light?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" aria-hidden={true}>
      {Array.from({ length: 8 }, (_, i) => (
        <Circle
          key={i}
          cx={32 + 22 * Math.sin((i * Math.PI) / 4)}
          cy={32 - 22 * Math.cos((i * Math.PI) / 4)}
          r={4.5}
          fill={light ? "#E5E7CD" : c.forest}
        />
      ))}
      <Circle cx={32} cy={32} r={9} fill={c.gold} />
    </Svg>
  );
}
export function Icon({
  name,
  size = 22,
  color = c.forest,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const service = serviceFor(name);
  if (service)
    return (
      <SvgXml
        width={size}
        height={size}
        xml={service.icon.replaceAll("currentColor", color)}
        aria-hidden={true}
      />
    );
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}
    >
      <Path d={paths[name] || paths.plus} />
    </Svg>
  );
}

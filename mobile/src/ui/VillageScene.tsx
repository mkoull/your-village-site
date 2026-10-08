import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Line } from "react-native-svg";
import { router } from "expo-router";
import { services } from "../domain/catalog";
import { useVillage } from "../state/VillageContext";
import { c, f } from "./theme";
import { Icon, Mark } from "./Icon";

export function VillageScene() {
  const { state } = useVillage();
  const [width, setWidth] = useState(300);
  const centre = width / 2,
    radius = width * 0.35;
  return (
    <LinearGradient
      colors={["#53674E", "#2C473E"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.scene}
    >
      <Text style={styles.eyebrow}>A LITTLE HELP, ALL AROUND YOU</Text>
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={styles.map}
      >
        <Svg
          width={width}
          height={width}
          style={StyleSheet.absoluteFill}
          aria-hidden={true}
        >
          <Circle
            cx={centre}
            cy={centre}
            r={radius}
            stroke="#D6DFCC30"
            strokeWidth={1}
            fill="none"
          />
          {services.map((service, i) => {
            const x = centre + radius * Math.sin((i * Math.PI) / 4),
              y = centre - radius * Math.cos((i * Math.PI) / 4);
            return (
              <Line
                key={service.slug}
                x1={centre}
                y1={centre}
                x2={x}
                y2={y}
                stroke={
                  state.village.needs.includes(service.slug)
                    ? "#ECCD8790"
                    : "#D6DFCC20"
                }
                strokeWidth={1}
              />
            );
          })}
        </Svg>
        <View style={[styles.you, { left: centre - 43, top: centre - 43 }]}>
          <Mark size={23} />
          <Text style={styles.youText}>You</Text>
        </View>
        {services.map((service, i) => {
          const selected = state.village.needs.includes(service.slug);
          return (
            <Pressable
              key={service.slug}
              accessibilityRole="button"
              accessibilityLabel={`${service.shortTitle}${selected ? ", saved" : ""}: explore support`}
              onPress={() => router.push(`/support/${service.slug}`)}
              style={({ pressed }) => [
                styles.node,
                { opacity: pressed ? 0.75 : 1 },
                {
                  left: centre + radius * Math.sin((i * Math.PI) / 4) - 34,
                  top: centre - radius * Math.cos((i * Math.PI) / 4) - 27,
                },
              ]}
            >
              <View style={[styles.light, selected && styles.lit]}>
                <Icon
                  name={service.slug}
                  size={23}
                  color={selected ? c.goldInk : "#E1E7D8"}
                />
                {selected && (
                  <View style={styles.tick}>
                    <Icon name="check" size={10} color={c.goldInk} />
                  </View>
                )}
              </View>
              <Text style={[styles.name, selected && { color: "#FFE5A8" }]}>
                {service.shortTitle}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.hint}>Tap a light to explore. Save what helps.</Text>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  scene: {
    borderRadius: 30,
    paddingTop: 24,
    paddingBottom: 22,
    paddingHorizontal: 4,
    overflow: "hidden",
  },
  eyebrow: {
    fontFamily: f.medium,
    fontSize: 10,
    letterSpacing: 1.4,
    textAlign: "center",
    color: "#E1E5D2",
  },
  map: {
    width: "100%",
    maxWidth: 390,
    aspectRatio: 1,
    alignSelf: "center",
    marginVertical: 2,
  },
  node: {
    position: "absolute",
    width: 68,
    minHeight: 68,
    alignItems: "center",
    gap: 6,
  },
  light: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#CDD5C85C",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF08",
  },
  lit: {
    borderColor: "#F9E3A1",
    backgroundColor: c.gold,
    boxShadow: "0px 0px 22px 3px rgba(247, 209, 125, 0.35)",
  },
  tick: {
    position: "absolute",
    right: -1,
    top: -1,
    width: 16,
    height: 16,
    backgroundColor: "#FFF0C8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontFamily: f.medium,
    fontSize: 11,
    color: "#E1E7D8",
    textAlign: "center",
  },
  you: {
    position: "absolute",
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#F3E7BC",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 0px 28px 8px rgba(247, 209, 125, 0.15)",
  },
  youText: { fontFamily: f.heading, fontSize: 30, color: c.deep },
  hint: {
    fontFamily: f.body,
    fontSize: 11,
    color: "#E1E7D8",
    textAlign: "center",
  },
});

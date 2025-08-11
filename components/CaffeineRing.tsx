import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import {STRINGS, normalizeLanguage } from "@/components/language/Strings";
import {useDrinks} from "@/components/AppContext";

interface CaffeineRingProps {
    percentage: number;
    current: number;
    limit: number;
}

const CaffeineRing = ({ percentage, current, limit }: CaffeineRingProps) => {
    const radius = 80;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const visualPercentage = Math.min(percentage, 100);
    const strokeDashoffset = circumference - (visualPercentage / 100) * circumference;
    const { language } = useDrinks();
    const langCode = normalizeLanguage(language);

    const getRingColor = () => {
        if (percentage >= 100) return "#facc15"; // yellow-400
        return "#3b82f6"; // blue-500 (default)
    };

    return (
        <View className="relative"
              style={{width: radius * 2,
                  height: radius * 2,
                  alignItems: "center",
                  justifyContent: "center",}}
        >
        <Svg
            height={radius * 2}
            width={radius * 2}
            style={{ position: "absolute",
            top: 0,
            left: 0,
            transform: [{ rotate: "-90deg" }] }}
        >
                {/* Background circle */}
                <Circle
                    stroke="#1e293b"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                {/* Progress circle */}
                <Circle
                    stroke={getRingColor()}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </Svg>

            {/* Center content */}
            <View className="absolute inset-0 items-center justify-center">
                <Text style={{ fontSize: 28 }} className="font-bold text-white">{current}</Text>
                <Text className="text-sm text-slate-400">mg {STRINGS[langCode].home.ring.l1}</Text>
                <Text className="text-xs text-slate-500">{STRINGS[langCode].home.ring.l2p1} {limit}mg {STRINGS[langCode].home.ring.l2p2}</Text>
            </View>
        </View>
    );
};

export default CaffeineRing;

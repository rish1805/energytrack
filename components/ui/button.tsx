import { Pressable, Text, ViewStyle, StyleProp } from "react-native";
import React from "react";

export const MobileButton = ({
                                 title,
                                 onPress,
                                 icon,
                                 style,
                             }: {
    title: string;
    onPress: () => void;
    icon?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}) => {
    return (
        <Pressable
            onPress={onPress}
            style={[
                {
                    backgroundColor: "#2563eb",
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 9999,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                },
                style,
            ]}
        >
            {icon}
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: icon ? 8 : 0 }}>
                {title}
            </Text>
        </Pressable>
    );
};

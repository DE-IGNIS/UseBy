import React from "react";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import Svg, { Rect, Path, Circle, Line } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DashboardIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1.5" fill={color} />
    <Rect x="14" y="3" width="7" height="7" rx="1.5" fill={color} />
    <Rect x="3" y="14" width="7" height="7" rx="1.5" fill={color} />
    <Rect x="14" y="14" width="7" height="7" rx="1.5" fill={color} />
  </Svg>
);

const InventoryIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 7h14M5 7a2 2 0 01-2-2V4h18v1a2 2 0 01-2 2M5 7v12a2 2 0 002 2h10a2 2 0 002-2V7"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Line
      x1="9"
      y1="12"
      x2="15"
      y2="12"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

const AddIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
    <Line
      x1="12"
      y1="8"
      x2="12"
      y2="16"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Line
      x1="8"
      y1="12"
      x2="16"
      y2="12"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

const SettingsIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} />
    <Path
      d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

const ACTIVE_COLOR = "#4a654f";
const INACTIVE_COLOR = "#737972";

const TabIcon = ({
  focused,
  icon: Icon,
  title,
}: {
  focused: boolean;
  icon: React.ComponentType<{ color: string }>;
  title: string;
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: 44,
        width: 60,
      }}
    >
      <Icon color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
      <Text
        numberOfLines={1}
        style={{
          fontSize: moderateScale(9),
          color: focused ? ACTIVE_COLOR : INACTIVE_COLOR,
          fontWeight: focused ? "600" : "400",
          marginTop: 2,
          letterSpacing: 0.1,
        }}
      >
        {title}
      </Text>
      {focused && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: ACTIVE_COLOR,
          }}
        />
      )}
    </View>
  );
};

const _Layout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 0,
        },
        tabBarStyle: {
          backgroundColor: "#faf9f6",
          borderTopWidth: 1,
          borderTopColor: "#c2c8c0",
          height: moderateScale(52) + insets.bottom,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={DashboardIcon} title="Dashboard" />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={InventoryIcon} title="Inventory" />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={AddIcon} title="Add" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={SettingsIcon} title="Settings" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;

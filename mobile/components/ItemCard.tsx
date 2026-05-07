import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type ItemStatus = "expired" | "expiring" | "warning" | "stable";

type ItemCardProps = {
  id: number;
  name: string;
  quantity: string;
  expiry: string;
  status: ItemStatus;
};

const STATUS_COLORS: Record<ItemStatus, string> = {
  expired: "#6b0000",
  expiring: "#a03e40",
  warning: "#d8962e",
  stable: "#4a654f",
};

const STATUS_LABELS: Record<ItemStatus, string> = {
  expired: "EXPIRED",
  expiring: "Expires today",
  warning: "Expires in 3 days",
  stable: "STABLE",
};

export default function ItemCard({
  name,
  quantity,
  expiry,
  status,
}: ItemCardProps) {
  const isCard =
    status === "expired" || status === "expiring" || status === "warning";
  const accentColor = STATUS_COLORS[status];

  if (isCard) {
    return (
      <View style={[styles.card, { borderLeftColor: accentColor }]}>
        <View style={styles.imagePlaceholder}>
          <MaterialIcons name="inventory" size={24} color="#737972" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{name}</Text>
          <Text style={[styles.cardExpiry, { color: accentColor }]}>
            {STATUS_LABELS[status]}
          </Text>
        </View>
      </View>
    );
  }

  // stable — row layout
  return (
    <View style={styles.row}>
      <View style={styles.rowAccent} />
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{name}</Text>
        <View style={styles.stockBarBg}>
          <View
            style={[
              styles.stockBarFill,
              { backgroundColor: accentColor, width: "75%" },
            ]}
          />
        </View>
      </View>
      <View style={styles.rowMeta}>
        <Text style={styles.rowQty}>Qty: {quantity}</Text>
        <Text style={[styles.rowStatus, { color: accentColor }]}>
          {STATUS_LABELS[status]}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c2c8c0",
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#efeeea",
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    marginLeft: 16,
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1c1a",
  },
  cardExpiry: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  // Row (staples)
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
  },
  rowAccent: {
    width: 8,
    height: 40,
    borderRadius: 9999,
    backgroundColor: "#4a654f33",
    marginRight: 16,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1c1a",
  },
  stockBarBg: {
    marginTop: 4,
    width: 128,
    height: 4,
    backgroundColor: "#efeeea",
    borderRadius: 9999,
    overflow: "hidden",
  },
  stockBarFill: {
    height: "100%",
    borderRadius: 9999,
  },
  rowMeta: {
    alignItems: "flex-end",
    marginRight: 16,
  },
  rowQty: {
    fontSize: 14,
    color: "#424842",
  },
  rowStatus: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 2,
  },
});

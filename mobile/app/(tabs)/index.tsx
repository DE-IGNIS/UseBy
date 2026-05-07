import { ScrollView, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type ItemStatus = "expired" | "expiring" | "warning" | "stable";

type Item = {
  id: number;
  name: string;
  quantity: string;
  expiry: string;
  stockLevel: number; // 0–100
};

// ── Demo Data ──────────────────────────────────────────
const DEMO_ITEMS: Item[] = [
  { id: 1, name: "Whole Milk",    quantity: "1L",   expiry: "07/05/2025", stockLevel: 20 },
  { id: 2, name: "Avocado",       quantity: "3 pcs", expiry: "08/05/2025", stockLevel: 100 },
  { id: 3, name: "Baby Carrots",  quantity: "500g",  expiry: "10/05/2025", stockLevel: 45 },
  { id: 4, name: "Greek Yogurt",  quantity: "500g",  expiry: "20/05/2025", stockLevel: 70 },
  { id: 5, name: "Cheddar Cheese",quantity: "250g",  expiry: "03/05/2025", stockLevel: 10 },
];

// ── Status Logic ───────────────────────────────────────
function getStatus(expiryStr: string): ItemStatus {
  const [day, month, year] = expiryStr.split("/").map(Number);
  const expiry = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0)  return "expired";
  if (daysLeft <= 1) return "expiring";
  if (daysLeft <= 5) return "warning";
  return "stable";
}

function getStatusLabel(status: ItemStatus, expiryStr: string): string {
  const [day, month, year] = expiryStr.split("/").map(Number);
  const expiry = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (status === "expired")  return "Expired";
  if (status === "expiring") return daysLeft === 0 ? "Expiring Today" : "Expiring Tomorrow";
  if (status === "warning")  return `${daysLeft} Days Left`;
  return "Fresh";
}

const STATUS_ACCENT: Record<ItemStatus, string> = {
  expired:  "#a03e40",
  expiring: "#a03e40",
  warning:  "#d8962e",
  stable:   "#4a654f",
};

const STATUS_BADGE_BG: Record<ItemStatus, string> = {
  expired:  "#ffdad6",
  expiring: "#ffdad6",
  warning:  "#ffddb4",
  stable:   "#cceacf",
};

const STATUS_BADGE_TEXT: Record<ItemStatus, string> = {
  expired:  "#93000a",
  expiring: "#771f24",
  warning:  "#513300",
  stable:   "#062010",
};

// ── Sub-components ─────────────────────────────────────
function OverviewCard({
  label, value, accentColor, labelColor, valueColor,
}: {
  label: string; value: string;
  accentColor: string; labelColor: string; valueColor: string;
}) {
  return (
    <View style={styles.overviewCard}>
      <View style={[styles.overviewAccent, { backgroundColor: accentColor }]} />
      <View>
        <Text style={[styles.overviewLabel, { color: labelColor }]}>{label}</Text>
        <Text style={[styles.overviewValue, { color: valueColor }]}>{value}</Text>
      </View>
    </View>
  );
}

function UrgentItemCard({ item }: { item: Item }) {
  const status = getStatus(item.expiry);
  const accent = STATUS_ACCENT[status];
  const stockWidth = `${item.stockLevel}%` as `${number}%`;

  return (
    <View style={[styles.urgentCard, { borderLeftColor: accent }]}>
      {/* Image placeholder */}
      <View style={styles.urgentTop}>
        <View style={styles.urgentImagePlaceholder}>
          <MaterialIcons name="inventory" size={24} color="#737972" />
        </View>
        <View style={styles.urgentNameBlock}>
          <Text style={styles.urgentName}>{item.name}</Text>
          <View style={[styles.badge, { backgroundColor: STATUS_BADGE_BG[status] }]}>
            <Text style={[styles.badgeText, { color: STATUS_BADGE_TEXT[status] }]}>
              {getStatusLabel(status, item.expiry).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Stock bar */}
      <View style={styles.stockSection}>
        <View style={styles.stockLabelRow}>
          <Text style={styles.stockLabel}>Stock Level</Text>
          <Text style={styles.stockLabel}>{item.stockLevel}%</Text>
        </View>
        <View style={styles.stockBarBg}>
          <View style={[styles.stockBarFill, { backgroundColor: accent, width: stockWidth }]} />
        </View>
      </View>
    </View>
  );
}

// ── Main Page ──────────────────────────────────────────
export default function Dashboard() {
  const urgentItems = DEMO_ITEMS.filter((item) => {
    const s = getStatus(item.expiry);
    return s === "expired" || s === "expiring" || s === "warning";
  });

  const expiringSoonCount = DEMO_ITEMS.filter((i) => {
    const s = getStatus(i.expiry);
    return s === "expired" || s === "expiring";
  }).length;

  const thisWeekCount = DEMO_ITEMS.filter((i) => getStatus(i.expiry) === "warning").length;
  const freshCount    = DEMO_ITEMS.filter((i) => getStatus(i.expiry) === "stable").length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pantry</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Overview Section */}
        <Text style={styles.sectionHeading}>Overview</Text>
        <View style={styles.overviewGrid}>
          <OverviewCard
            label="EXPIRING SOON"
            value={`${expiringSoonCount} Items`}
            accentColor="#a03e40"
            labelColor="#80272b"
            valueColor="#a03e40"
          />
          <OverviewCard
            label="THIS WEEK"
            value={`${thisWeekCount} Items`}
            accentColor="#d8962e"
            labelColor="#633f00"
            valueColor="#835500"
          />
          <OverviewCard
            label="FRESH STOCK"
            value={`${freshCount} Items`}
            accentColor="#4a654f"
            labelColor="#334d38"
            valueColor="#4a654f"
          />
        </View>

        {/* Urgent Items Section */}
        <View style={styles.urgentHeader}>
          <Text style={styles.sectionHeading}>Urgent Items</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        {urgentItems.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="check-circle" size={32} color="#4a654f" />
            <Text style={styles.emptyText}>All items are fresh!</Text>
          </View>
        ) : (
          urgentItems.map((item) => (
            <UrgentItemCard key={item.id} item={item} />
          ))
        )}

      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f6",
  },
  header: {
    height: 64,
    backgroundColor: "#faf9f6",
    borderBottomWidth: 1,
    borderBottomColor: "#c2c8c0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1c1a",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },

  // Overview
  sectionHeading: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1c1a",
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  overviewGrid: {
    gap: 12,
    marginBottom: 40,
  },
  overviewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c2c8c0",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  overviewAccent: {
    width: 4,
    height: 48,
    borderRadius: 9999,
  },
  overviewLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  // Urgent Items
  urgentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4a654f",
  },
  urgentCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c2c8c0",
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  urgentTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  urgentImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#efeeea",
    justifyContent: "center",
    alignItems: "center",
  },
  urgentNameBlock: {
    marginLeft: 12,
    gap: 6,
  },
  urgentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1c1a",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  stockSection: {
    gap: 4,
  },
  stockLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stockLabel: {
    fontSize: 14,
    color: "#424842",
  },
  stockBarBg: {
    height: 6,
    backgroundColor: "#e3e2df",
    borderRadius: 9999,
    overflow: "hidden",
  },
  stockBarFill: {
    height: "100%",
    borderRadius: 9999,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#737972",
  },
});
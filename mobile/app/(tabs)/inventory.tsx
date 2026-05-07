import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ItemCard from "../../components/ItemCard";
import data from "../../data/test.json";

type Item = {
  id: number;
  name: string;
  quantity: string;
  expiry: string;
  category: string;
};

type ItemStatus = "expired" | "expiring" | "warning" | "stable";
const CATEGORIES = ["All Items", "Veggies", "Dairy", "Bakery"];

function getStatus(expiryStr: string): ItemStatus {
  const [day, month, year] = expiryStr.split("/").map(Number);
  const expiry = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // strip time

  const daysLeft = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysLeft < 0) return "expired";
  if (daysLeft <= 1) return "expiring"; // today or tomorrow
  if (daysLeft <= 5) return "warning"; // within 5 days
  return "stable";
}

function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Items");

  useEffect(() => {
    setItems(data as Item[]);
  }, []);

  const expiringSoon = items.filter((item) => {
    const status = getStatus(item.expiry);
    return (
      status === "expiring" || status === "warning" || status === "expired"
    );
  });

  const pantryStaples = items.filter((item) => {
    const status = getStatus(item.expiry);
    return status === "stable";
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search inventory..."
            placeholderTextColor="#737972"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Category Pills */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.categoryPill,
                activeCategory === cat
                  ? styles.categoryPillActive
                  : styles.categoryPillInactive,
              ]}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  activeCategory === cat
                    ? styles.categoryPillTextActive
                    : styles.categoryPillTextInactive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView> */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expiring Soon</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{expiringSoon.length} items</Text>
            </View>
          </View>

          <FlatList
            data={expiringSoon}
            renderItem={({ item }) => (
              <ItemCard {...item} status={getStatus(item.expiry)} />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={1}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        </View>

        {/* Pantry Staples Section */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pantry Staples</Text>
            <View style={[styles.badge, styles.badgeNeutral]}>
              <Text style={[styles.badgeText, styles.badgeTextNeutral]}>
                {pantryStaples.length} items
              </Text>
            </View>
          </View> */}

        {/* <View style={styles.staplesList}>
            <FlatList
              data={pantryStaples}
              renderItem={({ item }) => (
                <ItemCard {...item} status={getStatus(item.expiry)} />
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
            />
          </View>
        </View> */}
      </ScrollView>
    </View>
  );
}

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
    paddingTop: 16,
    paddingBottom: 100,
  },
  searchWrapper: {
    marginBottom: 16,
  },
  searchInput: {
    height: 48,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c2c8c0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1a1c1a",
  },
  categoryRow: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  categoryPillActive: {
    backgroundColor: "#4a654f",
  },
  categoryPillInactive: {
    backgroundColor: "#4a654f1a",
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryPillTextActive: {
    color: "#ffffff",
  },
  categoryPillTextInactive: {
    color: "#4a654f",
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1c1a",
    letterSpacing: -0.2,
  },
  badge: {
    backgroundColor: "#ff88881a",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#a03e40",
  },
  badgeNeutral: {
    backgroundColor: "#efeeea",
  },
  badgeTextNeutral: {
    color: "#737972",
  },
  staplesList: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c2c8c0",
    borderRadius: 12,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: "#c2c8c0",
  },
});

export default Inventory;

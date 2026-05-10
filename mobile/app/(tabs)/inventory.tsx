import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import ItemCard from "../../components/ItemCard";
import data from "../../data/test.json";

type Item = {
  id: number;
  name: string;
  quantity: string;
  expiry: string;
};

type ItemStatus = "expired" | "expiring" | "warning" | "stable";

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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fresh Stock</Text>
            <View style={[styles.badge, styles.badgeNeutral]}>
              <Text style={[styles.badgeText, styles.badgeTextNeutral]}>
                {pantryStaples.length} items
              </Text>
            </View>
          </View>

          <View style={styles.staplesList}>
            {pantryStaples.map((item, index) => (
              <View key={item.id}>
                <View style={[styles.card, { borderLeftColor: "#4a654f" }]}>
                  <View style={styles.imagePlaceholder}>
                    <MaterialIcons name="inventory" size={24} color="#737972" />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={[styles.cardExpiry, { color: "#4a654f" }]}>
                      STABLE
                    </Text>
                  </View>
                </View>
                {index < pantryStaples.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        </View>
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
  // categoryRow: {
  //   gap: 8,
  //   paddingBottom: 4,
  //   marginBottom: 16,
  // },
  // categoryPill: {
  //   paddingHorizontal: 16,
  //   paddingVertical: 8,
  //   borderRadius: 9999,
  // },
  // categoryPillActive: {
  //   backgroundColor: "#4a654f",
  // },
  // categoryPillInactive: {
  //   backgroundColor: "#4a654f1a",
  // },
  // categoryPillText: {
  //   fontSize: 14,
  //   fontWeight: "500",
  // },
  // categoryPillTextActive: {
  //   color: "#ffffff",
  // },
  // categoryPillTextInactive: {
  //   color: "#4a654f",
  // },
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
});

export default Inventory;

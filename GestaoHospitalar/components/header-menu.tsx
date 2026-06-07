import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HeaderMenuProps {
  showAvatar?: boolean;
}

export default function HeaderMenu({ showAvatar = false }: HeaderMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleNavigate = (route: string) => {
    setMenuVisible(false);
    router.navigate(route as any);
  };

  return (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={32} color="#0D52BD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MedCore Admin</Text>
        </View>
        {showAvatar && (
          <View style={styles.avatar}>
            <Ionicons name="person-circle-outline" size={36} color="#0D52BD" />
          </View>
        )}
      </View>

      {/* ─── MENU LATERAL ─── */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {/* Header do Menu */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuHeaderTitle}>MedCore</Text>
              <Text style={styles.menuHeaderSub}>Gestão Hospitalar</Text>
            </View>

            {/* Itens do Menu */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("/(tabs)/")}
            >
              <MaterialCommunityIcons name="view-dashboard-outline" size={24} color="#0D52BD" />
              <Text style={styles.menuItemText}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("/(tabs)/doctors")}
            >
              <MaterialCommunityIcons name="doctor" size={24} color="#0D52BD" />
              <Text style={styles.menuItemText}>Médicos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("/(tabs)/patients")}
            >
              <MaterialCommunityIcons name="account-group-outline" size={24} color="#0D52BD" />
              <Text style={styles.menuItemText}>Pacientes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("/(tabs)/calendar")}
            >
              <MaterialCommunityIcons name="calendar-clock" size={24} color="#0D52BD" />
              <Text style={styles.menuItemText}>Agendamentos</Text>
            </TouchableOpacity>

            {/* Separador */}
            <View style={styles.menuDivider} />

            {/* Fechar */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="close" size={24} color="#999" />
              <Text style={[styles.menuItemText, { color: "#999" }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F8F9FB",
    marginTop: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#0D52BD", marginLeft: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  // Menu lateral
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    flexDirection: "row",
  },
  menuContainer: {
    width: "75%",
    backgroundColor: "#FFF",
    paddingTop: 60,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  menuHeader: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    marginBottom: 10,
  },
  menuHeaderTitle: { fontSize: 24, fontWeight: "bold", color: "#0D52BD" },
  menuHeaderSub: { fontSize: 14, color: "#666", marginTop: 4 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuItemText: { fontSize: 16, fontWeight: "600", color: "#1A1A1A", marginLeft: 16 },
  menuDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 10,
    marginHorizontal: 24,
  },
});

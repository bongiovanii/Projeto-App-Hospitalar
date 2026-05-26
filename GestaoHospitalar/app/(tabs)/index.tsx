import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DashboardScreen() {
  const appointments = [
    {
      id: 1,
      name: "Ricardo Albuquerque",
      time: "09:30",
      specialty: "Cardiologia",
      status: "CONFIRMADO",
      statusColor: "#E8F5E9",
      statusText: "#2E7D32",
      date: "24",
    },
    {
      id: 2,
      name: "Maria Oliveira Santos",
      time: "10:15",
      specialty: "Pediatria",
      status: "EM ESPERA",
      statusColor: "#E0F7FA",
      statusText: "#006064",
      date: "24",
    },
    {
      id: 3,
      name: "Joaquim Ferreira",
      time: "11:00",
      specialty: "Ortopedia",
      status: "ATRASADO",
      statusColor: "#FFEBEE",
      statusText: "#C62828",
      date: "24",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <Ionicons name="menu" size={32} color="#0D52BD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MedCore Admin</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={{ marginRight: 15 }}>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.avatar}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateSection}>
          <Text style={styles.pageTitle}>Resumo do Dia</Text>
          <Text style={styles.pageSubtitle}>Terça-feira, 24 de Outubro</Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.mainCardHeader}>
            <Text style={styles.mainCardTitle}>CONSULTAS HOJE</Text>
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={24}
              color="#0D52BD"
            />
          </View>
          <Text style={styles.mainCardValue}>24</Text>
          <Text style={styles.mainCardTrend}>↗ +12% vs ontem</Text>
        </View>

        <View style={styles.rowCards}>
          <View style={[styles.smallCard, { borderLeftColor: "#4CAF50" }]}>
            <View style={styles.smallCardHeader}>
              <Text style={styles.smallCardTitle}>NOVOS</Text>
              <MaterialCommunityIcons
                name="account-plus-outline"
                size={20}
                color="#4CAF50"
              />
            </View>
            <Text style={styles.smallCardValue}>08</Text>
            <Text style={styles.smallCardSubtitle}>Pacientes</Text>
          </View>

          <View style={[styles.smallCard, { borderLeftColor: "#00BCD4" }]}>
            <View style={styles.smallCardHeader}>
              <Text style={styles.smallCardTitle}>PLANTÃO</Text>
              <MaterialCommunityIcons
                name="medical-bag"
                size={20}
                color="#00BCD4"
              />
            </View>
            <Text style={styles.smallCardValue}>15</Text>
            <Text style={styles.smallCardSubtitle}>Ativos</Text>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Próximos atendimentos</Text>
          <TouchableOpacity>
            <Text style={styles.listLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {appointments.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeMonth}>OUT</Text>
              <Text style={styles.dateBadgeDay}>{item.date}</Text>
            </View>
            <View style={styles.listInfo}>
              <Text style={styles.listName}>{item.name}</Text>
              <Text style={styles.listDetails}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={12}
                  color="#666"
                />{" "}
                {item.time} • {item.specialty}
              </Text>
            </View>
            <View style={styles.listAction}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: item.statusColor },
                ]}
              >
                <Text style={[styles.statusText, { color: item.statusText }]}>
                  {item.status}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#999"
                style={{ marginTop: 8 }}
              />
            </View>
          </View>
        ))}

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Informativo Geral</Text>
          <Text style={styles.bannerText}>
            A ala norte passará por manutenção preventiva hoje às 22h. Favor
            redirecionar triagem.
          </Text>
          <TouchableOpacity style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Saber mais</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bannerPlusBtn}>
            <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F8F9FB",
    marginTop: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D52BD",
    marginLeft: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  dateSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  mainCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 6,
    borderLeftColor: "#0D52BD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 15,
  },
  mainCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    letterSpacing: 1,
  },
  mainCardValue: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#0D52BD",
    marginTop: 10,
  },
  mainCardTrend: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
    marginTop: 5,
  },
  rowCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  smallCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    width: "48%",
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  smallCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    letterSpacing: 0.5,
  },
  smallCardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 10,
  },
  smallCardSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  listLink: {
    fontSize: 14,
    color: "#0D52BD",
    fontWeight: "600",
  },
  listItem: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  dateBadge: {
    backgroundColor: "#F0F4F8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    width: 50,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  dateBadgeMonth: {
    fontSize: 10,
    color: "#0D52BD",
    fontWeight: "bold",
  },
  dateBadgeDay: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  listDetails: {
    fontSize: 13,
    color: "#666",
  },
  listAction: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  banner: {
    backgroundColor: "#0D47A1",
    borderRadius: 16,
    padding: 20,
    marginTop: 15,
    position: "relative",
    overflow: "hidden",
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  bannerText: {
    fontSize: 14,
    color: "#E3F2FD",
    lineHeight: 20,
    marginBottom: 20,
    width: "80%",
  },
  bannerBtn: {
    backgroundColor: "#BBDEFB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  bannerBtnText: {
    color: "#0D47A1",
    fontWeight: "bold",
  },
  bannerPlusBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

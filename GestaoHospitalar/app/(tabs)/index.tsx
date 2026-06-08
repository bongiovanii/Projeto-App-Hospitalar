import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HeaderMenu from "../../components/header-menu";
import { agendamentoService, RelatorioDia } from "../../services/agendamentoService";

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  concluido: { bg: "#E8F5E9", text: "#1B5E20", label: "FINALIZADO" },
  em_espera: { bg: "#E0F7FA", text: "#006064", label: "EM ESPERA" },
  atrasado: { bg: "#FFEBEE", text: "#C62828", label: "ATRASADO" },
  cancelado: { bg: "#F3E5F5", text: "#6A1B9A", label: "CANCELADO" },
  confirmado: { bg: "#E8F5E9", text: "#2E7D32", label: "CONFIRMADO" },
};

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const DIAS_SEMANA = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DashboardScreen() {
  const [relatorio, setRelatorio] = useState<RelatorioDia | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const diaSemana = DIAS_SEMANA[today.getDay()];
  const dia = today.getDate();
  const mesExtenso = today.toLocaleDateString("pt-BR", { month: "long" });
  const dataFormatada = `${diaSemana}, ${dia} de ${mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1)}`;
  const todayStr = getLocalDateString();

  const fetchRelatorio = async () => {
    try {
      setLoading(true);
      const data = await agendamentoService.relatorioDia(todayStr);
      setRelatorio(data);
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
      setRelatorio(null);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchRelatorio();
    }, [])
  );

  const totalHoje = relatorio?.totalConsultas ?? 0;
  const finalizados = relatorio?.finalizados ?? 0;
  const emEspera = relatorio?.emEspera ?? 0;
  const agendamentos = relatorio?.agendamentos ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <HeaderMenu showAvatar={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.dateSection}>
          <Text style={styles.pageTitle}>Resumo do Dia</Text>
          <Text style={styles.pageSubtitle}>{dataFormatada}</Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.mainCardHeader}>
            <Text style={styles.mainCardTitle}>CONSULTAS HOJE</Text>
            <MaterialCommunityIcons name="calendar-blank-outline" size={24} color="#0D52BD" />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#0D52BD" style={{ marginTop: 15 }} />
          ) : (
            <Text style={styles.mainCardValue}>{totalHoje}</Text>
          )}
        </View>

        <View style={styles.rowCards}>
          <View style={[styles.smallCard, { borderLeftColor: "#4CAF50" }]}>
            <View style={styles.smallCardHeader}>
              <Text style={styles.smallCardTitle}>FINALIZADOS</Text>
              <MaterialCommunityIcons name="check-circle-outline" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.smallCardValue}>
              {finalizados.toString().padStart(2, "0")}
            </Text>
            <Text style={styles.smallCardSubtitle}>Consultas</Text>
          </View>

          <View style={[styles.smallCard, { borderLeftColor: "#00BCD4" }]}>
            <View style={styles.smallCardHeader}>
              <Text style={styles.smallCardTitle}>EM ESPERA</Text>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#00BCD4" />
            </View>
            <Text style={styles.smallCardValue}>
              {emEspera.toString().padStart(2, "0")}
            </Text>
            <Text style={styles.smallCardSubtitle}>Consultas</Text>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Atendimentos de hoje</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color="#0D52BD" />
        ) : agendamentos.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="calendar-blank" size={48} color="#CCC" />
            <Text style={styles.emptyText}>Nenhum agendamento para hoje</Text>
          </View>
        ) : (
          agendamentos.map((item) => {
            const statusInfo = STATUS_COLORS[item.status || "em_espera"] || STATUS_COLORS.em_espera;
            const parts = todayStr.split("-");
            const appointmentDay = parseInt(parts[2], 10).toString();
            const appointmentMonth = MESES[parseInt(parts[1], 10) - 1];

            return (
              <View key={item.id} style={styles.listItem}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeMonth}>{appointmentMonth}</Text>
                  <Text style={styles.dateBadgeDay}>{appointmentDay}</Text>
                </View>
                <View style={styles.listInfo}>
                  <Text style={styles.listName}>{item.paciente_nome || "Paciente"}</Text>
                  <Text style={styles.listDetails}>{item.horario} • {item.medico_especialidade || item.tipo}</Text>
                </View>
                <View style={styles.listAction}>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.statusText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  dateSection: { marginBottom: 20 },
  pageTitle: { fontSize: 24, fontWeight: "bold", color: "#1A1A1A" },
  pageSubtitle: { fontSize: 16, color: "#666", marginTop: 4 },
  mainCard: { backgroundColor: "#FFF", borderRadius: 16, padding: 20, borderLeftWidth: 6, borderLeftColor: "#0D52BD", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, marginBottom: 15 },
  mainCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  mainCardTitle: { fontSize: 12, fontWeight: "600", color: "#555", letterSpacing: 1 },
  mainCardValue: { fontSize: 42, fontWeight: "bold", color: "#0D52BD", marginTop: 10 },
  rowCards: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  smallCard: { backgroundColor: "#FFF", borderRadius: 16, padding: 15, width: "48%", borderLeftWidth: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  smallCardHeader: { flexDirection: "row", justifyContent: "space-between" },
  smallCardTitle: { fontSize: 12, fontWeight: "600", color: "#555", letterSpacing: 0.5 },
  smallCardValue: { fontSize: 24, fontWeight: "bold", color: "#1A1A1A", marginTop: 10 },
  smallCardSubtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  listTitle: { fontSize: 20, fontWeight: "bold", color: "#1A1A1A" },
  listItem: { backgroundColor: "#FFF", borderRadius: 16, padding: 15, flexDirection: "row", alignItems: "center", marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  dateBadge: { backgroundColor: "#F0F4F8", borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", width: 50, height: 55, justifyContent: "center", alignItems: "center", marginRight: 15 },
  dateBadgeMonth: { fontSize: 10, color: "#0D52BD", fontWeight: "bold" },
  dateBadgeDay: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  listInfo: { flex: 1 },
  listName: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A", marginBottom: 4 },
  listDetails: { fontSize: 13, color: "#666" },
  listAction: { alignItems: "flex-end" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: "bold" },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyText: { marginTop: 10, fontSize: 14, color: "#999" },
});

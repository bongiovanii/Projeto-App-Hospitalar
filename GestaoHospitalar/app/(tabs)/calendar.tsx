import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Mock de dados para a tabela
const APPOINTMENTS_TABLE = [
  {
    id: "1",
    time: "10:00",
    patient: "João Pereira",
    patientId: "#3321",
    doctor: "Dr. Ana Paula",
    specialty: "Ped.",
  },
  {
    id: "2",
    time: "10:45",
    patient: "Roberto Justos",
    patientId: "#9901",
    doctor: "Dr. Carlos Mendes",
    specialty: "Card.",
  },
  {
    id: "3",
    time: "11:30",
    patient: "Luciana Gimenez",
    patientId: "#1022",
    doctor: "Dra. Juliana Lima",
    specialty: "Der.",
  },
];

export default function CalendarScreen() {
  const [dateFilter, setDateFilter] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER FIXO */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <Ionicons name="menu" size={32} color="#0D52BD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MedCore Admin</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#0D52BD" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* TÍTULO DA SEÇÃO */}
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Agendamentos</Text>
          <Text style={styles.subtitle}>
            Gerencie e visualize a escala de consultas médicas.
          </Text>
        </View>

        {/* BOTÃO NOVO AGENDAMENTO */}
        <TouchableOpacity style={styles.newAppointmentBtn}>
          {/* CORRIGIDO: De "plus" para "add" */}
          <Ionicons name="add" size={24} color="#FFF" />
          <Text style={styles.newAppointmentText}>Novo Agendamento</Text>
        </TouchableOpacity>

        {/* FILTROS */}
        <View style={styles.filterContainer}>
          <View style={styles.filterField}>
            <Text style={styles.filterLabel}>FILTRAR POR DATA</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.filterInput}
                placeholder="mm/dd/yyyy"
                value={dateFilter}
                onChangeText={setDateFilter}
              />
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </View>
          </View>

          <View style={styles.filterRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.filterLabel}>ESPECIALIDADE</Text>
              <View style={styles.pickerFake}>
                <Text style={{ color: "#333" }}>Todas as Especialidades</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </View>
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <MaterialCommunityIcons
                name="filter-variant"
                size={20}
                color="#333"
              />
              <Text style={styles.filterBtnText}>Filtrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD DE CONSULTA EM DESTAQUE (09:30) */}
        <View style={styles.featuredCard}>
          <View style={styles.cardHeader}>
            <View style={styles.timeBadge}>
              <Text style={styles.timeLabel}>HOJE</Text>
              <Text style={styles.timeValue}>09:30</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>CONFIRMADO</Text>
            </View>
            <TouchableOpacity style={styles.moreOptions}>
              <Ionicons name="ellipsis-vertical" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.appointmentType}>Consulta de Rotina</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="doctor" size={24} color="#0D52BD" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Dr. Carlos Mendes</Text>
              <Text style={styles.infoSub}>Cardiologia</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: 15 }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="person" size={24} color="#0D52BD" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Mariana Silva</Text>
              <Text style={styles.infoSub}>Prontuário: #4582</Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.btnOutline}>
              <Text style={styles.btnOutlineText}>Ver Prontuário</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline}>
              <Text style={styles.btnOutlineText}>Reagendar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PRÓXIMO VAGO NOTIFICATION */}
        <View style={styles.nextAvailableBar}>
          <View>
            <Text style={styles.nextLabel}>PRÓXIMO VAGO</Text>
            <Text style={styles.nextTime}>11:15</Text>
          </View>
          <Text style={styles.nextAvailableText}>
            Disponível para Dr. Carlos
          </Text>
        </View>

        {/* TABELA DE CONSULTAS DO DIA */}
        <View style={styles.tableSection}>
          <View style={styles.tableHeaderInfo}>
            <View>
              <Text style={styles.tableHeaderLabel}>HOJE</Text>
              <Text style={styles.tableHeaderCount}>18 Consultas</Text>
            </View>
            <TouchableOpacity style={styles.calendarIconBtn}>
              <Ionicons name="calendar-outline" size={32} color="#0D52BD" />
            </TouchableOpacity>
          </View>

          {/* CABEÇALHO DA TABELA */}
          <View style={styles.tableRowHeader}>
            <Text style={[styles.columnHeader, { width: 60 }]}>HORÁRIO</Text>
            <Text style={[styles.columnHeader, { flex: 1 }]}>PACIENTE</Text>
            <Text style={[styles.columnHeader, { flex: 1 }]}>MÉDICO</Text>
            <Text style={[styles.columnHeader, { width: 40 }]}>ESP</Text>
          </View>

          {/* LINHAS DA TABELA */}
          {APPOINTMENTS_TABLE.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.timeCell, { width: 60 }]}>{item.time}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.mainCellText}>{item.patient}</Text>
                <Text style={styles.subCellText}>Pront: {item.patientId}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mainCellText}>{item.doctor}</Text>
                <Text style={styles.subCellText}>{item.specialty}</Text>
              </View>
              <Text style={[styles.subCellText, { width: 40 }]}>
                {item.specialty}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FAB - Botão Flutuante */}
      <TouchableOpacity style={styles.fab}>
        {/* CORRIGIDO: De "plus" para "add" */}
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F8F9FB",
    marginTop: 30,
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
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  newAppointmentBtn: {
    backgroundColor: "#0D52BD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    height: 50,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
  },
  newAppointmentText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  /* CORRIGIDO: Adicionada a classe filterField */
  filterField: {
    marginBottom: 0,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
  },
  filterInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 15,
  },
  pickerFake: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2E8F0",
    height: 45,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  filterBtnText: {
    fontWeight: "bold",
    marginLeft: 5,
    color: "#333",
  },
  featuredCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderLeftWidth: 6,
    borderLeftColor: "#0D52BD",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeBadge: {
    backgroundColor: "#0D52BD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 15,
  },
  timeLabel: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  timeValue: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusBadge: {
    backgroundColor: "#69F0AE", // Verde clarinho igual ao template
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#00796B",
    fontSize: 11,
    fontWeight: "bold",
  },
  moreOptions: {
    marginLeft: "auto",
  },
  appointmentType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  infoSub: {
    fontSize: 13,
    color: "#0D52BD",
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 15,
  },
  btnOutline: {
    flex: 0.48,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  btnOutlineText: {
    color: "#0D52BD",
    fontWeight: "bold",
    fontSize: 15,
  },
  nextAvailableBar: {
    backgroundColor: "#0D52BD", // Ajustado para o azul escuro padrão
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  nextLabel: {
    color: "#A0C4FF",
    fontSize: 10,
    fontWeight: "bold",
  },
  nextTime: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  nextAvailableText: {
    color: "#FFF",
    marginLeft: 20,
    fontSize: 14,
    opacity: 0.9,
  },
  tableSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  tableHeaderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#E2E8F0",
    padding: 15,
    borderRadius: 12,
  },
  tableHeaderLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
  tableHeaderCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  calendarIconBtn: {
    padding: 5,
  },
  tableRowHeader: {
    flexDirection: "row",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  timeCell: {
    fontSize: 14,
    color: "#333",
  },
  mainCellText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  subCellText: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#0D52BD",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#0D52BD",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});

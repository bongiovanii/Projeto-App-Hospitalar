import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderMenu from "../../components/header-menu";
import { agendamentoService, Agendamento } from "../../services/agendamentoService";
import { medicoService, Medico } from "../../services/medicoService";
import { pacienteService, Paciente } from "../../services/pacienteService";

// Retorna data local YYYY-MM-DD
function getLocalDateString(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Formata YYYY-MM-DD para exibição legível
function formatDateLabel(dateStr: string): string {
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return `${diasSemana[d.getDay()]}, ${day} de ${meses[d.getMonth()]} ${year}`;
}

// Gera lista de horários
function gerarHorarios(): string[] {
  const horarios: string[] = [];
  for (let h = 7; h <= 19; h++) {
    horarios.push(`${h.toString().padStart(2, "0")}:00`);
    if (h < 19) horarios.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return horarios;
}

// Gera lista de datas (hoje + próximos 30 dias)
function gerarDatas(): { label: string; value: string }[] {
  const datas: { label: string; value: string }[] = [];
  const baseDate = new Date();
  baseDate.setHours(12, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const d = new Date(baseDate.getTime());
    d.setDate(baseDate.getDate() + i);
    const value = getLocalDateString(d);
    const label = formatDateLabel(value);
    datas.push({ label, value });
  }
  return datas;
}

const HORARIOS = gerarHorarios();
const DATAS = gerarDatas();

type PickerType = "medico" | "paciente" | "data" | "horario" | "filterDate" | null;

export default function CalendarScreen() {
  const [filterDate, setFilterDate] = useState<string>("future"); // "future" = hoje+futuro, "historico" = passados, "YYYY-MM-DD" = data específica
  const [filterDateLabel, setFilterDateLabel] = useState<string>("Hoje e futuros");
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [selectedData, setSelectedData] = useState("");
  const [selectedDataLabel, setSelectedDataLabel] = useState("");
  const [selectedHorario, setSelectedHorario] = useState("");
  const [tipo, setTipo] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [activePicker, setActivePicker] = useState<PickerType>(null);

  const todayStr = useMemo(() => getLocalDateString(), []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const listaMedicos = await medicoService.listarTodos();
      setMedicos(listaMedicos);
    } catch (e) { setMedicos([]); }
    try {
      const listaPacientes = await pacienteService.listarTodos();
      setPacientes(listaPacientes);
    } catch (e) { setPacientes([]); }
    try {
      const agendamentos = await agendamentoService.listarTodos();
      setAppointments(agendamentos);
    } catch (e) { setAppointments([]); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Recarrega médicos e pacientes sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      const refreshLists = async () => {
        try {
          const [listaMedicos, listaPacientes] = await Promise.all([
            medicoService.listarTodos(),
            pacienteService.listarTodos(),
          ]);
          setMedicos(listaMedicos);
          setPacientes(listaPacientes);
        } catch (e) {}
        try {
          const agendamentos = await agendamentoService.listarTodos();
          setAppointments(agendamentos);
        } catch (e) {}
      };
      refreshLists();
    }, [])
  );

  const resetForm = () => {
    setSelectedPaciente(null);
    setSelectedMedico(null);
    setSelectedData("");
    setSelectedDataLabel("");
    setSelectedHorario("");
    setTipo("");
    setObservacoes("");
    setActivePicker(null);
  };

  const handleOpenCreateModal = () => { resetForm(); setModalVisible(true); };

  const handleSaveAppointment = async () => {
    if (!selectedPaciente || !selectedMedico || !selectedData || !selectedHorario) {
      Alert.alert("Atenção", "Selecione Paciente, Médico, Data e Horário.");
      return;
    }

    // Validação: não permitir datas anteriores
    if (selectedData < todayStr) {
      Alert.alert("Atenção", "Não é possível agendar para uma data passada.");
      return;
    }

    // Validação: se é hoje, não permitir horário anterior ao atual
    if (selectedData === todayStr) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      if (selectedHorario <= currentTime) {
        Alert.alert("Atenção", "Não é possível agendar para um horário que já passou hoje.");
        return;
      }
    }

    try {
      const created = await agendamentoService.criar({
        pacienteId: selectedPaciente.id,
        medicoId: selectedMedico.id,
        data: selectedData,
        horario: selectedHorario,
        tipo: tipo || "Consulta",
        observacoes: observacoes || undefined,
      });
      setAppointments((prev) => [created, ...prev]);
      Alert.alert("Sucesso", "Agendamento criado com sucesso!");
      resetForm();
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o agendamento.");
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Confirmar", "Deseja excluir este agendamento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir", style: "destructive",
        onPress: async () => {
          try {
            await agendamentoService.deletar(id);
            setAppointments((prev) => prev.filter((a) => a.id !== id));
          } catch (e) { Alert.alert("Erro", "Não foi possível excluir."); }
        },
      },
    ]);
  };

  const handleFinalize = (id: number) => {
    Alert.alert("Finalizar", "Deseja marcar esta consulta como finalizada?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Finalizar",
        onPress: async () => {
          try {
            const updated = await agendamentoService.atualizar(id, { status: "concluido" });
            setAppointments((prev) =>
              prev.map((a) => a.id === id ? { ...a, status: "concluido" } : a)
            );
            Alert.alert("Sucesso", "Consulta finalizada!");
          } catch (e) {
            Alert.alert("Erro", "Não foi possível atualizar o status.");
          }
        },
      },
    ]);
  };

  // Filtra agendamentos
  const filteredAppointments = useMemo(() => {
    if (filterDate === "future") {
      // Hoje + futuro, ordenado por data/horário
      return appointments
        .filter((a) => a.data >= todayStr)
        .sort((a, b) => a.data === b.data ? (a.horario || "").localeCompare(b.horario || "") : a.data.localeCompare(b.data));
    }
    if (filterDate === "historico") {
      // Apenas passados, mais recente primeiro
      return appointments
        .filter((a) => a.data < todayStr)
        .sort((a, b) => b.data.localeCompare(a.data) || (b.horario || "").localeCompare(a.horario || ""));
    }
    // Data específica
    return appointments.filter((a) => a.data === filterDate);
  }, [appointments, filterDate, todayStr]);

  // Agendamentos de HOJE (para o card destaque)
  const todayAppointments = appointments.filter((a) => a.data === todayStr);
  const nextToday = todayAppointments.length > 0 ? todayAppointments[0] : null;

  // Datas para o filtro
  const filterDatesOptions = useMemo(() => {
    return [
      { label: "Hoje e futuros", value: "future" },
      { label: `Hoje — ${formatDateLabel(todayStr)}`, value: todayStr },
      { label: "📋 Histórico (datas passadas)", value: "historico" },
      ...DATAS.slice(1).map((d) => ({ label: d.label, value: d.value })),
    ];
  }, [todayStr]);

  // ─── Picker data ──────────────────────────────────────────────
  const getPickerData = () => {
    switch (activePicker) {
      case "medico":
        return { title: "Selecionar Médico", items: medicos.map((m) => ({ id: String(m.id), label: m.nome || "Sem nome", sub: `${m.especialidade || "—"} • CRM ${m.crm || "—"}` })) };
      case "paciente":
        return { title: "Selecionar Paciente", items: pacientes.map((p) => ({ id: String(p.id), label: p.nome || "Sem nome", sub: `${p.condicao || "—"} • ${p.telefone || "—"}` })) };
      case "data":
        return { title: "Selecionar Data", items: DATAS.map((d) => ({ id: d.value, label: d.label, sub: d.value })) };
      case "horario":
        return { title: "Selecionar Horário", items: HORARIOS.map((h) => ({ id: h, label: h })) };
      case "filterDate":
        return { title: "Filtrar por Data", items: filterDatesOptions.map((d) => ({ id: d.value, label: d.label, sub: d.value || undefined })) };
      default:
        return { title: "", items: [] };
    }
  };

  const handlePickerSelect = (item: { id: string; label: string; sub?: string }) => {
    switch (activePicker) {
      case "medico":
        setSelectedMedico(medicos.find((m) => String(m.id) === item.id) || null);
        break;
      case "paciente":
        setSelectedPaciente(pacientes.find((p) => String(p.id) === item.id) || null);
        break;
      case "data":
        setSelectedData(item.id);
        setSelectedDataLabel(item.label);
        break;
      case "horario":
        setSelectedHorario(item.id);
        break;
      case "filterDate":
        setFilterDate(item.id);
        setFilterDateLabel(item.label);
        break;
    }
    setActivePicker(null);
  };

  // ─── Modal content ─────────────────────────────────────────────
  const renderModalContent = () => {
    if (activePicker) {
      const { title, items } = getPickerData();
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.modalTopBar}>
            <TouchableOpacity onPress={() => setActivePicker(null)}>
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTopTitle}>{title}</Text>
            <View style={{ width: 28 }} />
          </View>
          {items.length === 0 ? (
            <View style={styles.pickerEmpty}>
              <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#CCC" />
              <Text style={{ color: "#999", fontSize: 16, marginTop: 10 }}>Nenhum registro encontrado.</Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id || "all"}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.pickerItem} onPress={() => handlePickerSelect(item)} activeOpacity={0.6}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pickerItemLabel}>{item.label}</Text>
                    {item.sub ? <Text style={styles.pickerItemSub}>{item.sub}</Text> : null}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#CCC" />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      );
    }

    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.modalTopBar}>
          <TouchableOpacity onPress={() => { resetForm(); setModalVisible(false); }}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTopTitle}>Novo Agendamento</Text>
          <View style={{ width: 28 }} />
        </View>
        <ScrollView contentContainerStyle={styles.modalFormContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.labelInput}>Paciente *</Text>
          <TouchableOpacity style={styles.selectorBtn} onPress={() => setActivePicker("paciente")}>
            <MaterialCommunityIcons name="account" size={22} color="#0D52BD" />
            <Text style={[styles.selectorText, !selectedPaciente && { color: "#999" }]}>{selectedPaciente ? selectedPaciente.nome : "Toque para selecionar"}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={styles.labelInput}>Médico *</Text>
          <TouchableOpacity style={styles.selectorBtn} onPress={() => setActivePicker("medico")}>
            <MaterialCommunityIcons name="doctor" size={22} color="#0D52BD" />
            <Text style={[styles.selectorText, !selectedMedico && { color: "#999" }]}>{selectedMedico ? `${selectedMedico.nome} — ${selectedMedico.especialidade}` : "Toque para selecionar"}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={styles.labelInput}>Data *</Text>
          <TouchableOpacity style={styles.selectorBtn} onPress={() => setActivePicker("data")}>
            <MaterialCommunityIcons name="calendar" size={22} color="#0D52BD" />
            <Text style={[styles.selectorText, !selectedData && { color: "#999" }]}>{selectedData ? `${selectedDataLabel}` : "Toque para selecionar"}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={styles.labelInput}>Horário *</Text>
          <TouchableOpacity style={styles.selectorBtn} onPress={() => setActivePicker("horario")}>
            <MaterialCommunityIcons name="clock-outline" size={22} color="#0D52BD" />
            <Text style={[styles.selectorText, !selectedHorario && { color: "#999" }]}>{selectedHorario || "Toque para selecionar"}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={styles.labelInput}>Tipo da Consulta</Text>
          <TextInput style={styles.input} placeholder="Ex: Consulta de Rotina" value={tipo} onChangeText={setTipo} autoCapitalize="sentences" />

          <Text style={styles.labelInput}>Observações</Text>
          <TextInput style={[styles.input, { height: 100, textAlignVertical: "top", paddingTop: 14 }]} placeholder="Notas adicionais..." value={observacoes} onChangeText={setObservacoes} multiline autoCapitalize="sentences" />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveAppointment}>
            <Text style={styles.saveButtonText}>Salvar Agendamento</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderMenu />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Agendamentos</Text>
          <Text style={styles.subtitle}>Gerencie e visualize a escala de consultas médicas.</Text>
        </View>

        {/* BOTÃO NOVO */}
        <TouchableOpacity style={styles.newAppointmentBtn} onPress={handleOpenCreateModal}>
          <Ionicons name="add" size={24} color="#FFF" />
          <Text style={styles.newAppointmentText}>Novo Agendamento</Text>
        </TouchableOpacity>

        {/* FILTRO POR DATA (seletor) */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>FILTRAR POR DATA</Text>
          <TouchableOpacity style={styles.filterSelector} onPress={() => setActivePicker("filterDate")}>
            <Ionicons name="calendar-outline" size={20} color="#0D52BD" />
            <Text style={[styles.filterSelectorText]}>
              {filterDateLabel}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          {filterDate !== "future" ? (
            <TouchableOpacity onPress={() => { setFilterDate("future"); setFilterDateLabel("Hoje e futuros"); }} style={styles.clearFilterBtn}>
              <Text style={styles.clearFilterText}>Voltar para Hoje e futuros</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0D52BD" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <>
            {/* CARD DESTAQUE — só mostra se tem consulta HOJE */}
            {nextToday && (
              <View style={styles.featuredCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeLabel}>HOJE</Text>
                    <Text style={styles.timeValue}>{nextToday.horario}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {(nextToday.status || "em_espera").toUpperCase().replace("_", " ")}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.moreOptions} onPress={() => handleDelete(nextToday.id)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.appointmentType}>{nextToday.tipo || "Consulta"}</Text>
                <View style={styles.infoRow}>
                  <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="doctor" size={24} color="#0D52BD" />
                  </View>
                  <View>
                    <Text style={styles.infoTitle}>{nextToday.medico?.nome || "—"}</Text>
                    <Text style={styles.infoSub}>{nextToday.medico?.especialidade || "—"}</Text>
                  </View>
                </View>
                <View style={[styles.infoRow, { marginTop: 15 }]}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="person" size={24} color="#0D52BD" />
                  </View>
                  <View>
                    <Text style={styles.infoTitle}>{nextToday.paciente?.nome || "—"}</Text>
                    <Text style={styles.infoSub}>ID: {nextToday.paciente?.id ?? "—"}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* TABELA */}
            <View style={styles.tableSection}>
              <View style={styles.tableHeaderInfo}>
                <View>
                  <Text style={styles.tableHeaderLabel}>
                    {filterDate === "future" ? "HOJE E FUTUROS" : filterDate === "historico" ? "HISTÓRICO" : formatDateLabel(filterDate)}
                  </Text>
                  <Text style={styles.tableHeaderCount}>{filteredAppointments.length} Consultas</Text>
                </View>
                <Ionicons name="calendar-outline" size={32} color="#0D52BD" />
              </View>

              <View style={styles.tableRowHeader}>
                <Text style={[styles.columnHeader, { width: 55 }]}>HORA</Text>
                <Text style={[styles.columnHeader, { flex: 1 }]}>PACIENTE</Text>
                <Text style={[styles.columnHeader, { flex: 1 }]}>MÉDICO</Text>
                <Text style={[styles.columnHeader, { width: 60 }]}>AÇÕES</Text>
              </View>

              {filteredAppointments.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="calendar-blank" size={48} color="#CCC" />
                  <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
                </View>
              ) : (
                filteredAppointments.map((item) => (
                  <View key={item.id} style={styles.tableRow}>
                    <Text style={[styles.timeCell, { width: 55 }]}>{item.horario}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mainCellText}>{item.paciente?.nome || "—"}</Text>
                      <Text style={styles.subCellText}>{item.data}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mainCellText}>{item.medico?.nome || "—"}</Text>
                      <Text style={styles.subCellText}>{item.medico?.especialidade || "—"}</Text>
                    </View>
                    <View style={{ width: 60, alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                      {item.status !== "concluido" ? (
                        <TouchableOpacity onPress={() => handleFinalize(item.id)}>
                          <MaterialCommunityIcons name="check-circle-outline" size={22} color="#4CAF50" />
                        </TouchableOpacity>
                      ) : (
                        <MaterialCommunityIcons name="check-circle" size={22} color="#4CAF50" />
                      )}
                      <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <MaterialCommunityIcons name="trash-can-outline" size={20} color="#D32F2F" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleOpenCreateModal}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* MODAL (form + pickers) */}
      <Modal animationType="slide" visible={modalVisible} onRequestClose={() => { resetForm(); setModalVisible(false); }}>
        <SafeAreaView style={styles.modalFullScreen}>{renderModalContent()}</SafeAreaView>
      </Modal>

      {/* PICKER PARA FILTRO DE DATA (fora do modal de criação) */}
      {activePicker === "filterDate" && !modalVisible && (
        <Modal animationType="slide" transparent={true} visible={true} onRequestClose={() => setActivePicker(null)}>
          <View style={styles.filterPickerOverlay}>
            <View style={styles.filterPickerContainer}>
              <View style={styles.filterPickerHeader}>
                <Text style={styles.filterPickerTitle}>Filtrar por Data</Text>
                <TouchableOpacity onPress={() => setActivePicker(null)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={filterDatesOptions}
                keyExtractor={(item) => item.value}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.pickerItem, filterDate === item.value && { backgroundColor: "#F0F4FF" }]}
                    onPress={() => { setFilterDate(item.value); setFilterDateLabel(item.label); setActivePicker(null); }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.pickerItemLabel, filterDate === item.value && { color: "#0D52BD" }]}>{item.label}</Text>
                      {item.value && item.value !== "future" && item.value !== "historico" ? <Text style={styles.pickerItemSub}>{item.value}</Text> : null}
                    </View>
                    {filterDate === item.value && <Ionicons name="checkmark" size={20} color="#0D52BD" />}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  scrollContainer: { paddingBottom: 40 },
  sectionHeader: { paddingHorizontal: 20, marginTop: 10 },
  title: { fontSize: 26, fontWeight: "bold", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  newAppointmentBtn: { backgroundColor: "#0D52BD", flexDirection: "row", alignItems: "center", justifyContent: "center", marginHorizontal: 20, height: 50, borderRadius: 8, marginTop: 20, elevation: 3 },
  newAppointmentText: { color: "#FFF", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  // Filtro
  filterContainer: { paddingHorizontal: 20, marginTop: 25 },
  filterLabel: { fontSize: 12, fontWeight: "bold", color: "#666", marginBottom: 8 },
  filterSelector: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 16, height: 50 },
  filterSelectorText: { flex: 1, fontSize: 15, color: "#1A1A1A", marginLeft: 12 },
  clearFilterBtn: { marginTop: 8, alignSelf: "flex-end" },
  clearFilterText: { color: "#0D52BD", fontSize: 13, fontWeight: "600" },
  // Loading
  loadingContainer: { alignItems: "center", paddingVertical: 40 },
  loadingText: { marginTop: 10, color: "#666" },
  // Featured card
  featuredCard: { backgroundColor: "#FFF", marginHorizontal: 20, marginTop: 25, borderRadius: 16, padding: 20, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, borderLeftWidth: 6, borderLeftColor: "#0D52BD" },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  timeBadge: { backgroundColor: "#0D52BD", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignItems: "center", marginRight: 15 },
  timeLabel: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  timeValue: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  statusBadge: { backgroundColor: "#69F0AE", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: "#00796B", fontSize: 11, fontWeight: "bold" },
  moreOptions: { marginLeft: "auto" },
  appointmentType: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A", marginTop: 15, marginBottom: 20 },
  infoRow: { flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: "#F0F4FF", alignItems: "center", justifyContent: "center", marginRight: 15 },
  infoTitle: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A" },
  infoSub: { fontSize: 13, color: "#0D52BD", fontWeight: "500" },
  // Tabela
  tableSection: { marginTop: 30, paddingHorizontal: 20 },
  tableHeaderInfo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, backgroundColor: "#E2E8F0", padding: 15, borderRadius: 12 },
  tableHeaderLabel: { fontSize: 12, color: "#666", fontWeight: "bold" },
  tableHeaderCount: { fontSize: 20, fontWeight: "bold", color: "#1A1A1A" },
  tableRowHeader: { flexDirection: "row", paddingBottom: 10, paddingHorizontal: 10 },
  columnHeader: { fontSize: 12, fontWeight: "bold", color: "#666" },
  tableRow: { flexDirection: "row", paddingVertical: 15, paddingHorizontal: 10, backgroundColor: "#FFF", marginBottom: 10, borderRadius: 8, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  timeCell: { fontSize: 14, color: "#333", fontWeight: "600" },
  mainCellText: { fontSize: 13, fontWeight: "bold", color: "#1A1A1A" },
  subCellText: { fontSize: 11, color: "#999", marginTop: 2 },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyText: { marginTop: 10, fontSize: 14, color: "#999" },
  fab: { position: "absolute", right: 20, bottom: 20, backgroundColor: "#0D52BD", width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", elevation: 5, shadowColor: "#0D52BD", shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  // Modal
  modalFullScreen: { flex: 1, backgroundColor: "#F8F9FB" },
  modalTopBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#E2E8F0", backgroundColor: "#FFF" },
  modalTopTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  modalFormContainer: { paddingHorizontal: 24, paddingTop: 24 },
  labelInput: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: "#FFF", borderRadius: 12, paddingHorizontal: 16, height: 52, marginBottom: 4, fontSize: 16, color: "#333", borderWidth: 1, borderColor: "#E2E8F0" },
  saveButton: { backgroundColor: "#0D52BD", borderRadius: 12, height: 55, alignItems: "center", justifyContent: "center", marginTop: 24 },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  selectorBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 4 },
  selectorText: { flex: 1, fontSize: 15, color: "#1A1A1A", marginLeft: 12 },
  // Picker
  pickerEmpty: { alignItems: "center", paddingVertical: 60 },
  pickerItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  pickerItemLabel: { fontSize: 16, fontWeight: "600", color: "#1A1A1A" },
  pickerItemSub: { fontSize: 13, color: "#666", marginTop: 2 },
  // Filter picker (bottom sheet)
  filterPickerOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  filterPickerContainer: { backgroundColor: "#FFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "70%", paddingBottom: 20 },
  filterPickerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  filterPickerTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
});

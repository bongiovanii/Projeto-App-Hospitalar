import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
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
import { pacienteService, Paciente } from "../../services/pacienteService";
import {
  maskCPF,
  maskTelefone,
  maskDataNascimento,
  dataNascimentoToISO,
  dataISOToDisplay,
  unmask,
  isCPFValid,
  isTelefoneValid,
  isDataNascimentoValid,
} from "../../utils/masks";

interface PatientDisplay {
  id: string;
  name: string;
  condition: string;
  phone: string;
  avatar: string;
  color: string;
}

export default function PatientsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);

  // Campos conforme a API: nome, cpf, telefone, condicao, dataNascimento, email, endereco
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [condicao, setCondicao] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");

  const [patients, setPatients] = useState<PatientDisplay[]>([]);

  const mapPacienteToDisplay = (paciente: Paciente): PatientDisplay => ({
    id: String(paciente.id),
    name: paciente.nome,
    condition: paciente.condicao || "—",
    phone: paciente.telefone || "—",
    avatar: `https://ui-avatars.com/api/?name=${(paciente.nome || "P").replace(" ", "+")}&background=004D40&color=fff`,
    color: "#004D40",
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await pacienteService.listarTodos();
      setPatients(data.map(mapPacienteToDisplay));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a lista de pacientes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const resetForm = () => {
    setNome("");
    setCpf("");
    setTelefone("");
    setCondicao("");
    setDataNascimento("");
    setEmail("");
    setEndereco("");
    setEditingPatientId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleEdit = (id: string) => {
    const pat = patients.find((p) => p.id === id);
    if (pat) {
      setNome(pat.name);
      setCondicao(pat.condition !== "—" ? pat.condition : "");
      setTelefone(pat.phone !== "—" ? pat.phone : "");
      setCpf("");
      setDataNascimento("");
      setEmail("");
      setEndereco("");
      setEditingPatientId(id);
      setModalVisible(true);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "Deseja realmente excluir este paciente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await pacienteService.deletar(Number(id));
            setPatients((prev) => prev.filter((p) => p.id !== id));
            Alert.alert("Sucesso", "Paciente excluído com sucesso!");
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir o paciente.");
          }
        },
      },
    ]);
  };

  const handleSavePatient = async () => {
    if (!nome || !cpf || !telefone || !condicao) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios: Nome, CPF, Telefone e Condição.");
      return;
    }

    if (!isCPFValid(cpf)) {
      Alert.alert("Atenção", "CPF inválido. Digite os 11 dígitos.");
      return;
    }

    if (!isTelefoneValid(telefone)) {
      Alert.alert("Atenção", "Telefone inválido. Use (00) 00000-0000.");
      return;
    }

    if (dataNascimento && !isDataNascimentoValid(dataNascimento)) {
      Alert.alert("Atenção", "Data de nascimento inválida. Use DD/MM/AAAA.");
      return;
    }

    try {
      if (editingPatientId) {
        const updated = await pacienteService.atualizar(Number(editingPatientId), {
          nome,
          cpf: unmask(cpf),
          telefone: unmask(telefone),
          condicao,
          dataNascimento: dataNascimento ? dataNascimentoToISO(dataNascimento) : undefined,
          email: email || undefined,
          endereco: endereco || undefined,
        });
        setPatients((prev) =>
          prev.map((p) =>
            p.id === editingPatientId ? mapPacienteToDisplay(updated) : p
          )
        );
        Alert.alert("Sucesso", "Paciente atualizado com sucesso!");
      } else {
        const created = await pacienteService.criar({
          nome,
          cpf: unmask(cpf),
          telefone: unmask(telefone),
          condicao,
          dataNascimento: dataNascimento ? dataNascimentoToISO(dataNascimento) : undefined,
          email: email || undefined,
          endereco: endereco || undefined,
        });
        setPatients((prev) => [mapPacienteToDisplay(created), ...prev]);
        Alert.alert("Sucesso", "Paciente cadastrado com sucesso!");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar. Verifique a conexão.");
      console.error(error);
    }

    resetForm();
    setModalVisible(false);
  };

  const renderPatientCard = ({ item }: { item: PatientDisplay }) => (
    <View style={[styles.card, { borderLeftColor: item.color }]}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientCondition}>{item.condition}</Text>
        <View style={styles.phoneBadge}>
          <Text style={styles.phoneText}>{item.phone}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.actionBtn}>
          <MaterialCommunityIcons name="pencil" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
          <MaterialCommunityIcons name="trash-can-outline" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <HeaderMenu />

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pacientes por nome ou condição.."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* LISTA */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D52BD" />
          <Text style={styles.loadingText}>Carregando pacientes...</Text>
        </View>
      ) : (
        <FlatList
          data={patients.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.condition.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item.id}
          renderItem={renderPatientCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={handleOpenCreateModal}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* MODAL TELA CHEIA */}
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => { resetForm(); setModalVisible(false); }}
      >
        <SafeAreaView style={styles.modalFullScreen}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            {/* Header do Modal */}
            <View style={styles.modalTopBar}>
              <TouchableOpacity onPress={() => { resetForm(); setModalVisible(false); }}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTopTitle}>
                {editingPatientId ? "Editar Paciente" : "Novo Paciente"}
              </Text>
              <View style={{ width: 28 }} />
            </View>

            <ScrollView
              contentContainerStyle={styles.modalFormContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Nome */}
              <Text style={styles.label}>Nome Completo *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Maria Oliveira Santos"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />

              {/* CPF */}
              <Text style={styles.label}>CPF *</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={(text) => setCpf(maskCPF(text))}
                keyboardType="numeric"
                maxLength={14}
              />

              {/* Telefone */}
              <Text style={styles.label}>Telefone *</Text>
              <TextInput
                style={styles.input}
                placeholder="(11) 99999-9999"
                value={telefone}
                onChangeText={(text) => setTelefone(maskTelefone(text))}
                keyboardType="phone-pad"
                maxLength={15}
              />

              {/* Condição / Motivo */}
              <Text style={styles.label}>Condição / Motivo da Consulta *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Check-up Anual"
                value={condicao}
                onChangeText={setCondicao}
                autoCapitalize="sentences"
              />

              {/* Data de Nascimento */}
              <Text style={styles.label}>Data de Nascimento</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                value={dataNascimento}
                onChangeText={(text) => setDataNascimento(maskDataNascimento(text))}
                keyboardType="numeric"
                maxLength={10}
              />

              {/* Email */}
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="paciente@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Endereço */}
              <Text style={styles.label}>Endereço</Text>
              <TextInput
                style={styles.input}
                placeholder="Rua, número, bairro, cidade"
                value={endereco}
                onChangeText={setEndereco}
                autoCapitalize="sentences"
              />

              {/* Botão Salvar */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSavePatient}>
                <Text style={styles.saveButtonText}>
                  {editingPatientId ? "Salvar Alterações" : "Cadastrar Paciente"}
                </Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  searchContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#F0F2F5",
    marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 15, height: 50,
    borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#666" },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    flexDirection: "row", backgroundColor: "#FFF", borderRadius: 16, padding: 15,
    marginBottom: 15, borderLeftWidth: 6, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  cardContent: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A", marginBottom: 4 },
  patientCondition: { fontSize: 14, color: "#666", marginBottom: 8 },
  phoneBadge: {
    backgroundColor: "#E8F5E9", alignSelf: "flex-start",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  phoneText: { color: "#2E7D32", fontSize: 12, fontWeight: "bold" },
  actionButtons: { justifyContent: "space-between", height: 60 },
  actionBtn: { padding: 5 },
  fab: {
    position: "absolute", width: 60, height: 60, alignItems: "center",
    justifyContent: "center", right: 20, bottom: 20, backgroundColor: "#0D52BD",
    borderRadius: 30, elevation: 8, shadowColor: "#0D52BD",
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  // Modal Tela Cheia
  modalFullScreen: { flex: 1, backgroundColor: "#F8F9FB" },
  modalTopBar: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0", backgroundColor: "#FFF",
  },
  modalTopTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  modalFormContainer: { paddingHorizontal: 24, paddingTop: 24 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  input: {
    backgroundColor: "#FFF", borderRadius: 12, paddingHorizontal: 16, height: 52,
    marginBottom: 20, fontSize: 16, color: "#333", borderWidth: 1, borderColor: "#E2E8F0",
  },
  saveButton: {
    backgroundColor: "#0D52BD", borderRadius: 12, height: 55,
    alignItems: "center", justifyContent: "center", marginTop: 10,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

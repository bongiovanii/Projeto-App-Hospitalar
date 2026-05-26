import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Dados mockados para visualização inicial
const INITIAL_PATIENTS = [
  {
    id: "1",
    name: "Mariana Silva",
    condition: "Check-up Anual",
    phone: "(11) 98765-4321",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    color: "#0D52BD",
  },
  {
    id: "2",
    name: "João Pereira",
    condition: "Acompanhamento Pediátrico",
    phone: "(11) 91234-5678",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    color: "#004D40",
  },
  {
    id: "3",
    name: "Luciana Gimenez",
    condition: "Tratamento Dermatológico",
    phone: "(21) 99876-5432",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    color: "#0D52BD",
  },
  {
    id: "4",
    name: "Roberto Justos",
    condition: "Revisão Cardiológica",
    phone: "(41) 97765-1122",
    avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    color: "#004D40",
  },
];

export default function PatientsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Estado para saber se estamos editando (guarda o ID) ou criando (fica null)
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);

  // Estados do formulário adaptados para Pacientes
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [condicao, setCondicao] = useState("");

  // Estado que controla a lista de pacientes exibida na tela
  const [patients, setPatients] = useState(INITIAL_PATIENTS);

  // Função para abrir o modal de Criação limpo
  const handleOpenCreateModal = () => {
    setEditingPatientId(null);
    setNome("");
    setCpf("");
    setTelefone("");
    setCondicao("");
    setModalVisible(true);
  };

  // Função de edição
  const handleEdit = (id: string) => {
    const patientToEdit = patients.find((pat) => pat.id === id);

    if (patientToEdit) {
      // Preenche os dados do modal com as informações do paciente selecionado
      setNome(patientToEdit.name);
      setCondicao(patientToEdit.condition);
      setTelefone(patientToEdit.phone);
      setCpf(""); // Deixado em branco, pois ainda não temos CPF no mock

      setEditingPatientId(id); // Sinaliza que estamos no modo de edição
      setModalVisible(true);
    }
  };

  const handleDelete = (id: string) => {
    console.log(`Deletar paciente ID: ${id}`);
    // FUTURO: Aqui você fará o DELETE na API
  };

  // Função de salvar atende tanto Criação quanto Edição
  const handleSavePatient = () => {
    // Validação básica
    if (!nome || !condicao) {
      Alert.alert(
        "Atenção",
        "Por favor, preencha pelo menos o Nome e a Condição/Motivo.",
      );
      return;
    }

    if (editingPatientId) {
      // LOGICA DE EDIÇÃO
      setPatients((prevPatients) =>
        prevPatients.map((pat) =>
          pat.id === editingPatientId
            ? {
                ...pat,
                name: nome,
                condition: condicao,
                phone: telefone || pat.phone,
              }
            : pat,
        ),
      );

      // FUTURO: Aqui vai o PUT/PATCH na API

      Alert.alert("Sucesso", "Informações do paciente editadas com sucesso!");
    } else {
      // LOGICA DE CRIAÇÃO
      const novoPaciente = {
        id: Date.now().toString(),
        name: nome,
        condition: condicao,
        phone: telefone || "(00) 00000-0000",
        avatar:
          "https://ui-avatars.com/api/?name=" +
          nome.replace(" ", "+") +
          "&background=004D40&color=fff",
        color: "#004D40",
      };

      setPatients((prevPatients) => [novoPaciente, ...prevPatients]);
      console.log("Paciente adicionado localmente:", novoPaciente);
      // FUTURO: Aqui você fará o POST na API
    }

    // Limpa o form e fecha o modal
    setEditingPatientId(null);
    setNome("");
    setCpf("");
    setTelefone("");
    setCondicao("");
    setModalVisible(false);
  };

  const renderPatientCard = ({
    item,
  }: {
    item: (typeof INITIAL_PATIENTS)[0];
  }) => (
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
        <TouchableOpacity
          onPress={() => handleEdit(item.id)}
          style={styles.actionBtn}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.actionBtn}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={24}
            color="#D32F2F"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
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

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar pacientes por nome ou condição.."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* LISTA DE PACIENTES */}
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={renderPatientCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* BOTÃO FLUTUANTE (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={handleOpenCreateModal}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingPatientId(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPatientId ? `Editando ${nome}` : "Novo Paciente"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingPatientId(null);
                }}
              >
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Condição ou Motivo da Consulta"
              value={condicao}
              onChangeText={setCondicao}
            />
            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Telefone"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={setTelefone}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CPF"
                keyboardType="numeric"
                value={cpf}
                onChangeText={setCpf}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSavePatient}
            >
              <Text style={styles.saveButtonText}>
                {editingPatientId ? "Editar" : "Salvar Cadastro"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    marginTop: 30, // Ajustado para não colar no topo em alguns aparelhos
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  patientCondition: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  phoneBadge: {
    backgroundColor: "#E8F5E9",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  phoneText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionButtons: {
    justifyContent: "space-between",
    height: 60,
  },
  actionBtn: {
    padding: 5,
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#0D52BD",
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#0D52BD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  input: {
    backgroundColor: "#F0F2F5",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  saveButton: {
    backgroundColor: "#0D52BD",
    borderRadius: 12,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert, // <-- NOVO: Importado para exibir a notificação de sucesso
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
const INITIAL_DOCTORS = [
  {
    id: "1",
    name: "Dr. Roberto Silva",
    specialty: "Cardiologia",
    crm: "123456",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    color: "#0D52BD",
  },
  {
    id: "2",
    name: "Dra. Ana Costa",
    specialty: "Pediatria",
    crm: "789012",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    color: "#004D40",
  },
  {
    id: "3",
    name: "Dr. Carlos Mendes",
    specialty: "Neurologia",
    crm: "456123",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    color: "#0D52BD",
  },
  {
    id: "4",
    name: "Dra. Juliana Lima",
    specialty: "Dermatologia",
    crm: "998214",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    color: "#004D40",
  },
];

export default function DoctorsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // NOVO: Estado para saber se estamos editando (guarda o ID) ou criando (fica null)
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [crm, setCrm] = useState("");
  const [especialidade, setEspecialidade] = useState("");

  // Estado que controla a lista de médicos exibida na tela
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);

  // NOVO: Função para abrir o modal de Criação limpo
  const handleOpenCreateModal = () => {
    setEditingDoctorId(null);
    setNome("");
    setCpf("");
    setCrm("");
    setEspecialidade("");
    setModalVisible(true);
  };

  // ATUALIZADO: Função de edição
  const handleEdit = (id: string) => {
    const doctorToEdit = doctors.find((doc) => doc.id === id);

    if (doctorToEdit) {
      // Preenche os dados do modal com as informações do médico selecionado
      setNome(doctorToEdit.name);
      setEspecialidade(doctorToEdit.specialty);
      setCrm(doctorToEdit.crm);
      setCpf(""); // Deixado em branco, pois ainda não temos CPF no mock

      setEditingDoctorId(id); // Sinaliza que estamos no modo de edição
      setModalVisible(true); // Abre o mesmo modal
    }

    // FUTURO: Aqui você fará o GET na API usando o CPF/ID para buscar os dados completos
  };

  const handleDelete = (id: string) => {
    console.log(`Deletar médico ID: ${id}`);
    // FUTURO: Aqui você fará o DELETE na API
  };

  // ATUALIZADO: Função de salvar atende tanto Criação quanto Edição
  const handleSaveDoctor = () => {
    // Validação básica
    if (!nome || !especialidade) {
      Alert.alert(
        "Atenção",
        "Por favor, preencha pelo menos o Nome e a Especialidade.",
      );
      return;
    }

    if (editingDoctorId) {
      // LOGICA DE EDIÇÃO
      setDoctors((prevDoctors) =>
        prevDoctors.map((doc) =>
          doc.id === editingDoctorId
            ? {
                ...doc,
                name: nome,
                specialty: especialidade,
                crm: crm || doc.crm,
              }
            : doc,
        ),
      );

      // FUTURO: Aqui vai a validação de CPF e o PUT/PATCH na API

      // Notificação de sucesso solicitada
      Alert.alert("Sucesso", "Informações do médico editadas com sucesso!");
    } else {
      // LOGICA DE CRIAÇÃO
      const novoMedico = {
        id: Date.now().toString(),
        name: nome,
        specialty: especialidade,
        crm: crm || "000000",
        avatar:
          "https://ui-avatars.com/api/?name=" +
          nome.replace(" ", "+") +
          "&background=0D52BD&color=fff",
        color: "#0D52BD",
      };

      setDoctors((prevDoctors) => [novoMedico, ...prevDoctors]);
      console.log("Médico adicionado localmente:", novoMedico);
      // FUTURO: Aqui você fará o POST na API
    }

    // Limpa o form e fecha o modal
    setEditingDoctorId(null);
    setNome("");
    setCpf("");
    setCrm("");
    setEspecialidade("");
    setModalVisible(false);
  };

  const renderDoctorCard = ({
    item,
  }: {
    item: (typeof INITIAL_DOCTORS)[0];
  }) => (
    <View style={[styles.card, { borderLeftColor: item.color }]}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        <View style={styles.crmBadge}>
          <Text style={styles.crmText}>CRM {item.crm}</Text>
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
          placeholder="Buscar médicos por nome ou especialidade.."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* LISTA DE MÉDICOS */}
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctorCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* BOTÃO FLUTUANTE (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={handleOpenCreateModal} // <-- ATUALIZADO
      >
        <MaterialCommunityIcons name="plus" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingDoctorId(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              {/* ATUALIZADO: Título dinâmico */}
              <Text style={styles.modalTitle}>
                {editingDoctorId ? `Editando ${nome}` : "Novo Médico"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingDoctorId(null);
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
              placeholder="Especialidade"
              value={especialidade}
              onChangeText={setEspecialidade}
            />
            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CRM"
                keyboardType="numeric"
                value={crm}
                onChangeText={setCrm}
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
              onPress={handleSaveDoctor}
            >
              {/* ATUALIZADO: Texto do botão dinâmico */}
              <Text style={styles.saveButtonText}>
                {editingDoctorId ? "Editar" : "Salvar Cadastro"}
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
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  crmBadge: {
    backgroundColor: "#69F0AE",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  crmText: {
    color: "#00796B",
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

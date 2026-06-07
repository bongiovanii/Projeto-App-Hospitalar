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
import { medicoService, Medico } from "../../services/medicoService";
import { maskCPF, maskTelefone, unmask, isCPFValid, isTelefoneValid } from "../../utils/masks";

interface DoctorDisplay {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  avatar: string;
  color: string;
}

export default function DoctorsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  // Campos do formulário — todos os campos do DTO
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [crm, setCrm] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [telefone, setTelefone] = useState("");

  const [doctors, setDoctors] = useState<DoctorDisplay[]>([]);

  const mapMedicoToDisplay = (medico: Medico): DoctorDisplay => ({
    id: String(medico.id),
    name: medico.nome,
    specialty: medico.especialidade,
    crm: medico.crm,
    avatar:
      `https://ui-avatars.com/api/?name=${medico.nome.replace(" ", "+")}&background=0D52BD&color=fff`,
    color: "#0D52BD",
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await medicoService.listarTodos();
      setDoctors(data.map(mapMedicoToDisplay));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a lista de médicos.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const resetForm = () => {
    setNome("");
    setCpf("");
    setCrm("");
    setEspecialidade("");
    setTelefone("");
    setEditingDoctorId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleEdit = (id: string) => {
    const doc = doctors.find((d) => d.id === id);
    if (doc) {
      setNome(doc.name);
      setEspecialidade(doc.specialty);
      setCrm(doc.crm);
      setCpf("");
      setTelefone("");
      setEditingDoctorId(id);
      setModalVisible(true);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "Deseja realmente excluir este médico?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await medicoService.deletar(Number(id));
            setDoctors((prev) => prev.filter((doc) => doc.id !== id));
            Alert.alert("Sucesso", "Médico excluído com sucesso!");
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir o médico.");
          }
        },
      },
    ]);
  };

  const handleSaveDoctor = async () => {
    if (!nome || !especialidade || !crm || !cpf) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios: Nome, CPF, CRM e Especialidade.");
      return;
    }

    if (!isCPFValid(cpf)) {
      Alert.alert("Atenção", "CPF inválido. Digite os 11 dígitos.");
      return;
    }

    if (telefone && !isTelefoneValid(telefone)) {
      Alert.alert("Atenção", "Telefone inválido. Use (00) 00000-0000.");
      return;
    }

    try {
      if (editingDoctorId) {
        const updated = await medicoService.atualizar(Number(editingDoctorId), {
          nome,
          especialidade,
          crm,
          cpf: unmask(cpf),
          telefone: telefone ? unmask(telefone) : undefined,
        });
        setDoctors((prev) =>
          prev.map((doc) =>
            doc.id === editingDoctorId ? mapMedicoToDisplay(updated) : doc
          )
        );
        Alert.alert("Sucesso", "Médico atualizado com sucesso!");
      } else {
        const created = await medicoService.criar({
          nome,
          cpf: unmask(cpf),
          crm,
          especialidade,
          telefone: telefone ? unmask(telefone) : undefined,
        });
        setDoctors((prev) => [mapMedicoToDisplay(created), ...prev]);
        Alert.alert("Sucesso", "Médico cadastrado com sucesso!");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar. Verifique a conexão.");
      console.error(error);
    }

    resetForm();
    setModalVisible(false);
  };

  const renderDoctorCard = ({ item }: { item: DoctorDisplay }) => (
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
          placeholder="Buscar médicos por nome ou especialidade.."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* LISTA */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D52BD" />
          <Text style={styles.loadingText}>Carregando médicos...</Text>
        </View>
      ) : (
        <FlatList
          data={doctors.filter(
            (doc) =>
              doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctorCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={handleOpenCreateModal}>
        <MaterialCommunityIcons name="plus" size={32} color="#FFF" />
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
                {editingDoctorId ? "Editar Médico" : "Novo Médico"}
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
                placeholder="Ex: Dr. Roberto Silva"
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

              {/* CRM */}
              <Text style={styles.label}>CRM *</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                value={crm}
                onChangeText={setCrm}
                keyboardType="numeric"
              />

              {/* Especialidade */}
              <Text style={styles.label}>Especialidade *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Cardiologia"
                value={especialidade}
                onChangeText={setEspecialidade}
                autoCapitalize="words"
              />

              {/* Telefone */}
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                placeholder="(11) 99999-9999"
                value={telefone}
                onChangeText={(text) => setTelefone(maskTelefone(text))}
                keyboardType="phone-pad"
                maxLength={15}
              />

              {/* Botão Salvar */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveDoctor}>
                <Text style={styles.saveButtonText}>
                  {editingDoctorId ? "Salvar Alterações" : "Cadastrar Médico"}
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
  doctorName: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A", marginBottom: 4 },
  doctorSpecialty: { fontSize: 14, color: "#666", marginBottom: 8 },
  crmBadge: {
    backgroundColor: "#69F0AE", alignSelf: "flex-start",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  crmText: { color: "#00796B", fontSize: 12, fontWeight: "bold" },
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

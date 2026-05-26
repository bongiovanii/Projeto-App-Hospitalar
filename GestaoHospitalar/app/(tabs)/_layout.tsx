import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

// Importar imagens estaticamente
import consultaIcon from "../../assets/images/consulta.png";
import homeIcon from "../../assets/images/home.png";
import medicoIcon from "../../assets/images/medico.png";
import pacienteIcon from "../../assets/images/paciente.png";

// Cria o navegador Top Tabs e adapta para o Expo Router
const { Navigator } = createMaterialTopTabNavigator();
const SwipeableTabs = withLayoutContext(Navigator);

// Componente auxiliar para renderizar os botões da Tab
function TabIcon({
  focused,
  source,
}: {
  focused: boolean;
  source: ImageSourcePropType;
}) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Image
        source={source}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? "#FFF" : "#666", // Pinta o ícone dependendo do foco
        }}
        resizeMode="contain"
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <SwipeableTabs
      tabBarPosition="bottom" // A mágica que joga a barra pro rodapé
      screenOptions={{
        swipeEnabled: true, // Ativa o gesto de deslizar para os lados
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false, // Esconde o texto padrão
        tabBarIndicatorStyle: { height: 0 }, // Esconde a linha colorida padrão do Top Tabs
        tabBarItemStyle: { padding: 0 }, // Remove o padding padrão para centralizar
        tabBarShowIcon: true, // Obriga o Top Tabs a mostrar os ícones
      }}
    >
      <SwipeableTabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused} source={homeIcon} />
          ),
        }}
      />
      <SwipeableTabs.Screen
        name="doctors"
        options={{
          title: "Doutores",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused} source={medicoIcon} />
          ),
        }}
      />
      <SwipeableTabs.Screen
        name="calendar"
        options={{
          title: "Consultas",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused} source={consultaIcon} />
          ),
        }}
      />
      <SwipeableTabs.Screen
        name="patients"
        options={{
          title: "Pacientes",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused} source={pacienteIcon} />
          ),
        }}
      />
    </SwipeableTabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 100,
    backgroundColor: "#FFF",
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingHorizontal: 10,
    justifyContent: "center", // Garante que o conteúdo fique centralizado verticalmente na barra nova
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 35,
    height: 40,
  },
  tabItemActive: {
    backgroundColor: "#0D52BD",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
});

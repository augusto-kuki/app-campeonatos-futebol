import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

import api from "../services/api";
import token from "../services/token";

const Home = () => {
  const [campeonatos, setCampeonatos] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    async function loadCampeonatos() {
      const response = await api
        .get("/campeonatos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => setCampeonatos(resp.data))
        .catch((err) => Alert.alert(err));
    }

    loadCampeonatos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> FUTEBOL EM TEMPO REAL </Text>

      <FlatList
        data={campeonatos}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View style={styles.campeonato} key={item.campeonato_id}>
              <Text style={styles.campeonatoNome}>{item.nome}</Text>

              <Text style={styles.campeonatoProperty}>
                Status:{" "}
                <Text style={styles.campeonatoValue}>{item.status} </Text>
              </Text>

              <Text style={styles.campeonatoProperty}>
                Tipo: <Text style={styles.campeonatoValue}>{item.tipo}</Text>
              </Text>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() =>
                  navigation.navigate("Campeonato", {
                    campeonato_id: item.campeonato_id,
                  })
                }
              >
                <Text style={styles.detailsButtonText}> Ver mais detalhes</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#34aeeb" />
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item) => `${item.campeonato_id}`}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34aeeb",
    paddingTop: 15,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 25,
    marginBottom: 16,
    color: "#FFF",
    alignSelf: "flex-start",
    fontWeight: "bold",
  },

  compeonatosList: {
    marginTop: 32,
  },

  campeonato: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: "#FFF",
    marginBottom: 16,
  },

  campeonatoNome: {
    marginTop: 5,
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#34aeeb",
  },

  campeonatoProperty: {
    fontSize: 14,
    color: "#41414d",
    fontWeight: "bold",
  },

  campeonatoValue: {
    marginTop: 8,
    fontSize: 15,
    marginBottom: 24,
    color: "#737380",
  },

  detailsButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  detailsButtonText: {
    color: "#34aeeb",
    fontSize: 15,
  },
});

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

const Campeonato = ({ route }) => {
  const navigation = useNavigation();
  const { campeonato_id } = route.params;

  const [campeonato, setCampeonato] = useState({});

  useEffect(() => {
    async function loadCampeonato() {
      const response = await api
        .get(`campeonatos/${campeonato_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          setCampeonato(resp.data);
        })
        .catch((err) => Alert.alert(err));
    }
    loadCampeonato();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.campeonatoInfo}>
        <Text style={styles.title}>{campeonato.nome} </Text>

        {campeonato.edicao_atual ? (
          <Text style={styles.infos}>
            Temporada Atual: {campeonato.edicao_atual.temporada}
          </Text>
        ) : null}

        <Text style={styles.infos}>REGIÃO: {campeonato.regiao} </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.infos}>STATUS: {campeonato.status} | </Text>
          <Text style={styles.infos}>TIPO: {campeonato.tipo} </Text>
        </View>

        {campeonato.fases && campeonato.fases.length <= 0 ? (
          <Text style={styles.title}>CAMPEONATO NAO INICIADO</Text>
        ) : null}
      </View>
      <FlatList
        data={campeonato.fases}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View style={styles.fase} key={item.fase_id}>
              <Text style={styles.faseNome}>{item.nome}</Text>
              <Text style={styles.faseProperty}>
                Status: <Text style={styles.faseValue}>{item.status} </Text>
              </Text>
              <Text style={styles.faseProperty}>
                Decisivo:{" "}
                <Text style={styles.faseValue}>
                  {item.decisivo ? "Sim" : "Não"}
                </Text>
              </Text>
              <Text style={styles.faseProperty}>
                Eliminatorio:{" "}
                <Text style={styles.faseValue}>
                  {item.eliminatorio ? "Sim" : "Não"}
                </Text>
              </Text>
              <Text style={styles.faseProperty}>
                Ida e Volta:{" "}
                <Text style={styles.faseValue}>
                  {item.ida_e_volta ? "Sim" : "Não"}
                </Text>
              </Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() =>
                  navigation.navigate("Fase", {
                    fase_id: item.fase_id,
                    campeonato_id: campeonato.campeonato_id,
                  })
                }
              >
                <Text style={styles.detailsButtonText}> Ver mais detalhes</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#34aeeb" />
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item) => `${item.fase_id}`}
      />
    </View>
  );
};

export default Campeonato;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34aeeb",
    paddingTop: 15,
    paddingHorizontal: 24,
  },

  faseInfo: {
    alignContent: "center",
  },
  fase: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: "#FFF",
    marginBottom: 16,
  },

  title: {
    fontSize: 25,
    marginBottom: 16,
    color: "#FFF",
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  infos: {
    fontSize: 15,
    marginBottom: 8,
    color: "#FFF",
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  faseNome: {
    marginTop: 5,
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#34aeeb",
  },

  faseProperty: {
    fontSize: 14,
    color: "#41414d",
    fontWeight: "bold",
  },

  faseValue: {
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

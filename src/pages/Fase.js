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

const Fase = ({ route }) => {
  const navigation = useNavigation();
  const { fase_id, campeonato_id } = route.params;

  const [fase, setFase] = useState({});

  const [allChaves, setAllChaves] = useState([]);

  useEffect(() => {
    async function loadFases() {
      const response = await api
        .get(`campeonatos/${campeonato_id}/fases/${fase_id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          let chaves = resp.data.chaves;

          let allChaves = [];

          for (let chave in chaves) {
            let chaveNr = {
              chave: chave.split("-").pop(),
              jogos: [],
            };
            for (let jogo in chaves[chave]) {
              for (let partida in chaves[chave][jogo]) {
                let jg = {
                  jogo,
                  partida_id: chaves[chave][jogo][partida].partida_id,
                  placar: chaves[chave][jogo][partida].placar,
                  status: chaves[chave][jogo][partida].status,
                  data_realizacao: chaves[chave][jogo][partida].data_realizacao,
                  hora_realizacao: chaves[chave][jogo][partida].hora_realizacao,
                };

                chaveNr.jogos.push(jg);
              }
            }
            allChaves.push(chaveNr);
          }

          setAllChaves(allChaves);
          setFase(resp.data);
        })
        .catch((err) => Alert.alert(err));
    }
    loadFases();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.faseInfo}>
        <Text style={styles.title}> {fase.nome} </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.infos}>STATUS: {fase.status} | </Text>
          <Text style={styles.infos}>
            DECISIVO: {fase.decisivo ? "Sim" : "Não"} |
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.infos}>
            ELIMINATORIO: {fase.eliminatorio ? "Sim" : "Não"} |{" "}
          </Text>

          <Text style={styles.infos}>
            IDA E VOLTA: {fase.ida_e_volta ? "Sim" : "Não"}
          </Text>
        </View>
      </View>

      <FlatList
        data={allChaves}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.chave}>
            <Text syle={styles.titulo}>Chave: {item.chave}</Text>

            <FlatList
              data={item.jogos}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.jogo}>
                  <Text style={styles.titulo}>Jogo de {item.jogo}</Text>
                  <Text style={styles.jogoProperty}>Placar: {item.placar}</Text>
                  <Text style={styles.jogoProperty}>Status: {item.status}</Text>

                  {item.data_realizacao ? (
                    <Text style={styles.jogoProperty}>
                      Data: {item.data_realizacao} | {item.hora_realizacao}
                    </Text>
                  ) : null}
                </View>
              )}
              keyExtractor={(item) => `${item.partida_id}`}
            />
          </View>
        )}
        keyExtractor={(item) => `${item.chave.split("-").pop()}`}
      />
    </View>
  );
};

export default Fase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34aeeb",
    paddingTop: 15,
    paddingHorizontal: 24,
  },

  chave: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: "#FFF",
    marginBottom: 16,
  },

  jogo: {
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

  titulo: {
    marginTop: 5,
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#34aeeb",
  },

  jogoProperty: {
    fontSize: 14,
    color: "#41414d",
    fontWeight: "bold",
  },
});

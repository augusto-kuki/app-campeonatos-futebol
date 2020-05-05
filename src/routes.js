import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./pages/Home";
import Campeonato from "./pages/Campeonato";
import Fase from "./pages/Fase";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Campeonato" component={Campeonato} />
      <Stack.Screen name="Fase" component={Fase} />
    </Stack.Navigator>
  );
}

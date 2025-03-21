import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ListItem } from "react-native-elements";
import api from "@/routes/api";

interface Service {
  _id: string;
  name: string;
  description: string;
}

const ServicesList = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services"); // Replace with your server IP
        setServices(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Erreur lors de la récupération des services.");
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={services}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
  },
});

export default ServicesList;

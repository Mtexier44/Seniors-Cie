import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";

const { width } = Dimensions.get("window");

interface Service {
  _id: string;
  name: string;
  description: string;
}

interface Helper {
  _id: string;
  name: string;
  description?: string;
  rating?: number;
}

interface SeniorRequestFormProps {
  seniorId: string;
}

const SeniorRequestForm: React.FC<SeniorRequestFormProps> = ({ seniorId }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [selectedHelper, setSelectedHelper] = useState<Helper | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Service[]>("/api/services");
        setServices(response.data);
      } catch {
        setError(
          "Impossible de charger les services. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchHelpers = async () => {
      if (!selectedService) return;
      try {
        setLoading(true);
        const response = await axios.get<Helper[]>(
          `/api/users?role=helper&service=${selectedService._id}`
        );
        setHelpers(response.data);
      } catch {
        setError(
          "Impossible de charger les aidants disponibles. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHelpers();
  }, [selectedService]);

  const handleSubmit = async () => {
    if (!selectedService) {
      setError("Veuillez sélectionner un service");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await axios.post("/api/requests", {
        senior: seniorId,
        service: selectedService._id,
        assignedTo: selectedHelper ? selectedHelper._id : null,
      });
      setSuccess("Votre demande a été créée avec succès!");
      setStep(3);
    } catch {
      setError(
        "Une erreur s'est produite lors de la création de votre demande. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedService(null);
    setSelectedHelper(null);
    setSuccess("");
    setError("");
    setStep(1);
  };

  return (
    <View style={styles.seniorRequestForm}>
      <Text style={styles.title}>Créer une demande d'aide</Text>
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      {success ? <Text style={styles.successMessage}>{success}</Text> : null}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {step === 1 && (
            <View>
              <Text style={styles.stepTitle}>
                Étape 1 : Choisissez un service
              </Text>
              <ScrollView>
                {services.map((service) => (
                  <TouchableOpacity
                    key={service._id}
                    style={[
                      styles.card,
                      selectedService?._id === service._id &&
                        styles.selectedCard,
                    ]}
                    onPress={() => {
                      setSelectedService(service);
                      setStep(2);
                    }}
                  >
                    <Text style={styles.cardTitle}>{service.name}</Text>
                    <Text style={styles.cardText}>{service.description}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.stepTitle}>
                Étape 2 : Choisissez un aidant (optionnel)
              </Text>
              <TouchableOpacity
                onPress={() => setStep(1)}
                style={[styles.button, styles.backButton]}
              >
                <Text>Retour</Text>
              </TouchableOpacity>
              <ScrollView>
                {helpers.length > 0 ? (
                  helpers.map((helper) => (
                    <TouchableOpacity
                      key={helper._id}
                      style={[
                        styles.card,
                        selectedHelper?._id === helper._id &&
                          styles.selectedCard,
                      ]}
                      onPress={() => setSelectedHelper(helper)}
                    >
                      <Text style={styles.cardTitle}>{helper.name}</Text>
                      <Text style={styles.cardText}>
                        {helper.description || "Aidant disponible"}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.cardText}>
                    Aucun aidant spécifique n'est disponible pour ce service.
                  </Text>
                )}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setStep(3)}
                style={styles.button}
              >
                <Text>Suivant</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.stepTitle}>
                Récapitulatif de votre demande
              </Text>
              <Text>Service sélectionné : {selectedService?.name}</Text>
              <Text>Description : {selectedService?.description}</Text>
              {selectedHelper && (
                <>
                  <Text>Aidant sélectionné : {selectedHelper.name}</Text>
                  <Text>
                    Description :{" "}
                    {selectedHelper.description || "Pas de description"}
                  </Text>
                </>
              )}
              <TouchableOpacity
                onPress={() => setStep(2)}
                style={[styles.button, styles.backButton]}
              >
                <Text>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                style={[styles.button, loading && styles.disabledButton]}
              >
                <Text>
                  {loading
                    ? "Création en cours..."
                    : "Confirmer et créer la demande"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  seniorRequestForm: {
    maxWidth: 900,
    padding: width < 768 ? 15 : 20,
  },
  title: {
    textAlign: "center",
    color: "#4a6fa5",
    marginBottom: 30,
    fontSize: 24,
    fontWeight: "bold",
  },
  stepTitle: {
    color: "#4a6fa5",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#4a6fa5",
    backgroundColor: "#e9f0f8",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#4a6fa5",
    color: "white",
    alignSelf: "center",
  },
  backButton: {
    backgroundColor: "#f1f1f1",
    color: "#666",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#b0bec5",
  },
  errorMessage: {
    color: "#c62828",
    marginBottom: 10,
    fontSize: 14,
    textAlign: "center",
  },
  successMessage: {
    color: "#2e7d32",
    marginBottom: 10,
    fontSize: 14,
    textAlign: "center",
  },
});

export default SeniorRequestForm;

#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "Test";     
const char* password = "123456789";  
const char* serverAddress = "192.168.56.1";  

#define BUTTON_PIN D3  

WebSocketsClient webSocket;

bool buttonPressed = false;

void IRAM_ATTR handleButtonPress() {
  buttonPressed = true;  
}

void setup() {
  Serial.begin(115200);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), handleButtonPress, FALLING);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
  }

  webSocket.begin(serverAddress, 3000, "/");
  webSocket.onEvent(webSocketEvent);

  Serial.println("WiFi connecté !");
}

void loop() {
  webSocket.loop();

  if (buttonPressed) {
    buttonPressed = false;
    webSocket.sendTXT("Bouton pressé - cette personne est en danger!");
  }
}

// Callback WebSocket
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("Déconnecté du serveur WebSocket");
      break;
    case WStype_CONNECTED:
      Serial.println("Connecté au serveur WebSocket");
      break;
    case WStype_TEXT:
      Serial.println("Message reçu: ");
      Serial.println((char*)payload);
      break;
    case WStype_BIN:
      break;
  }
}

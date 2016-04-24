#include <ArduinoJson.h>
#include <ESP8266WiFi.h>

const char* ssid     = "";
const char* password = "";

const char* host     = "iotfinal.mreijnoudt.com";
String path          = "/api/status/output";
const int httpPort   = 80;

//pins and sensors
int pinPir = D0;
int pirState = LOW;
int val = 0;
int amountPir = 0;

//leds
const int redLEDPin = D1;
const int whiteLEDPin = D2;
const int greenLEDPin = D3;


WiFiClient client;
void setup() {
  pinMode(pinPir, INPUT);
  pinMode(redLEDPin, OUTPUT);
  pinMode(whiteLEDPin, OUTPUT);
  pinMode(greenLEDPin, OUTPUT); 
  

  
  Serial.begin(9600);

  
  delay(10);
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  int wifi_ctr = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("WiFi connected");
  Serial.println("IP address: " + WiFi.localIP());
}

void loop() {
  if(!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }
  
  getNetworkData();
  delay(2000);
  sendNetworkData();

}


void getNetworkData() {
  client.print(String("GET ") + path + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: keep-alive\r\n\r\n");

  delay(500); // wait for server to respond
  Serial.println("Getting the data");

  // read response
  String section = "header";
  while (client.available()) {
    String line = client.readStringUntil('\r');
    // Serial.print(line);
    // we’ll parse the HTML body here
    if (section == "header") { // headers..
      //Serial.print(".");
      if (line == "\n") { // skips the empty space at the beginning
        section = "json";
      }
    }
    else if (section == "json") { // print the good stuff
      section = "ignore";
      String result = line.substring(1);

      // Parse JSON
      int size = result.length() + 1;
      char json[size];
      result.toCharArray(json, size);
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& json_parsed = jsonBuffer.parseObject(json);
      if (!json_parsed.success())
      {
        Serial.println("parseObject() failed");
        return;
      }


      // Make the decision to turn off or on the LED
      if (strcmp(json_parsed["led"], "red") == 0) {
        digitalWrite(redLEDPin, HIGH);
        digitalWrite(whiteLEDPin, LOW);
        digitalWrite(greenLEDPin, LOW);
      }
      if (strcmp(json_parsed["led"], "white") == 0) {
        digitalWrite(redLEDPin, LOW);
        digitalWrite(whiteLEDPin, HIGH);
        digitalWrite(greenLEDPin, LOW);
      }   
      if (strcmp(json_parsed["led"], "green") == 0) {
        digitalWrite(redLEDPin, LOW);
        digitalWrite(whiteLEDPin, LOW);
        digitalWrite(greenLEDPin, HIGH);
      }  
    }
  }
  Serial.print("closing connection. ");
}

void sendNetworkData() {
    int pir = digitalRead(pinPir);
    amountPir += pir;
    Serial.println(amountPir);

  
  if (client.connect(host, httpPort)) {
    String postData = "input=" + String(pir);
    
    Serial.println();

    client.println("POST /api HTTP/1.1");
    client.println("Host: " + String(host));
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.println("Connection: close");
    client.print("Content-Length: ");
    client.println(postData.length());
    client.println();
    client.print(postData);
    client.println();
    Serial.println(pir);
    Serial.println("Data send");
  }
}



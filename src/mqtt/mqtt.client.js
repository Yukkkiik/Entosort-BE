const mqtt = require('mqtt');

const client = mqtt.connect(process.env.MQTT_URL, {
    clientId: process.env.MQTT_CLIENT_ID,
    reconnectPeriod: 3000,
    clean: true,
});

client.on("connect", () => {
    console.log("Connected to MQTT broker");
});

client.on("reconnect", () => {
    console.log("Reconnecting to MQTT broker...");
});

client.on("error", (error) => {
    console.log("MQTT error: ", error.message);
});

module.exports = client;
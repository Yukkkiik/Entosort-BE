const client = require('./mqtt.client');

const routes = new Map();

const mqttRoute = (topic, handler) => {
    routes.set(topic, handler);

    client.subscribe(topic, (err) => {
        if (err) {
            console.error(`Failed subscribe topic ${topic}:`, err.message);
            return;
        }
        console.log(`MQTT subscribed: ${topic}`);
    });
};

const mqttPublish = (topic, payload, options = {}) => {
    const message = typeof payload === "string" ? payload : JSON.stringify(payload);

    client.publish(topic, message, options, (err) => {
        if (err) {
            console.error(`Failed publish to ${topic}:`, err.message);
        }
    });
};

client.on("message", async(topic, messageBuffer) => {
    const handler = routes.get(topic);

    if (!handler) {
        console.log(`No Handler registered for topic: ${topic}`);
        return;
    }

    try {
        await handler(messageBuffer.toString(), topic);
    } catch (error) {
        console.error(`Error handling topic ${topic}:` , error);
    }
});

module.exports = {
    mqttRoute,
    mqttPublish
};


const audio = require("win-audio")
const { setTimeout } = require("timers/promises")
const bootstrap = require("@artcom/bootstrap-client")
const fs = require("fs")
const config = JSON.parse(fs.readFileSync(readConfigFileArg()))

async function main() {
  const { logger, mqttClient } = await bootstrap(config.bootstrapServerUri, "microphoneController")
  logger.info("Config", config)
  mqttClient.on("offline", () => logger.error("Client is offline, Trying to reconnect"))
  const microphone = audio.mic
  await mqttClient.publish(config.currentGainTopic, microphone.get())
  mqttClient.subscribe(config.setGainTopic, async (message) => {
    logger.info("Setting microphone gain", { gain: message })
    if (microphone.get() !== -1) {
      microphone.set(message)
      while (microphone.get() !== message) {
        await setTimeout(100)
        microphone.set(message)
      }
      await mqttClient.publish(config.currentGainTopic, microphone.get())
    }
  })
}

function readConfigFileArg() {
  const args = process.argv.slice(2)[0]?.split("=")

  if (args && args.length === 2 && args[0] === "configFile") {
    return args[1]
  } else {
    return "config.json"
  }
}

main()

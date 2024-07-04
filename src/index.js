const wincmd = require("node-windows")
const bootstrap = require("@artcom/bootstrap-client")
const fs = require("fs")
const config = JSON.parse(fs.readFileSync(readConfigFileArg()))

async function main() {
  const { logger, mqttClient } = await bootstrap(config.bootstrapServerUri, "microphoneController")
  logger.info("Config", config)
  if (!config.microphoneName || config.microphoneName.length === 0) {
    logger.error("No microphone name provided")
  } else {
    mqttClient.on("offline", () => logger.error("Client is offline, Trying to reconnect"))
    logger.info("UnMuting device", { device: config.microphoneName })
    wincmd.elevate(
      `${config.svclExePath} /UnMute "${config.microphoneName}"`,
    )

    mqttClient.subscribe(config.muteTopic, async () => {
      logger.info("Muting device", { device: config.microphoneName })
      wincmd.elevate(
        `${config.svclExePath} /Mute "${config.microphoneName}"`,
      )
    })

    mqttClient.subscribe(config.unMuteTopic, () => {
      logger.info("UnMuting device", { device: config.microphoneName })
      wincmd.elevate(
        `${config.svclExePath} /UnMute "${config.microphoneName}"`,
      )
    })
  }
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

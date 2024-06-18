const audio = require("win-audio")
const wincmd = require("node-windows")
const { setTimeout } = require("timers/promises")
const bootstrap = require("@artcom/bootstrap-client")
const fs = require("fs")
const config = JSON.parse(fs.readFileSync(readConfigFileArg()))

async function main() {
  const { logger, mqttClient } = await bootstrap(config.bootstrapServerUri, "microphoneController")
  logger.info("Config", config)
  mqttClient.on("offline", () => logger.error("Client is offline, Trying to reconnect"))
  logger.info("Enabling device", { device: config.microphoneName })
  wincmd.elevate(
    `powershell.exe "Get-PnpDevice | Where-Object {$_.FriendlyName -like '${config.microphoneName} *'} | Enable-PnpDevice -Confirm:$false"`,
  )
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

  mqttClient.subscribe(config.disableTopic, async () => {
    logger.info("Disabling device")
    wincmd.elevate(
      `powershell.exe "Get-PnpDevice | Where-Object {$_.FriendlyName -like '${config.microphoneName} *'} | Disable-PnpDevice -Confirm:$false"`,
    )
  })

  mqttClient.subscribe(config.enableTopic, () => {
    logger.info("Enabling device")
    wincmd.elevate(
      `powershell.exe "Get-PnpDevice | Where-Object {$_.FriendlyName -like '${config.microphoneName} *'} | Enable-PnpDevice -Confirm:$false"`,
    )
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

const wincmd = require("node-windows")
const bootstrap = require("@artcom/bootstrap-client")
const fs = require("fs")
const config = JSON.parse(fs.readFileSync(readConfigFileArg()))

async function main() {
  const { logger, mqttClient } = await bootstrap(config.bootstrapServerUri, "microphoneController")
  logger.info("Config", config)
  mqttClient.on("offline", () => logger.error("Client is offline, Trying to reconnect"))
  logger.info("Enabling device", { device: config.microphoneName })
  wincmd.elevate(
    `powershell.exe "Get-PnpDevice | Where-Object {$_.FriendlyName -Is '${config.microphoneName}'} | Enable-PnpDevice -Confirm:$false"`,
  )

  mqttClient.subscribe(config.disableTopic, async () => {
    logger.info("Disabling device", { device: config.microphoneName })
    wincmd.elevate(
      `powershell.exe "Get-PnpDevice | Where-Object {$_.FriendlyName -Is '${config.microphoneName}'} | Disable-PnpDevice -Confirm:$false"`,
    )
  })

  mqttClient.subscribe(config.enableTopic, () => {
    logger.info("Enabling device", { device: config.microphoneName })
    wincmd.elevate(
      `powershell.exe "Get-PnpDevice | Where-Object {$_.FriendlyName -Is '${config.microphoneName}'} | Enable-PnpDevice -Confirm:$false"`,
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

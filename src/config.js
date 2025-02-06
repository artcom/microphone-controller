const fs = require("fs")
const config = JSON.parse(fs.readFileSync(readConfigFileArg()))

function readConfigFileArg() {
  const args = process.argv.slice(2)[0]?.split("=")

  if (args && args.length === 2 && args[0] === "configFile") {
    return args[1]
  } else {
    return "config.json"
  }
}

module.exports = config

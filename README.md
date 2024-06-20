# Microphone Controller

Enables or disables the microphone of a Windows machine in response to MQTT messages from a broker provided by a [bootstrap-server](https://github.com/artcom/bootstrap-server).

## Usage

### Configuration

#### Configuration file

Copy `config.json.template` to `config.json` and edit to fit your environment.

#### Command line arguments

- configFile=/path/to/config/file (default=config.json)

### Start service

```bash
npm install
npm start
```

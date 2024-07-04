# Microphone Controller

Mutes or unmutes the microphone of a Windows machine in response to MQTT messages from a broker provided by a [bootstrap-server](https://github.com/artcom/bootstrap-server).

## Dependencies

- [Nirsoft Sound Volume Command Line Tool](https://www.nirsoft.net/utils/sound_volume_command_line.htm)

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

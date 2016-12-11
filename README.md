# 🔍 ffocus

A CLI tool to temporarly disable distracting websites and boost your productivity 👌

## install

```bash
npm i ffocus -g
```

## usage

ffocus adds temporary rules to `/etc/hosts` to resolve distracting websites to `localhost`.

Because of that you need `sudo` rights to run it but don't worry it doesn't do anything nasty.

```bash
~ $ ffocus

Usage: ffocus [minutes] [host1 host2 host3 ...]

Options:

  -h, --help                output usage information
  -a, --add <host>          adds a new host
  -r, --remove <host>       removes an existing host
  -t, --duration <minutes>  sets the duration for a preset
  -p, --preset <name>       a preset
  -l, --list                lists all the presets
  -V, --version             output the version number
```

### basic usage

```bash
sudo ffocus 60 facebook.com twitter.com
```

### presets

You can create as many preset as you want.

Each preset is stored in `~/ffocus.json`
and has a name, minutes, and a list of hosts to block.

```json
{
  "work": {
    "minutes": 60,
    "sites": [
      "facebook.com",
      "twitter.com"
    ]
  }
}
```

When you `--add` a new preset ffocus creates an entry if it can't find an existing preset.

```bash
sudo ffocus -p work -a web.whatsapp.com
sudo ffocus -p work -t 30
```

and then run it

```bash
sudo ffocus -p work
```

## troubleshooting

If ffocus doesn't work you:

* are not on macos or unix
* might need to flush your DNS cache
* the browser caches too try to close it, go incognito or something
* it is fucked up and buggy – very likely

## license

MIT


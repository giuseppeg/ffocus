# 🔍 ffocus

A CLI tool to temporarly disable distracting websites and boost your productivity 👌

<img width="514" alt="screen shot 2016-12-11 at 23 21 43" src="https://cloud.githubusercontent.com/assets/711311/21083820/dc2beada-bff8-11e6-9846-334203e62e8a.png">

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

## LICENSE

```
MIT License

Copyright (c) 2016 Giuseppe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

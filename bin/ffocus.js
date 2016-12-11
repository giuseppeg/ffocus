#!/usr/bin/env node

import {exec} from 'child_process'
import program from 'commander'
import {writeFileSync} from 'fs'
import hostile from 'hostile'
import {homedir} from 'os'
import {join} from 'path'
import updateNotifier from 'update-notifier'

import pkg from '../package.json'

updateNotifier({pkg}).notify()

// load existing config if any

const configFilePath = join(homedir(), 'ffocus.json')
let config
try {
  config = require(configFilePath)
} catch(e) {
  config = {}
}
let presets = config.presets || {}


// register cleanups
process.on('SIGINT', cleanup)
process.on('uncaughtException', cleanup)


// program

log('Welcome to ffocus 👋')

program
  .usage('[minutes] [host1 host2 host3 ...]')
  .option('-a, --add <host>', 'adds a new host')
  .option('-r, --remove <host>', 'removes an existing host')
  .option('-t, --duration <minutes>', 'sets the duration for a preset')
  .option('-p, --preset <name>', 'a preset')
  .option('-l, --list', 'lists all the presets')
  .version(pkg.version)

program.parse(process.argv)


// list presets

if (program.list) {
  const availablePresets = Object.keys(presets)
  if (!availablePresets.length) {
    log('📚  No presets found.')
  } else {
    log('📚  Available presets:')
    Object.keys(presets).forEach(preset => {
      log(`📚  "${preset}" runs every ${presets[preset].minutes} minutes`)
      log(`📚  \tblocked sites:`)
      presets[preset].sites.forEach(
        site => log(`📚  \t\t${site}`)
      )
    })
  }
  process.exit(0)
}

const minutes = Number(program.args[0]) || null
const sites = program.args.length > 1 ? program.args.slice(1) : null


// parse action (add, remove or duration)

const action = [
  'add',
  'remove',
  'duration'
].reduce((acc, flag) => {
  const action = program[flag]
  if (action) {
    acc = {
      name: flag,
      value: action
    }
  }
  return acc
}, null)

if (action) {
  // actions must have a preset
  if (!program.preset) {
    error(`--${action.name} should be paired with --preset <name>`)
  }

  const dummyPreset = {
    sites: [],
    minutes: 60
  }

  const actions = {
    add: (preset, host) => {
      const original = presets[preset] || dummyPreset
      if (original.sites.indexOf(host) !== -1) {
        log(`"${preset}" already contains ${host}`)
        return original
      }
      log(`Adding ${host} to "${preset}"`)
      return {
        ...original,
        sites: original.sites.concat([host])
      }
    },
    remove: (preset, host) => {
      log(`Removing ${host} from "${preset}"`)
      const original = presets[preset] || dummyPreset
      return {
        ...original,
        sites: original.sites.filter(h => h !== host)
      }
    },
    duration: (preset, minutes) => {
      log(`Setting the duration for "${preset}" to ${minutes} minutes`)
      const mins = Number(minutes)
      if (isNaN(mins)) {
        error(`"minutes" must be a number`)
      }
      const original = presets[preset] || dummyPreset
      return {
        ...original,
        minutes: mins
      }
    }
  }

  const update = actions[action.name](
    program.preset, action.value
  )

  presets = Object.assign(
    {},
    presets,
    {
      [program.preset]: update
    }
  )

  if (!presets[program.preset]) {
    error(`preset "${program.preset}" not found`)
  }

  config = Object.assign({}, config, { presets })

  write(config, (err) => {
    if (err) {
      error(`An error occurred while saving the configuration: ${err}`)
    }
    log(`Configuration saved.`)
  })
  process.exit(0)
}


// run a preset or one-off ffocus section

let preset
if (program.preset) {
  // preset
  preset = presets[program.preset]
  if (!preset) {
    error(`preset "${program.preset}" not found`)
  }
} else {
  // one off
  if (!minutes || !sites) {
    program.help()
  }
  preset = {
    minutes,
    sites
  }
}

run(preset)


// helpers

function run({minutes, sites}) {
  if (!sites.length) {
    log(`No sites to block.`)
    process.exit(0)
  }

  sites.forEach(site => {
    try {
      hostile.set('127.0.0.1', site)
      log(`🚫  Blocking ${site}`)
    } catch(err) {
      error(err.message, true)
    }
  })

  setTimeout(() => {
    log(`👊  You're doing great!`)
    log(`👊  You've been productive for ${minutes/2} minutes`)
  }, (minutes/2) * 6e4)

  setTimeout(() => {
    log(`🙏  Congrats you managed to focus for ${minutes} minutes!`)
    cleanup()
  }, minutes * 6e4)

  log(`✅  Now focus for ${minutes} minutes.`)
}

function write(data, cb) {
  writeFileSync(
    configFilePath,
    JSON.stringify(data, null, 2),
    { flag: 'w' },
    'utf8',
    cb || function () {}
  )
}

function cleanup() {
  const allSites = Object.keys(config.presets || {}).reduce(
    (acc, preset) => {
      acc = acc.concat(presets[preset].sites)
      return acc
    }, []
  ).concat(sites).filter(Boolean)

  allSites.forEach(site => {
    try {
      hostile.remove('127.0.0.1', site)
    } catch(err) {
      error(err.message, true)
    }
  })

  process.exit(0)
}

function log(msg) {
  console.log.call(console, `🔍  ${msg}`)
}

function error(msg, sudo) {
  console.error.call(console, `☠️  ${msg}`)
  sudo && console.error('☠️  ffocus needs sudo rights to run')
  process.exit(1)
}

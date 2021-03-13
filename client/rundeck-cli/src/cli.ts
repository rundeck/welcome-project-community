import yargs from 'yargs'
yargs.scriptName('cli').commandDir('commands', {extensions: ['ts']}).demandCommand().help().argv


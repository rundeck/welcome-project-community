import {Argv} from'yargs'
import {waitForRundeckReady, updateProperty} from '../lib/util'
import { Rundeck, PasswordCredentialProvider}from 'ts-rundeck'

interface Opts {
    rundeck_url: string,
    project_name: string,
    input_value: string,
    debug: boolean
}

class ProjectUpdateCommand {
command = "update"
describe = "Update Project Settings"

builder(yargs: Argv) {
        return yargs
            .option("r", {
                alias: "rundeck_url",
                describe: "Rundeck URL",
                type: 'string',
                default: false,
                require: true
            })
            .option("p", {
                alias: "project_name",
                describe: "Project List",
                type: 'string',
                default: false,
                require: true
            })
            .option("k", {
                alias: "input_value",
                describe: "Provided Input Value",
                type: 'string',
                default: false,
                require: true
            })
            .option('debug', {
                describe: 'Debug node process',
                type: 'boolean',
                default: false
            })
    }


    async handler(opts: Opts) {
        const project_name = opts.project_name
        const input_value = opts.input_value
        const rundeckUrl = opts.rundeck_url


        const client = new Rundeck(new PasswordCredentialProvider(rundeckUrl, 'admin', 'admin'), {baseUri: rundeckUrl})
        console.log("----------++++++++++++------------")
        console.log("Update Project Script Start")
        console.log("Waiting for rundeck")
        await waitForRundeckReady(client)
        console.log("Rundeck started!!!")

        console.log("----------------------------------");
        console.log("No updates configured.");
        console.log("----------------------------------");
        /*below are examples to update project properties.*/
        /*await updateProperty(client, project_name, 'resources.source.2.config.api_key', input_value)*/
        /*await updateProperty(client, project_name, 'project.healthcheck.plugin.1.config.sensuApiKey', input_value)*/

        console.log("Update Project Finish")
        console.log("----------++++++++++++------------")


    }

}

module.exports = new ProjectUpdateCommand()

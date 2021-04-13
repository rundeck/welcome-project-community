import {Argv} from'yargs'
import {waitForRundeckReady, createStoragePassword, createProject, asyncForEach, createStoragePrivateKey, createAcl} from '../lib/util'

import { Rundeck, PasswordCredentialProvider}from 'ts-rundeck'
import Path from 'path'
import * as FS from '../async/fs'
import { JobUuidOption } from 'ts-rundeck/dist/lib/models'
import YAML from 'yaml'
import fetch from 'node-fetch';
import FormData from 'form-data';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'

interface Opts {
    rundeck_url: string,
    config_file: string,
    path: string,
    debug: boolean
}

interface Project {
    name: string,
    archive: string,
}

interface Key {
    path: string,
    type: string,
    content: string,
    file: string,
}

interface Acl{
    name: string,
    file: string,
}

class LoadProjectCommand {
command = "load"
describe = "Load list projects"

builder(yargs: Argv) {
        return yargs
            .option("r", {
                alias: "rundeck_url",
                describe: "Rundeck URL",
                type: 'string',
                default: false,
                require: true
            })
            .option("f", {
                alias: "config_file",
                describe: "Config file",
                type: 'string',
                default: false,
                require: true
            })
            .option("p", {
                alias: "path",
                describe: "Path",
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
        const rundeckUrl = opts.rundeck_url;
        const path = opts.path;
        const config_file = path + '/' + opts.config_file

        console.log("----------++++++++++++------------")
        console.log("Load Project Script Start")
        const file = await FS.readFile(config_file, 'utf8')
        const config = YAML.parse(file)

        const projects: Project[] = config.projects;
        const keys: Key[] = config.keys;
        const acls: Acl[]  = config.acls;


        const username = 'admin'
        const password = 'admin'
        const client = new Rundeck(new PasswordCredentialProvider(rundeckUrl, username, password), {baseUri: rundeckUrl})
        console.log("Waiting for Rundeck");
        await waitForRundeckReady(client);
        console.log("Rundeck started!!!");

        console.log("----------------------------------");
        console.log("Importing keys");
        console.log("----------------------------------");

        await asyncForEach(keys, async (key) => {
            console.log("Importing key" + key.path);

            if(key.type == 'password'){
                try{
                    const resp = await createStoragePassword(client, key.path, key.content);

                    if(resp.error){
                        console.error("Error creating password")
                        console.info(resp.message)
                    }
                }catch(e){
                    console.log("error importing password" + key.path + ":" + e);
                }
            }

            if(key.type == 'privateKey'){
                try{
                    const content = await FS.readFile(key.file, 'utf8')
                    const resp = await createStoragePrivateKey(client, key.path, content);
                    if(resp.error){
                        console.error("Error creating key")
                        console.info(resp.message)
                    }

                }catch(e){
                    console.log("error importing key" + key.path + ":" + e);
                }
            }


        });

        if (acls != null) {
            console.log("----------------------------------");
            console.log("importing acls");
            console.log("----------------------------------");

            await asyncForEach(acls, async (acl) => {
                console.log("importing acls " + acl.name);
                console.log("from file: " + acl.file);
                try{
                    const content = await FS.readFile(acl.file, 'utf8')
                    const resp = await createAcl(client, acl.name, content);
                    if(resp.error){
                        console.error("Error creating acls")
                        console.info(resp.message)
                    }

                }catch(e){
                    console.log("Error importing acls" + acl.name + ":" + e);
                }

            });
        }


        console.log("----------------------------------");
        console.log("creating and importing projects");
        console.log("----------------------------------");

        await asyncForEach(projects, async (project) => {
            console.log('Importing project: ' + project.name);
            console.log('archive: ' +project.archive);
            console.log("----------------------------------");


            const project_name = project.name;

            console.log("create project");
            var projectImport = false;
            try{
                const resp =  await createProject(client, project_name);

                if(resp.error){
                    console.error("Error creating project");
                    console.error(resp.message);
                } else {
                  projectImport = true;
                }
            }catch(e){
                console.error("error creating project" + project_name + ":" + e);
            }

            if(projectImport == true){
              const importFileName = Path.join(path, project.archive);

              const tokenResponse = await client.sendRequest({
                  headers: {'Content-Type': 'application/json'},
                  pathTemplate: `/api/36/tokens/{username}`,
                  pathParameters: {username: username},
                  baseUrl: rundeckUrl,
                  method: 'POST',
                  body: {
                      "user": username,
                      "roles": [
                        "admin",
                      ],
                      "duration": "30d"
                    }
                });

              let token = tokenResponse.parsedBody.token
              console.log("import project");

              try{
                  let file = await FS.readFile(importFileName);

                  const headers = {
                      'X-Rundeck-Auth-token': token,
                      'Content-Type': 'application/zip',
                  }

                  fetch(`${rundeckUrl}/api/38/project/${project_name}/import?importConfig=true&importACL=true&jobUuidOption=preserve&importWebhooks=true`,
                      { method: 'PUT', body: file, headers:headers, })
                      //.then(res => console.log(res));

              }catch(e){
                  console.log("Error importing project" + project_name + ":" + e);
              }
            }
            console.log("----------------------------------");

        });
        console.log("Load Project Script Finish");
        console.log("----------++++++++++++------------")
    }

}

module.exports = new LoadProjectCommand()

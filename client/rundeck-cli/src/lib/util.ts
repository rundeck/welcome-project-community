import {Rundeck} from 'ts-rundeck'


export function sleep(ms: number): Promise<{}> {
    return new Promise( res => {
        setTimeout(res, ms)
    })
}

export async function waitForRundeckReady(client: Rundeck, timeout = 500000) {
    const start = Date.now()
    while (Date.now() - start < timeout) {
        try {
            await client.systemInfoGet()
            return
        } catch  (e) {
            await sleep(5000)
        }
    }
    throw new Error('Timeout exceeded waiting for Rundeck to be ready.')
}


export async function createToken(baseUrl: string, client: Rundeck, timeout = 500000) {

    const resp = await client.sendRequest({
        pathTemplate: `/tokens`,
        baseUrl: `${baseUrl}/api/35`,
        method: 'POST',
        body: {user:'admin',roles: 'admin', duration:'30d'}
        });
        if (!resp.parsedBody) {
        throw new Error(`Error getting a new token`);
        }
        else {
        return resp.parsedBody;
        }
}

export async function getTokens(baseUrl: string, client: Rundeck, timeout = 500000) {

    const resp = await client.sendRequest({
        pathTemplate: `/tokens`,
        baseUrl: `${baseUrl}/api/35`,
        method: 'GET',
        });
        if (!resp.parsedBody) {
        throw new Error(`Error getting a new token`);
        }
        else {
        return resp.parsedBody;
        }
}


export async function getToken(baseUrl: string, tokenId: string, client: Rundeck, timeout = 500000) {

    const resp = await client.sendRequest({
        pathTemplate: `/token/${tokenId}`,
        baseUrl: `${baseUrl}/api/35`,
        method: 'GET',
        });
        if (!resp.parsedBody) {
        throw new Error(`Error getting a new token`);
        }
        else {
        return resp.parsedBody;
        }
}

export async function updateProperty(client: Rundeck, project: string, key:string, value: string) : Promise<any> {
    const resp = await client.projectConfigKeySet(project, key, {value})
    return resp
}

export async function createStoragePassword(client: Rundeck, path: string, file: string): Promise<any> {
    const contentType = 'application/x-rundeck-data-password'
    const resp = await client.storageKeyCreate(path, file, {contentType})
    return resp

}

export async function createStoragePrivateKey(client: Rundeck, path: string, file: string): Promise<any> {
    const contentType = 'application/octet-stream'
    let resp = await client.storageKeyCreate(path, file, {contentType})
    if (resp._response.status == 409)
        resp = await client.storageKeyUpdate(path, file, {contentType})

    return resp

}

export async function createAcl(client: Rundeck, name: string, aclContents: string): Promise<any> {
    const resp = await client.systemAclPolicyCreate(name, {systemAclPolicyCreateRequest: {contents: aclContents}})
    return resp

}



export async function createProject(client: Rundeck, name: string): Promise<any>  {
    const resp = await client.projectCreate({name})
    return resp
}

export async function asyncForEach<T>(array: Array<T>, callback: (item: T, index: number) => void) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index);
    }
}
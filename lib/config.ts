// This file will handle the loading and creation of the config file

import path from 'path'

import Conf from 'conf'

const defaultConfig: object = {
    token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    serverId: 100000000000000000,
    logChannel: 100000000000000000,
    baseRole: 'Member',
    prefix: ';',
    embedColor: '0x00b0ff',
    deleteCommandAfterExecution: true,
    database: {
        host: '127.0.0.1',
        port: 5432,
        user: process.env.USER,
        password: 'password',
        database: 'mantu'
    },
    fixer: {
        lastFetch: 10000000,
        token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    }
}

const config = new Conf({
    projectSuffix: '',
    cwd: path.join(process.cwd(), 'data'),
    defaults: defaultConfig
})

export default function loadConfig(): Conf<any> {
    return config
}

export const databaseInformation = {
    host: config.get('database.host'),
    port: config.get('database.port'),
    user: config.get('database.user'),
    database: config.get('database.database'),
    password: config.get('database.password')
}
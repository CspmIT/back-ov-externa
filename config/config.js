require('dotenv').config() // Para cargar las variables de entorno desde un archivo .env

module.exports = {
    ov_cesopol: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'ov_cesopol',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        // timezone: 'America/Argentina/Buenos_Aires',
    },
    procoop: {
        database: 'PR_MT_DEMO',
        username: 'Oficina',
        password: 'Serversql2021',
        host: '192.168.0.150',
        port: 9387,
        dialect: 'mssql',
    },
    procoopOncativo: {
        database: 'PR_ONC',
        username: 'OficinaVirtual',
        password: 'CoopTech2024*',
        host: '192.168.0.239',
        port: 1433,
        dialect: 'mssql',
    },
}

'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const date = new Date()
        await queryInterface.bulkInsert(
            'States',
            [
                {
                    cod_pro: 1,
                    des_pro: 'BUENOS AIRES',
                    cod_afip: '00',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 2,
                    des_pro: 'CAPITAL FEDERAL',
                    cod_afip: '01',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 3,
                    des_pro: 'CATAMARCA',
                    cod_afip: '02',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 4,
                    des_pro: 'CHACO',
                    cod_afip: '16',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 5,
                    des_pro: 'CHUBUT',
                    cod_afip: '17',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 6,
                    des_pro: 'CÓRDOBA',
                    cod_afip: '03',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 7,
                    des_pro: 'CORRIENTES',
                    cod_afip: '04',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 8,
                    des_pro: 'ENTRE RÍOS',
                    cod_afip: '05',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 9,
                    des_pro: 'FORMOSA',
                    cod_afip: '18',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 10,
                    des_pro: 'JUJUY',
                    cod_afip: '06',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 11,
                    des_pro: 'LA PAMPA',
                    cod_afip: '21',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 12,
                    des_pro: 'LA RIOJA',
                    cod_afip: '08',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 13,
                    des_pro: 'MENDOZA',
                    cod_afip: '07',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 14,
                    des_pro: 'MISIONES',
                    cod_afip: '19',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 15,
                    des_pro: 'NEUQUÉN',
                    cod_afip: '20',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 16,
                    des_pro: 'RÍO NEGRO',
                    cod_afip: '22',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 17,
                    des_pro: 'SALTA',
                    cod_afip: '09',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 18,
                    des_pro: 'SAN JUAN',
                    cod_afip: '10',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 19,
                    des_pro: 'SAN LUIS',
                    cod_afip: '11',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 20,
                    des_pro: 'SANTA CRUZ',
                    cod_afip: '23',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 21,
                    des_pro: 'SANTA FE',
                    cod_afip: '12',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 22,
                    des_pro: 'SANTIAGO DEL ESTERO',
                    cod_afip: '13',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 23,
                    des_pro: 'TIERRA DEL FUEGO',
                    cod_afip: '24',
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    cod_pro: 24,
                    des_pro: 'TUCUMÁN',
                    cod_afip: '14',
                    createdAt: date,
                    updatedAt: date,
                },
            ],
            {}
        )
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('States', null, {})
    },
}

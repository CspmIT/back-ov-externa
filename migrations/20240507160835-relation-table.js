'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('User_People', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            procoop_number: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            procoop_last_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            id_user: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users', // nombre de la tabla relacionada
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            level: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            primary_account: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
        // Agrega las claves foráneas a la tabla 'Address'
        await queryInterface.addColumn('Addresses', 'id_street', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Streets', // nombre de la tabla relacionada
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        })
        await queryInterface.addColumn('Addresses', 'id_city', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Cities',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        })
        await queryInterface.addColumn('Addresses', 'id_state', {
            type: Sequelize.INTEGER,
            references: {
                model: 'States',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        })

        // Agrega la clave foránea a la tabla 'City'
        await queryInterface.addColumn('Cities', 'cod_pci', {
            type: Sequelize.INTEGER,
            references: {
                model: 'States',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        })
    },

    async down(queryInterface, Sequelize) {
        // Elimina las claves foráneas de la tabla 'Address'
        await queryInterface.removeColumn('Addresses', 'id_street')
        await queryInterface.removeColumn('Addresses', 'id_city')
        await queryInterface.removeColumn('Addresses', 'id_state')

        // Elimina la clave foránea de la tabla 'City'
        await queryInterface.removeColumn('Cities', 'cod_pci')

        await queryInterface.dropTable('User_People')
    },
}

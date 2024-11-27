'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Service_Requests', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            procoop_cod_per: {
                type: Sequelize.INTEGER,
                references: { model: 'People', key: 'id' },
            },
            id_user: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                allowNull: false,
            },
            status: {
                type: Sequelize.TINYINT,
                allowNull: false,
            },
            return_later: {
                type: Sequelize.TINYINT,
                allowNull: false,
                defaultValue: 0,
            },
            step: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            person_data: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            responsible: {
                type: Sequelize.INTEGER,
                allowNull: true,
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

        await queryInterface.addConstraint('Service_Requests', {
            fields: ['id_user'],
            type: 'foreign key',
            name: 'fk_id_user',
            references: {
                table: 'Users',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        })

        await queryInterface.addConstraint('Service_Requests', {
            fields: ['responsible'],
            type: 'foreign key',
            name: 'fk_responsible',
            references: {
                table: 'Users',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Service_Requests')
    },
}

'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			fullname: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			day_of_birth: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			address: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			phone: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			gender: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			country: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			account_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Accounts',
					key: 'id',
				},
				onDelete: 'CASCADE',
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Users')
	},
}

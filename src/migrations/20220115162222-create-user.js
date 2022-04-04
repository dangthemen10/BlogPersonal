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
			email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			username: {
				type: Sequelize.STRING,
			},
			fullname: {
				type: Sequelize.STRING,
			},
			day_of_birth: {
				type: Sequelize.DATE,
			},
			address: {
				type: Sequelize.STRING,
			},
			phone: {
				type: Sequelize.INTEGER,
			},
			gender: {
				type: Sequelize.STRING,
			},
			country: {
				type: Sequelize.STRING,
			},
			account_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Accounts',
					key: 'id',
				},
				onDelete: 'CASCADE',
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
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Users')
	},
}

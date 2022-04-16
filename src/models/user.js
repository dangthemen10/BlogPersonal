const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.belongsTo(models.Account, {
				foreignKey: 'accountId',
				targetKey: 'id',
				as: 'fk_user_acc',
				foreignKeyConstraint: true,
			})
		}
	}
	User.init(
		{
			email: DataTypes.STRING,
			userName: DataTypes.STRING,
			fullName: DataTypes.STRING,
			birthDay: DataTypes.DATE,
			address: DataTypes.STRING,
			phone: DataTypes.INTEGER,
			gender: DataTypes.STRING,
			country: DataTypes.STRING,
			accountId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'User',
		}
	)
	return User
}

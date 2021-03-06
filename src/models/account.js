const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Account extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Account.hasOne(models.User, {
				foreignKey: 'accountId',
				as: 'fk_acc_user',
			})
		}
	}
	Account.init(
		{
			email: DataTypes.STRING,
			userName: DataTypes.STRING,
			password: DataTypes.STRING,
			role: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Account',
		}
	)
	return Account
}

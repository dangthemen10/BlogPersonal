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
				foreignKey: 'account_id',
				targetKey: 'id',
				as: 'fk_user_acc',
				foreignKeyConstraint: true,
			})
		}
	}
	User.init(
		{
			email: DataTypes.STRING,
			username: DataTypes.STRING,
			fullname: DataTypes.STRING,
			day_of_birth: DataTypes.DATE,
			address: DataTypes.STRING,
			phone: DataTypes.INTEGER,
			gender: DataTypes.STRING,
			country: DataTypes.STRING,
			account_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'User',
		}
	)
	return User
}

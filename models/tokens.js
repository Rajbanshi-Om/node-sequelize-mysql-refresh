'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tokens.belongsTo(models.User, {
        foreignKey: 'id',
        target_Key:'userId'
      })
      models.User.hasMany(Tokens, {
        foreignKey:'userId'
      })
    }
  }
  Tokens.init({
    // userId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'User',
    //     key:'id'
    //   }
    // },
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tokens',
  });
  return Tokens;
};
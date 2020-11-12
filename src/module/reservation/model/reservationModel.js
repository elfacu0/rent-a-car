const { DataTypes, Model } = require('sequelize');

class ReservationModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   */
  static setup(sequelizeInstance) {
    ReservationModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
          unique: true,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        finishDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        pricePerDay: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        totalPrice: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        paymentMethod: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        paid: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Reservation',
      }
    );

    return ReservationModel;
  }

  /**
   * @param {typeof import('../../car/model/carModel')} CarModel
   * @param {typeof import('../../user/model/userModel')} UserModel
   */
  static setupAssociations(CarModel, UserModel) {
    CarModel.hasMany(ReservationModel, { foreignKey: 'carId', constraints: false });
    ReservationModel.belongsTo(CarModel, { foreignKey: 'carId', constraints: false });
    UserModel.hasMany(ReservationModel, { foreignKey: 'userId', constraints: false });
    ReservationModel.belongsTo(UserModel, { foreignKey: 'userId', constraints: false });
  }
}

module.exports = ReservationModel;

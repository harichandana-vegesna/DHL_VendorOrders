import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ExpTmsDataAttributes {
  id: number;
  message: object;
  shipment_Tracking_Number: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type ExpTmsDataPk = "id";
export type ExpTmsDataId = ExpTmsData[ExpTmsDataPk];
export type ExpTmsDataOptionalAttributes = "id" | "createdAt" | "updatedAt" | "deletedAt";
export type ExpTmsDataCreationAttributes = Optional<ExpTmsDataAttributes, ExpTmsDataOptionalAttributes>;

export class ExpTmsData extends Model<ExpTmsDataAttributes, ExpTmsDataCreationAttributes> implements ExpTmsDataAttributes {
  id!: number;
  message!: object;
  shipment_Tracking_Number!: string;
  status!: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof ExpTmsData {
    ExpTmsData.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    message: {
      type: DataTypes.JSON,
      allowNull: false
    },
    shipment_Tracking_Number: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'exp_tms_data',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return ExpTmsData;
  }
}

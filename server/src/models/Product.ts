import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface ProductAttributes {
  id: number;
  type: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  image: string;
  tax: number;
}

interface ProductCreationAttributes extends Omit<ProductAttributes, 'id'> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> {
  public id!: number;
  public type!: string;
  public title!: string;
  public description!: string;
  public price!: number;
  public thumbnail!: string;
  public image!: string;
  public tax!: number;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
  }
); 
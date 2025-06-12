import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
export class Product extends Model {
}
Product.init({
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
}, {
    sequelize,
    tableName: 'products',
    timestamps: true,
});

import { Model, DataTypes, Sequelize } from 'sequelize';

interface ContactFormAttributes {
  id?: number;
  name: string;
  email: string;
  message: string;
  status?: string;
  submittedAt?: Date;
  updatedAt?: Date;
}

export class ContactForm extends Model<ContactFormAttributes> implements ContactFormAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public message!: string;
  public status!: string;
  public submittedAt!: Date;
  public updatedAt!: Date;
}

export function initContactForm(sequelize: Sequelize): typeof ContactForm {
  ContactForm.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'contact_forms',
      timestamps: true,
      createdAt: 'submittedAt',
    }
  );

  return ContactForm;
} 
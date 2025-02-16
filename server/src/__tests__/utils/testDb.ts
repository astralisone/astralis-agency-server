import { Sequelize } from 'sequelize';
import { Product } from '../../models/Product';

export const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

export const setupTestDb = async () => {
  await Product.init(
    Product.getAttributes(),
    {
      sequelize: testSequelize,
      tableName: 'products'
    }
  );
  await testSequelize.sync({ force: true });
};

export const closeTestDb = async () => {
  await testSequelize.close();
}; 
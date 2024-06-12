const Sequelize = require('sequelize');
let sequelize;

if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PW,
    {
      host: 'localhost',
      dialect: 'postgres',
    },
  );
}
const Entity = sequelize.define('entity', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Attribute = sequelize.define('attribute', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Entity.hasMany(Attribute);
Attribute.belongsTo(Entity);

module.exports = {
  sequelize,
  Entity,
  Attribute
};

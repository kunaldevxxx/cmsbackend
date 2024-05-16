const Sequelize = require('sequelize');
const sequelize = new Sequelize('cms', 'postgres', 'postgres', {
  dialect: 'postgres',
  host: 'localhost'
});

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

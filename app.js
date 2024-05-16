const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models'); 
const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/entities', require('../cmsbackend/routes/entity'));

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Error syncing database:', err));

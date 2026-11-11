require('dotenv').config({ quiet: true });
const { sequelize } = require('../src/models');

sequelize.sync()
  .then(() => console.log('Base de datos SQLite lista.'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());

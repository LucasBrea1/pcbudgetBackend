const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    connectionString: 'postgresql://pcbudgetdb_user:B44oPIB6skouDcvdQQgbR91NQxppgMnV@dpg-cselb5m8ii6s73967ku0-a.oregon-postgres.render.com/pcbudgetdb',
    ssl: {
      rejectUnauthorized: false,
  },
  });

client.connect()
  .then(() => console.log('Conectado a la base de datos'))
  .catch((err) => console.error('Error de conexión', err));

module.exports = client;
const express = require('express')
const routes = require('./src/routes/users')
const dotenv = require('dotenv')
const cors = require('cors')
const client = require('./db');

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../../db');

const getUsers = async (req, res) => {
    try {
        const selectQuery = `SELECT * FROM users`;
        const result = await client.query(selectQuery);

        if (result.rows.length > 0) {
            res.status(200).json(result.rows)
        } else {
            res.status(404).json({ message: 'No se encontraron usuarios' });
        }
      } catch (err) {
        console.error('Error al consultar el registro', err);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    };





const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

    try {
        const selectQuery = `SELECT * FROM users WHERE email = $1`;
        const values = [email];
        const result = await client.query(selectQuery, values);

        if (result.rows.length > 0) {
          const user = result.rows[0];

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
          }

          const token = jwt.sign({ id: user.id, email: user.email }, 'yourSecretKey', { expiresIn: '1h' });

          res.status(200).json({ user, token });
        } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
        }
      } catch (err) {
        console.error('Error al consultar el registro', err);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
};


const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
  }


    try {
    
        const hashedPassword = await bcrypt.hash(password, 10);

        const token = jwt.sign({ email }, 'yourSecretKey', { expiresIn: '1h' });

        const insertQuery = `
          INSERT INTO users (name, email, password, token)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;
        const values = [name, email, hashedPassword, token];
        
        const existingUser = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
        return res.status(409).json({ message: 'El email ya está registrado' });
        }

        const result = await client.query(insertQuery, values);

        

        res.status(201).json({ user: result.rows[0], token });
      } catch (err) {
        console.error('Error al insertar el registro', err);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
}

module.exports = {
    getUsers,
    login,
    register
}
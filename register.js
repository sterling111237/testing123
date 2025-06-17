const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 4000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json()); // needed to parse req.body

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Yaomingers10983',
  port: 5432,
});


app.post('/user', async (req, res) => {
  const { username, password, age, gender, email } = req.body;

  if (!username || !password || !age || !gender || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (username, password, age, gender, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [username, hashedPassword, age, gender, email];

    const { rows } = await pool.query(query, values);
    res.status(201).json({ message: 'User created successfully', user: rows[0] });
  } catch (error) {
    console.error('Error inserting user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

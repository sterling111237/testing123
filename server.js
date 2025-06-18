const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

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

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT password FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).send('Invalid credentials');

    const match = await bcrypt.compare(password, result.rows[0].password);
    if (match) res.send('success');
    else res.status(401).send('Invalid credentials');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/loginAdmin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT password, admin FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) return res.status(401).send('Invalid credentials');

    const isAdmin = result.rows[0].admin;
    const hashedPassword = result.rows[0].password;

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) return res.status(401).send('Invalid credentials');
    if (!isAdmin) return res.status(403).send('Not an admin');

    return res.send('success');

  } catch (err) {
    console.error('Error during admin login:', err.message);
    res.status(500).send('Server error');
  }
});



// Product listing route
app.get('/items', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.product_id,
        p.product_name,
        p.location,
        p.condition,
        p.release_date,
        p.price,
        p.image_url,
        c.category_name,
        s.subcategory_name
      FROM ITEMS p
      JOIN categories c ON p.category_id = c.category_id
      JOIN subcategories s ON p.subcategory_id = s.subcategory_id
      ORDER BY p.product_id;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



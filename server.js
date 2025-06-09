const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Allow requests from your frontend origin (adjust or use '*' for testing)
app.use(cors({
  origin: '*'
}));

// PostgreSQL connection pool (update with your DB credentials)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123',
  port: 5432,
});

// API endpoint to get products with category and subcategory names
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

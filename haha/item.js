// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 9000;

// Allow requests from your frontend origin (adjust or use '*' for testing)
app.use(cors({
  origin: '*'
}));

// PostgreSQL connection setup
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "123",
  port: 5432,
});

app.get('/itemInfo/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await pool.query(`
      SELECT 
        p.product_id,
        p.product_name,
        p.location,
        p.condition,
        p.release_date,
        p.price,
        p.image_url,
        p.item_description,
        p.user_id,
        c.category_name,
        s.subcategory_name
      FROM ITEMS p
      JOIN categories c ON p.category_id = c.category_id
      JOIN subcategories s ON p.subcategory_id = s.subcategory_id
      WHERE p.product_id = $1`,
      [productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No product found with that ID.' });
    }

    res.json(result.rows[0]); // Only send this once
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

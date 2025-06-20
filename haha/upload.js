const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// PostgreSQL config
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123',
  port: 5432,
});

client.connect();

// POST /upload endpoint
app.post('/upload', async (req, res) => {
  const {
    productName,
    location,
    price,
    condition,
    imageUrl,
    description,
    category,
    subcategory,
    userId
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO items 
        (product_name, location, price, condition, image_url, item_description, category_id, subcategory_id, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [productName, location, price, condition, imageUrl, description, category, subcategory,userId]
    );

    res.status(200).json({
      message: 'Post created successfully!',
      item: result.rows[0]
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});

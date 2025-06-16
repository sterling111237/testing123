const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123',
  port: 5432,
});

app.post('/update-product', async (req, res) => {
  const {
    productId,
    productName,
    location,
    condition,
    price,
    imageUrl,
    description,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE items SET
         product_name = COALESCE(NULLIF($1, ''), product_name),
         location = COALESCE(NULLIF($2, ''), location),
         condition = COALESCE(NULLIF($3, ''), condition),
         price = COALESCE(NULLIF($4, '')::numeric, price),
         image_url = COALESCE(NULLIF($5, ''), image_url),
         item_description = COALESCE(NULLIF($6, ''), item_description)
       WHERE product_id = $7`,
      [productName, location, condition, price, imageUrl, description, productId]
    );

    if (result.rowCount === 0) {
      res.json({ message: 'No product found with that ID.' });
    } else {
      res.json({ message: 'Product updated successfully.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating product.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

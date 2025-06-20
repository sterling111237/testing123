const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path')

const app = express();
const port = 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json()); // needed to parse req.body
app.use(express.urlencoded({extended:true}))
// app.use(express.static(path.join(__dirname, `public`,`public`)))
// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Yaomingers10983',
  port: 5432,
});

app.get('/login',(req,res)=>{  
  res.sendFile(path.join(__dirname, `public`,`login.html`))
})

app.get('/register',(req,res)=>{  
  res.sendFile(path.join(__dirname, `public`,`register.html`  ))
})
app.get('/loginAdmin',(req,res)=>{  
  res.sendFile(path.join(__dirname, `public`,`loginAdmin.html`  ))
})
app.get('/dashboard',(req,res)=>{  
  res.sendFile(path.join(__dirname, `public`,`index.html`  ))
})
app.get('/profile',(req,res)=>{  
  res.sendFile(path.join(__dirname, `public`,`profile.html`  ))
})
app.get('/member',(req,res)=>{  
  res.sendFile(path.join(__dirname, `public`,`member.html`  ))
})
app.get('/myproducts',(req,res)=>{  
  res.sendFile(path.join(__dirname, `public`,`myproduct.html`  ))
})
app.get('/adminPanel',(req,res)=>{  
  res.sendFile(path.join(__dirname, `public`,`adminPanel.html`  ))
})
app.get('/upload',(req,res)=>{  
  res.sendFile(path.join(__dirname, `public`,`upload.html`  ))
})
app.get('/items',(req,res)=>{  
  res.sendFile(path.join(__dirname, `public`,`item.html`  ))
})
app.get('/uploadprep',(req,res)=>{  
  res.sendFile(path.join(__dirname, `public`,`uploadprep.html`  ))
})
// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT password FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).send('Invalid credentials');

    const match = await bcrypt.compare(password, result.rows[0].password);
    if (match) {
      //res.redirect(`/dashboard`);
      return res.send('success');
    }
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


//post untuk register user baru
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
    // res.status(201).json({ message: 'User created successfully qqq', user: rows[0] });
    res.redirect(`/login`)
  } catch (error) {
    console.error('Error inserting user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

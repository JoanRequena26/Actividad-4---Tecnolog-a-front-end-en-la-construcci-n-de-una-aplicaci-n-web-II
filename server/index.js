const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db, init } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialize DB & seed
init();

/**
 * PRODUCTS
 */
app.get('/products', (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY name').all();
  res.json(rows);
});

app.get('/products/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

app.post('/products', (req, res) => {
  const { name, category, stock = 0, price = 0, cost = 0 } = req.body;
  const stmt = db.prepare('INSERT INTO products (name, category, stock, price, cost) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(name, category, stock, price, cost);
  const newProd = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(newProd);
});

app.put('/products/:id', (req, res) => {
  const { name, category, stock, price, cost } = req.body;
  db.prepare(`
    UPDATE products SET name = ?, category = ?, stock = ?, price = ?, cost = ? WHERE id = ?
  `).run(name, category, stock, price, cost, req.params.id);
  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(updated);
});

app.delete('/products/:id', (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

/**
 * CLIENTS
 */
app.get('/clients', (req, res) => {
  const rows = db.prepare('SELECT * FROM clients ORDER BY name').all();
  res.json(rows);
});

app.post('/clients', (req, res) => {
  const { name, email = '', phone = '' } = req.body;
  const stmt = db.prepare('INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)');
  const info = stmt.run(name, email, phone);
  const c = db.prepare('SELECT * FROM clients WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(c);
});

app.delete('/clients/:id', (req, res) => {
  const id = Number(req.params.id);
  if (id === 1) return res.status(400).json({ error: 'Cannot delete default client' });
  db.prepare('DELETE FROM clients WHERE id = ?').run(id);
  res.status(204).end();
});

/**
 * EXPENSES
 */
app.get('/expenses', (req, res) => {
  const rows = db.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
  res.json(rows);
});

app.post('/expenses', (req, res) => {
  const { description, amount, category, date } = req.body;
  const stmt = db.prepare('INSERT INTO expenses (description, amount, category, date) VALUES (?, ?, ?, ?)');
  const info = stmt.run(description, amount, category, date);
  const e = db.prepare('SELECT * FROM expenses WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(e);
});

app.delete('/expenses/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

/**
 * SALES
 */
app.get('/sales', (req, res) => {
  const sales = db.prepare('SELECT * FROM sales ORDER BY date DESC').all();
  const saleItemsStmt = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?');
  const result = sales.map(s => {
    s.items = saleItemsStmt.all(s.id);
    return s;
  });
  res.json(result);
});

app.post('/sales', (req, res) => {
  // Expect payload: { clientId, clientName, items: [{id, name, price, qty}], subtotal, tax, total }
  const { clientId = null, clientName = 'Cliente General', items = [], subtotal = 0, tax = 0, total = 0 } = req.body;

  const insertSale = db.prepare('INSERT INTO sales (date, client_id, client_name, subtotal, tax, total) VALUES (?, ?, ?, ?, ?, ?)');
  const insertItem = db.prepare('INSERT INTO sale_items (sale_id, product_id, name, price, qty) VALUES (?, ?, ?, ?, ?)');
  const updateProduct = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

  const now = new Date().toISOString();

  const txn = db.transaction(() => {
    const info = insertSale.run(now, clientId, clientName, subtotal, tax, total);
    const saleId = info.lastInsertRowid;

    for (const it of items) {
      insertItem.run(saleId, it.id, it.name, it.price, it.qty);
      updateProduct.run(it.qty, it.id);
      db.prepare('UPDATE products SET stock = CASE WHEN stock < 0 THEN 0 ELSE stock END WHERE id = ?').run(it.id);
    }

    if (clientId) {
      db.prepare('UPDATE clients SET total_spent = IFNULL(total_spent, 0) + ? WHERE id = ?').run(total, clientId);
    }

    return saleId;
  });

  try {
    const saleId = txn();
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(saleId);
    sale.items = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(saleId);
    res.status(201).json(sale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error processing sale' });
  }
});

app.delete('/sales/:id', (req, res) => {
  const saleId = Number(req.params.id);
  const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(saleId);
  if (!sale) return res.status(404).json({ error: 'Sale not found' });

  const items = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(saleId);
  const txn = db.transaction(() => {
    // revert product stock
    for (const it of items) {
      db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(it.qty, it.product_id);
    }
    // adjust client total_spent
    if (sale.client_id) {
      db.prepare('UPDATE clients SET total_spent = total_spent - ? WHERE id = ?').run(sale.total || 0, sale.client_id);
    }
    // delete items and sale
    db.prepare('DELETE FROM sale_items WHERE sale_id = ?').run(saleId);
    db.prepare('DELETE FROM sales WHERE id = ?').run(saleId);
  });

  try {
    txn();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting sale' });
  }
});

/**
 * Utility endpoints
 */
app.get('/seed', (req, res) => {
  // WARNING: resets DB content
  db.prepare('DELETE FROM sale_items').run();
  db.prepare('DELETE FROM sales').run();
  db.prepare('DELETE FROM products').run();
  db.prepare('DELETE FROM clients').run();
  db.prepare('DELETE FROM expenses').run();
  // re-seed
  init();
  res.json({ ok: true, message: 'DB reseeded' });
});

app.listen(PORT, () => {
  console.log(`PyME backend listening on http://localhost:${PORT}`);
});

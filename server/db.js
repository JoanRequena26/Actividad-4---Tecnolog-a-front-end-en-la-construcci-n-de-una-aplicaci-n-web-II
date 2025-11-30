const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

// Initialize schema & seed if empty
function init() {
  // Products
  db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      stock INTEGER DEFAULT 0,
      price REAL DEFAULT 0,
      cost REAL DEFAULT 0
    )
  `).run();

  // Clients
  db.prepare(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      total_spent REAL DEFAULT 0
    )
  `).run();

  // Sales
  db.prepare(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY,
      date TEXT NOT NULL,
      client_id INTEGER,
      client_name TEXT,
      subtotal REAL,
      tax REAL,
      total REAL
    )
  `).run();

  // Sale items
  db.prepare(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY,
      sale_id INTEGER NOT NULL,
      product_id INTEGER,
      name TEXT,
      price REAL,
      qty INTEGER
    )
  `).run();

  // Expenses
  db.prepare(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY,
      description TEXT,
      amount REAL,
      category TEXT,
      date TEXT
    )
  `).run();

  // Seed basic data if products table empty
  const row = db.prepare('SELECT COUNT(*) AS c FROM products').get();
  if (row.c === 0) seed();
}

function seed() {
  const insertProduct = db.prepare(`INSERT INTO products (id, name, category, stock, price, cost) VALUES (?, ?, ?, ?, ?, ?)`);

  insertProduct.run(1715, 'Camiseta Básica', 'Ropa', 50, 99900, 45000);
  insertProduct.run(1716, 'Pantalón Jean', 'Ropa', 20, 180000, 90000);
  insertProduct.run(1717, 'Zapatillas Deportivas', 'Calzado', 5, 350000, 175000);
  insertProduct.run(1718, 'Gorra Logo', 'Accesorios', 100, 50000, 15000);

  const insertClient = db.prepare(`INSERT INTO clients (id, name, email, phone, total_spent) VALUES (?, ?, ?, ?, ?)`);
  insertClient.run(1, 'Cliente General', '', '', 0);

  const insertExpense = db.prepare(`INSERT INTO expenses (description, amount, category, date) VALUES (?, ?, ?, ?)`);
  insertExpense.run('Alquiler Local', 2000000, 'Operativo', '2023-10-01');
  insertExpense.run('Internet', 120000, 'Servicios', '2023-10-05');
}

module.exports = {
  db,
  init
};



const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'clinicdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// Create patients table if not exists
async function initializeDB() {
    const conn = await pool.getConnection()
    try {
        await conn.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender VARCHAR(50) NOT NULL,
        location VARCHAR(255) NOT NULL,
        severity VARCHAR(50) NOT NULL,
        bodyPart VARCHAR(100) NOT NULL,
        description TEXT,
        requiredAction TEXT,
        doctor VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
        console.log('Database initialized')
    } finally {
        conn.release()
    }
}

initializeDB()

// API Routes
app.get('/api/patients', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM patients')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/patients', async (req, res) => {
    try {
        const { name, age, gender, time, location, severity, bodyPart, description, requiredAction, doctor } = req.body;

        const [result] = await pool.query(
            'INSERT INTO patients (name, age, gender, time, location, severity, bodyPart, description, requiredAction, doctor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, age, gender, time, location, severity, bodyPart, description, requiredAction, doctor]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, gender, time, location, severity, bodyPart, description, requiredAction } = req.body;

        await pool.query(
            'UPDATE patients SET name=?, age=?, gender=?, time=?, location=?, severity=?, bodyPart=?, description=?, requiredAction=? WHERE id=?',
            [name, age, gender, time, location, severity, bodyPart, description, requiredAction, id]
        );
        res.status(200).json({ message: 'Patient updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM patients WHERE id=?', [id])
        res.status(200).json({ message: 'Patient deleted' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
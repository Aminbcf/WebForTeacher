

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
        createdAt DATETIME  DEFAULT CURRENT_TIMESTAMP
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
// Modified POST endpoint
app.post('/api/patients', async (req, res) => {
    try {
        const { name, age, gender, time, location, severity, bodyPart, description, requiredAction, doctor } = req.body;

        // Convert to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
        const mysqlTime = formatDateForMySQL(time);

        const [result] = await pool.query(
            'INSERT INTO patients SET ?',
            {
                name,
                age,
                gender,
                time: mysqlTime,
                location: location || null,
                severity: severity || null,
                bodyPart: bodyPart || null,
                description: description || null,
                requiredAction: requiredAction || null,
                doctor: doctor || null
            }
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Database error:', {
            inputData: req.body,
            error: error.message,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({
            error: 'Failed to save patient',
            details: error.sqlMessage || error.message
        });
    }
});

// Helper function
function formatDateForMySQL(dateString) {
    const date = new Date(dateString);

    // Manual formatting to ensure MySQL compatibility
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Do the SAME change for your PUT endpoint
app.put('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, gender, time, location, severity, bodyPart, description, requiredAction } = req.body;

        // Same conversion as above
        const mysqlTime = new Date(time).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/, '$3-$1-$2 $4');

        await pool.query(
            'UPDATE patients SET name=?, age=?, gender=?, time=?, location=?, severity=?, bodyPart=?, description=?, requiredAction=? WHERE id=?',
            [name, age, gender, mysqlTime, location, severity, bodyPart, description, requiredAction, id]
        );
        res.status(200).json({ message: 'Patient updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get all doctors (for dropdown)

app.get('/api/doctors', async (req, res) => {
    try {
        const [doctors] = await pool.query('SELECT id, email FROM doctors');
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
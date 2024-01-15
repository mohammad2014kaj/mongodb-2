// app.js
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Middleware for parsing form data

// MongoDB connection URI - Replace with your actual MongoDB Atlas connection string
const uri = 'mongodb+srv://mohammadasgarpoor:VyJDm9yseMlEKFv4@firstcluster.qsmet13.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

connectToDatabase();

// Routes
app.get('/', (req, res) => {
    res.render('welcome');
});

app.get('/information-form', (req, res) => {
    res.render('information-form');
});

app.post('/submit-information', async (req, res) => {
    const { name, family, age, number, email } = req.body;

    // Insert the data into MongoDB
    const database = client.db('information'); // Use your actual database name
    const collection = database.collection('personalInformation');

    try {
        const result = await collection.insertOne({
            name,
            family,
            age: parseInt(age),
            number,
            email,
        });

        console.log(`Inserted ${result.insertedCount} document(s) into the collection`);
    } catch (error) {
        console.error('Error inserting document:', error.message);
    }

    res.redirect('/database-report'); // Redirect to the database report page after submission
});

app.get('/database-report', async (req, res) => {
    const database = client.db('information'); // Use your actual database name
    const collection = database.collection('personalInformation');

    try {
        const entries = await collection.find().toArray();
        res.render('database-report', { entries });
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

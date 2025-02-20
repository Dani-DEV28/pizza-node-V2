//Import Express
import express from 'express';
import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'pizza'
});

async function connect() {
    try{
        const conn = await pool.getConnection();
        console.log('Connected to the database');
        return conn;
    }catch (err){
        console.log(`Error connecting to the database ${err}`);
    }
}

//Instantiate an Express application
const app = express();

//Serve static files from the 'public' directory
app.use(express.static('public'));

// set the view engine for out application
app.set('view engine', 'ejs');

//Define a port number for our server to listen on
const PORT = 3000;

//Define a "default" route for our home page
app.get('/', (req, res) => {

    // Send our home page as a response to the client
    res.render('home');
});

//Define an admin route
app.get('/admin', async (req, res) => {
    const conn = await connect();
    const orders = await conn.query('SELECT * FROM orders;')

    console.log(orders);

    res.render('order-summary', { orders });
});

//Define a "thank you" route
app.post('/thankyou', (req, res) => {

    // Send our thank you page
    res.sendFile(`${import.meta.dirname}/views/thankyou.html`);
});

//Tell the server to listen on our specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.post('/thankyou', async (req, res) => {

    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size
    };

    const conn = await connect();

    const result = validateForm(order);
    if(!result.isValid){
        console.log(result.erros);
        res.send(result.errors);
        return;
    }

    if(order.toppings){
        if(Array.isArray(order.toppings)){
            order.toppings = order.toppings.join(",");
        }
    }else {
        order.toppings = ""
    }
    // order.toppings = order.toppings ? order.toppings.join(",") : "";

    const insertQuery = await conn.query(`
        INSERT INTO orders (
            firstName,
            lastName,
            email,
            method,
            toppings,
            size
        ) VALUES (
            ?,?,?,?,?,?)`,
            
            [order.fname,
            order.lname,
            order.email,
            order.method,
            order.toppings,
            order.size]
        );

    // console.log(orders);

    // Send our thank you page
    res.render('thankyou', { order });
});

function validateForm(data) {
    const errors = [ ];

    if(!data.email || data.email.trim() == ""|| data.email.indexOf("@") === -1 || data.email.indexOf(".") === -1){
        errors.push("Email is required");
    }

    if(!data.lname || data.lname.trim() == ""){
        errors.push("Last name is required");
    }

    if(!data.fname || data.fname.trim() == ""){
        errors.push("First name is required");
    }

    if(!data.method){
        errors.push("Delivery Option Required");
    } else {
        const validOptions = ["pickup","delivery"];
        if(!validOptions.includes(data.method)){
            errors.push("Buahaha");
        }
    }

    if(!data.size || data.size === "none"){
        errors.push("Size require");
    } else {
        const validOptions = ["small","med","large"];
        if(!validOptions.includes(data.size)){
            errors.push("Buahaha");
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

//Tell the server to listen on our specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


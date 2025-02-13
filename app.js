//Import Express
import express from 'express';

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
    res.sendFile(`${import.meta.dirname}/views/home.html`);
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


const express = require('express');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Use EJS as the view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    // Get all the files in the "cards" directory
    fs.readdir('cards', (err, files) => {
        if (err) {
            return res.status(500).send({ error: 'Error reading directory' });
        }

        // Get a random file from the array of files
        const randomFile = files[Math.floor(Math.random() * files.length)];

        // Read the contents of the file
        fs.readFile(`cards/${randomFile}`, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send({ error: 'Error reading file' });
            }

            // Parse the JSON string from the file
            const card = JSON.parse(data);

            // Render the "home" view and pass the card data
            res.render('home', card);
        });
    });
});

app.get('/add-user', (req, res) => {
    // Get a random number between 0 and 9 (both inclusive)
    const randomNumber = Math.floor(Math.random() * 10);
    const imageURL = `https://randomuser.me/api/portraits/lego/${randomNumber}.jpg`

    res.render('add-user', {
        image: imageURL,
        name: '',
        quote: ''
    });
});

app.post('/submit-user', (req, res) => {
    // Get the name and quote from the request body
    const { name, quote, image } = req.body;

    // Validate the name and quote
    if (!name || !quote) {
        return res.status(400).send({ error: 'Name and quote are required' });
    }

    // Create a card object with the name and quote
    const card = { name, quote, image };

    // Convert the card object to a JSON string
    const cardJson = JSON.stringify(card);

    // Write the JSON string to a file in the "cards" directory
    fs.writeFile(`cards/${uuidv4()}.json`, cardJson, (err) => {
        if (err) {
            return res.status(500).send({ error: 'Error writing file' });
        }
        // Redirect the user to the home page
        res.redirect('/');
    });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

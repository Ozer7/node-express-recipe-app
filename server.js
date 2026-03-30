const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'YOUR_APP_PASSWORD'
  }
});


let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'recipecentral'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Homepage'
  });
});

app.get('/recipes', (req, res) => {
  res.render('recipes', {
    title: 'Recipes'
  });
});


app.get('/contactus', (req, res) => {
  const { name, email, message, submit } = req.query;

  if (submit) {
    const mailOptions = {
      from: 'your_email@gmail.com',
      to: 'your_email@gmail.com',
      subject: 'Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        // Render page with error message
        return res.render('contactus', { 
          title: 'Contact Us',
          errorMessage: 'Error sending email: ' + err.message
        });
      }
      // Render page with success message,
      res.render('contactus', { 
        title: 'Contact Us',
        successMessage: `Thank you ${name}, your message has been sent!`
      });
    });
  } else {
    // Show the form without any message
    res.render('contactus', { title: 'Contact Us' });
  }
});

app.get('/addAccount', (req, res) => {
  const query = req.query;

  if (query.submit) {
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    con.query(sql, [query.username, query.password], function(err) {
      if (err) {
        return showPage(res, 'Duplicate Username');
      }
      showPage(res);
    });
  } else {
    showPage(res);
  }
});

function showPage(res, errorMessage = '') {
  con.query("SELECT username, password FROM users ORDER BY userid DESC", function(err, results) {
    if (err) throw err;

    res.render('addAccount', {
      title: 'Add Account',
      users: results,
      errorMessage
    });
  });
}


const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});


/*
const express = require('express');
const people = require('./people.json');

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Homepage',
    people: people.profiles
  });
});
app.get('/profile', (req, res) => {
  const person = people.profiles.find(p => p.id === req.query.id);
  res.render('profile', {
    title: `About ${person.firstname} ${person.lastname}`,
    person,
  });
});
*/
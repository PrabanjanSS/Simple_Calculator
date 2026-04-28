// simple backend server for calculator
// fixed version for deployment (Render compatible)

const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

// middleware to read JSON
app.use(express.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// calculator logic
app.post('/calculate', function(req, res) {

    var num1 = parseFloat(req.body.num1);
    var num2 = parseFloat(req.body.num2);
    var op   = req.body.operator;

    var result = 0;
    var error  = "";

    if (op == '+') {
        result = num1 + num2;
    }
    else if (op == '-') {
        result = num1 - num2;
    }
    else if (op == '*') {
        result = num1 * num2;
    }
    else if (op == '/') {
        if (num2 == 0) {
            error = "Cannot divide by zero!";
        } else {
            result = num1 / num2;
        }
    }
    else {
        error = "Invalid operator";
    }

    if (error != "") {
        res.json({ success: false, message: error });
    } else {
        res.json({ success: true, result: result });
    }
});

// history storage
var history = [];

app.post('/save-history', function(req, res) {
    var entry = req.body.entry;
    history.push(entry);
    res.json({ success: true });
});

app.get('/get-history', function(req, res) {
    res.json({ history: history });
});

app.delete('/clear-history', function(req, res) {
    history = [];
    res.json({ success: true });
});

// start server
app.listen(port, function() {
    console.log('Server running on port ' + port);
});

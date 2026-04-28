// simple backend server for calculator
// i made this using node and express

const express = require('express');
const app = express();
const port = 3000;

// this is needed to read json from frontend
app.use(express.json());

// allow frontend to talk to backend (cors)
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

// serve frontend files
app.use(express.static('../frontend'));

// this route does the calculation
app.post('/calculate', function(req, res) {

    var num1 = parseFloat(req.body.num1);
    var num2 = parseFloat(req.body.num2);
    var op   = req.body.operator;

    var result = 0;
    var error  = "";

    // same if-else like in C
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

// history stored in array (like C array)
var history = [];
var history_count = 0;

app.post('/save-history', function(req, res) {
    var entry = req.body.entry;
    history[history_count] = entry;
    history_count = history_count + 1;
    res.json({ success: true });
});

app.get('/get-history', function(req, res) {
    res.json({ history: history });
});

app.delete('/clear-history', function(req, res) {
    history = [];
    history_count = 0;
    res.json({ success: true });
});

app.listen(port, function() {
    console.log('Calculator server running at http://localhost:' + port);
});

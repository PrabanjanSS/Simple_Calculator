// calculator frontend javascript
// talks to the backend server

var selectedOperator = "";
var opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

// load history when page opens
window.onload = function() {
    loadHistory();
}

function setOperator(op) {
    selectedOperator = op;

    // remove active class from all buttons
    var buttons = document.querySelectorAll('.op-btn');
    var i = 0;
    for (i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }

    // add active to clicked button
    event.target.classList.add('active');

    document.getElementById('selected-op').textContent = "Selected: " + opSymbols[op];
    document.getElementById('error-msg').textContent = "";
}

function calculate() {
    var num1 = document.getElementById('num1').value;
    var num2 = document.getElementById('num2').value;
    var errorBox = document.getElementById('error-msg');
    var display = document.getElementById('display');

    // check all fields filled
    if (num1 == "" || num2 == "") {
        errorBox.textContent = "Please enter both numbers!";
        return;
    }

    if (selectedOperator == "") {
        errorBox.textContent = "Please select an operator!";
        return;
    }

    errorBox.textContent = "";

    // send to backend
    fetch('http://localhost:3000/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            num1: num1,
            num2: num2,
            operator: selectedOperator
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success == false) {
            errorBox.textContent = data.message;
            display.textContent = "Error";
        } else {
            display.textContent = data.result;

            // save to history
            var entry = num1 + " " + opSymbols[selectedOperator] + " " + num2 + " = " + data.result;
            saveHistory(entry);
        }
    })
    .catch(function(err) {
        errorBox.textContent = "Server not reachable. Is backend running?";
    });
}

function saveHistory(entry) {
    fetch('http://localhost:3000/save-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry: entry })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        loadHistory();
    });
}

function loadHistory() {
    fetch('http://localhost:3000/get-history')
    .then(function(res) { return res.json(); })
    .then(function(data) {
        var historyList = document.getElementById('history-list');

        if (data.history.length == 0) {
            historyList.innerHTML = '<p class="no-history">No calculations yet.</p>';
            return;
        }

        historyList.innerHTML = "";

        // loop through history in reverse (newest first)
        var i = data.history.length - 1;
        for (i; i >= 0; i--) {
            var parts = data.history[i].split('=');
            var item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = parts[0] + '= <span>' + parts[1] + '</span>';
            historyList.appendChild(item);
        }
    })
    .catch(function(err) {
        // server not running
    });
}

function clearAll() {
    document.getElementById('num1').value = "";
    document.getElementById('num2').value = "";
    document.getElementById('display').textContent = "0";
    document.getElementById('error-msg').textContent = "";
    document.getElementById('selected-op').textContent = "No operator selected";
    selectedOperator = "";
    var buttons = document.querySelectorAll('.op-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
}

function clearHistory() {
    fetch('http://localhost:3000/clear-history', { method: 'DELETE' })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        loadHistory();
    });
}

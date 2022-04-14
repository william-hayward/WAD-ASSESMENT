// express server variables:
const express = require('express');
const app = express();

// connection variables:
const con = require('./mysqlconn');
const mysql = require('mysql2');

// session variables:
const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);
const sessionStore = new MySQLStore({}, con.promise());

app.use(express.json());
app.use(express.static('public'));

app.use(
	expressSession({
		store: sessionStore,
		secret: 'PlacesToStay',
		resave: false,
		saveUninitialized: false,
		rolling: true,
		unset: 'destroy',
		proxy: true,
		cookie: {
			maxAge: 600000,
			httpOnly: false,
		},
	})
);

app.post('/login', (req, res) => {
	con.query(
		`SELECT * FROM acc_users WHERE username=? AND password=?`,
		[req.body.username, req.body.password],
		(error, results, fields) => {
			if (results.length == 1) {
				req.session.username = req.body.username;
				res.json({ username: req.body.username });
			} else {
				res.status(401).json({ error: error });
			}
		}
	);
});

app.post('/logout', (req, res) => {
	req.session = null;
	res.json({ success: 1 });
});

app.use((req, res, next) => {
	if (['POST', 'DELETE'].indexOf(req.method) == -1) {
		next();
	} else {
		if (req.session.username) {
			next();
		} else {
			res.status(401).json({ error: "You're not logged in. Go away!" });
		}
	}
});

app.get('/login', (req, res) => {
	res.json({ username: req.session.username || null });
});

app.get('/accommodation/:location', (req, res) => {
	con.query(
		`SELECT * FROM accommodation WHERE location=?`,
		[req.params.location],
		(error, results, fields) => {
			if (error) {
				res.status(500).json({ error: error });
			} else {
				res.json(results);
			}
		}
	);
});

app.get('/accommodation/:location/type/:type', (req, res) => {
	con.query(
		`SELECT * FROM accommodation WHERE location=? AND type =?`,
		[req.params.location, req.params.type],
		(error, results, fields) => {
			if (error) {
				res.status(500).json({ error: error });
			} else {
				res.json(results);
			}
		}
	);
});

// {"accID": 1, "thedate": 220601, "username": "testusername", "npeople": 5}
app.post('/book', (req, res) => {
	con.query(
		`INSERT INTO acc_bookings(accID, thedate, username, npeople) VALUES(?,?,?,?);
	UPDATE acc_dates SET availability = availability - ? WHERE accID = ? AND thedate = ?`,
		[
			req.body.accID,
			req.body.thedate,
			req.body.username,
			req.body.npeople,
			req.body.npeople,
			req.body.accID,
			req.body.thedate,
		],
		function (error, results, fields) {
			if (error) {
				return con.rollback(function () {
					res.status(500).json({ error: error });
				});
			} else {
				res.json('successfully booked.');
			}
		}
	);
});

app.listen(3000);
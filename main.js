// express server variables:
const express = require("express");
const app = express();

// connection variables:
const con = require('./mysqlconn');
const mysql = require('mysql2');

app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
	console.log("working"); // test purposes
});

app.get("/accommodation/:location", (req, res) => {
	con.query(`SELECT * FROM accommodation WHERE location=?`,
    [req.params.location], (error,results,fields) => { 
        if(error) {
            res.status(500).json({ error: error });
        } else {
            res.json(results);
        }
    });
});

app.get("/accommodation/:location/type/:type", (req, res) =>{
	con.query(`SELECT * FROM accommodation WHERE location=? AND type =?`,
    [req.params.location, req.params.type], (error,results,fields) => { 
        if(error) {
            res.status(500).json({ error: error });
        } else {
            res.json(results);
        }
    });
});

// {"accID": 1, "thedate": 220601, "username": "testusername", "npeople": 5}
app.post("/book", (req, res) =>{
	con.query(`INSERT INTO acc_bookings(accID, thedate, username, npeople) VALUES(?,?,?,?);
	UPDATE acc_dates SET availability = availability - 1 WHERE accID = ? AND thedate = ?`,
			 [req.body.accID, req.body.thedate, req.body.username, req.body.npeople , req.body.accID, req.body.thedate],
			 function(error, results, fields){
		if (error) {
      		return con.rollback(function() {
        		res.status(500).json({ error: error });
			});
		}else{
			res.json("successfully booked.");
		}
	});
});


app.listen(3000);
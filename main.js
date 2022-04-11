// express server variables:
const express = require("express");
const app = express();

// connection variables:
const con = require('./mysqlconn');
const mysql = require('mysql2');

app.use(express.json());


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

app.listen(3000);
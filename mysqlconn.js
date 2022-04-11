const mysql = require('mysql2')

const con = mysql.createConnection({
	multipleStatements: true,
	host: 'localhost',
	user: 'wad',
	password: 'wad',
	database: 'waddb'
});

con.connect( err => {
	if(err) {
		console.log(err);
		process.exit(1);
	}else {
		console.log('connected to mysql ok');
	}
});

module.exports = con;
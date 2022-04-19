class UserDao {
	constructor(con, table) {
		this.con = con;
		this.table = table;
	}
	
	findAllUsers() {
		return new Promise ( (resolve, reject) => {
			this.con.query(`SELECT * FROM ${this.table}`,
						  (err, results, fields) =>{
				if (err){
					reject(err);
				}
				else{
					resolve(results);
					
				}
			});
		});
	}
	
	findUserByUsername(username){
		return new Promise((resolve, reject)=>{
			this.con.query(`SELECT * FROM ${this.table} WHERE username=?`, [username],
						   (err, results, fields)=>{
				if(err){
					reject(err);
				}else{
					resolve(results);
				}
			});
		});
	}
	
	findById(id){
		return new Promise((resolve, reject) => {
			this.con.query(`SELECT * FROM ${this.table} WHERE ID=?`, [id],
						  (err, results, fields) => {
				if(err){
					reject(err);
				}else{
					resolve(results.length == 0? null: results[0]);
				}
			});
		});
	}
	
	login(username, password){
		return new Promise((resolve, reject) => {
			this.con.query(`SELECT * FROM ${this.table} WHERE username=? AND password=?`, [username, password],
						  (err, results, fields) => {
				if(err){
					reject(err);
				}else{
					resolve(results.length == 0? null: results[0]);
				}
			});
		});
	}
	
	
};

module.exports = UserDao;
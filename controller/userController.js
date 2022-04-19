const UserDao = require('../dao/userDao');

class UserController {
	constructor(db){
		this.dao = new UserDao(db, "acc_users")
	}
	
	async findAllUsers(req, res){
		try{
			const users = await this.dao.findAllUsers();
			res.json(users);
		}catch(e){
			res.status(500).json({error: e});
		}
	}
	
	async findUserByUsername(req, res){
		try{
			const user = await this.dao.findUserByUsername(req.params.username);
			res.json(user);
		}catch(e){
			res.status(500).json({error: e});
		}
	}
	
}

module.exports = UserController;
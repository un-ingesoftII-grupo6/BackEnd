const User = require('../models/User');
const Wallet = require('../models/Wallet');
const helpers = require("../lib/helpers");

const createUser = async (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const username = req.body.username;
    const password = await helpers.encryptPassword(req.body.password);
 
    console.log(password);
    try {
    const post = await User.create({
        Usr_name: name,
        Usr_surname: surname,
        Usr_email: email,
        Usr_username: username,
        Usr_password: password
    });
    return res.status(201).json({
      post,
    });
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const post = await User.findOne({
      where: { Usr_username: username },
      include: [
        {
          model: Wallet,
          as: 'possess',
          include: [
           {
            model: User,
            as: 'possess',
           }
          ]
        }
      ]
    });
    if (post) {
      return res.status(200).json({ post });
    }
    return res.status(404).send('User with the specified username does not exists');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  createUser,
  getUserByUsername
}
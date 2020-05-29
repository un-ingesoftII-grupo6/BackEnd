const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

const createUser = async (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const username = req.body.username;
    const password = await helpers.encryptPassword(req.body.password);

    try {
    const post = await models.User.create({
        Usr_name: name,
        Usr_surname: surname,
        Usr_email: email,
        Usr_username: username,
        Usr_password: password
    });

    const wallet = await models.Wallet.create({
        Wal_id: uuid.v4(),
        Usr_id: post.Usr_id,
        Wtyp_id: 1,
        Wal_balance: 0.00,
        Wal_state: "Active"
    });

    return res.status(201).json({
      post,
    });
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

const getAllUsers = async (req, res) => {
  try {
    const posts = await models.User.findAll({
      include: [
        {
          model: models.Wallet,
          as: 'possess',
        include: [
          {
           model: models.Movement,
           as: 'modifies',
          }
         ]
        },
      ]
    });
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const post = await models.User.findOne({
      where: { Usr_username: username },
      include: [
        {
          model: models.Wallet,
          as: 'possess',
          include: [
           {
            model: models.Movement,
            as: 'modifies',
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

const updateUser = async (req, res) => {
  try {
    const { username } = req.params;
    const name = req.body.name;
    const surname = req.body.surname;
    const usrname = req.body.username;
    const email = req.body.email;
    const password = await helpers.encryptPassword(req.body.password);

    const [ updated ] = await models.User.update({
        Usr_name: name,
        Usr_surname: surname,
        Usr_email: email,
        Usr_username: usrname,
        Usr_password: password
    }, {
      where: { Usr_username: username }
    });
    if (updated) {
      const updatedUser = await models.User.findOne({ where: { Usr_username: usrname } });
      return res.status(200).json({ user: updatedUser });
    }
    throw new Error('User not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const deleted = await models.User.destroy({
      where: { Usr_username: username }
    });
    if (deleted) {
      return res.status(200).send("User deleted");
    }
    throw new Error("User not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const validateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const post = await models.User.findOne({
      where: { Usr_username: username },
      include: [
        {
          model: models.Wallet,
          as: 'possess',
          include: [
           {
            model: models.Movement,
            as: 'modifies',
           }
          ]
        }
      ]
    });
    if (post) {
      const val = await helpers.matchPassword(password,post.Usr_password);
      if(val){
        return res.status(200).json({ post }); //Si se autenticó correctamente, le devuelve el user con su wallet
      } else {
        return res.status(401).send('The password is incorrect. Please try again');
      }
      
    }
    return res.status(404).send('User with specified username does not exists');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}



module.exports = {
  createUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
  deleteUser,
  validateUser
}
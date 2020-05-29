const helpers = require("../lib/helpers");
const uuid = require('uuid');
const models = require("../../models");

const createUser = async (req, res) => {
  try {
    const { name, surname, email } = req.body;
    const username = helpers.hasNoSpaces(req.body.username);
    const password = await helpers.encryptPassword(req.body.password);

    if (username) {
      const user = await models.User.create({
        Usr_name: name,
        Usr_surname: surname,
        Usr_email: email,
        Usr_username: username,
        Usr_password: password
      });

      const wallet = await models.Wallet.create({
        Wal_id: uuid.v4(),
        Usr_id: user.Usr_id,
        Wtyp_id: 1,
        Wal_balance: 0.00,
        Wal_state: "Active"
      });

      return res.status(201).json({
        user: user,
        wallet: wallet
      });
    }
    return res.status(400).send("Username can't contain spaces");
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await models.User.findAll();
    return res.status(200).json({ users: users });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await models.User.findOne({
      where: { Usr_username: username }
    });
    if (user) {
      return res.status(200).json({ user: user });
    }
    return res.status(404).send('User with the specified username does not exists');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const updateUser = async (req, res) => {
  try {
    const { username } = req.params;
    const usrname = helpers.hasNoSpaces(req.body.username);
    const { name, surname, email } = req.body;
    const password = await helpers.encryptPassword(req.body.password);

    if (usrname) {
      const [updated] = await models.User.update({
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
      throw new Error('User not updated');
    }
    return res.status(400).send("Username can't contain spaces");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const findUser = await models.User.findOne({ where: { Usr_username: username } });

    if (findUser) {
      const wallets = await models.Wallet.findAll({ where: { Usr_id: findUser.Usr_id } });
      
      if (wallets.length > 0) {
        return res.status(400).send("This User has associated Wallets. Please delete them first");
      }
      const deleted = await models.User.destroy({
        where: { Usr_username: username }
      });
      if (deleted) {
        return res.status(200).send("User " + username + " deleted");
      }
    }
    return res.status(404).send("Specified User not found");
} catch (error) {
  return res.status(500).send(error.message);
}
};

const validateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await models.User.findOne({
      where: { Usr_username: username },
      include: [
        {
          model: models.Wallet,
          as: 'possess',
          include: [
            {
              model: models.Movement,
              as: 'modifies sender',
            },
            {
              model: models.Movement,
              as: 'modifies recipient', 
            }
          ]
        }
      ]
    });
    if (user) {
      const val = await helpers.matchPassword(password, user.Usr_password);
      if (val) {
        return res.status(200).json({ user: user }); //Si se autenticó correctamente, le devuelve el user con su wallet
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
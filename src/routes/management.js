const express = require("express");
const router = express.Router();


router.post("/wallet", async (req, res, next) => {
    
    const query = await sequelize.models.User.findAll({
        where: {
            Usr_username: "miapenahu"
        }}).catch(err);
    
    res.status(200).json(query);

});


module.exports = router;
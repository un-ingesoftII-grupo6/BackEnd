const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index'/*, { title : 'UN Wallet'}*/);
    //console.log(path.join(__dirname, 'views/index.html'));
});

module.exports = router;
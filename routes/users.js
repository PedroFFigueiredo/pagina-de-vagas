const express = require('express');
const router = express.Router();

const User = require('../models/User');
const {hash} = require('bcryptjs');

//form do create-user
router.get('/create', (req, res) => {
    res.render('create-user');
});

router.post('/create', async (req, res)=> {
    const {name, email, password} = req.body;

    const hashPassword = await hash(password, 8);

    // insert
    User.create({
        name,
        email,
        password: hashPassword,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        })
    .then(()=> res.redirect('/login'))
    .catch(err => console.log(err));
});

module.exports = router
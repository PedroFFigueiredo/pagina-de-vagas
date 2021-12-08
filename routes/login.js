const express = require('express');
const router = express.Router();

var login = "admin";
var password = "123456";

//form do login
// router.get('/', (req, res) => {
//     res.render('login');
// });

router.get('/create', async (req, res)=> {
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
    .then(()=> res.redirect('/'))
    .catch(err => console.log(err));
});

module.exports = router
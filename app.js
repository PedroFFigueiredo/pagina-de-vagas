const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const db = require('./db/connection');
const Job = require('./models/job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const PORT = 3000;

app.listen(PORT, function() {
    console.log(`O Express está rodando na porta ${PORT}`);
});

//body parser 
app.use(express.urlencoded({ extended:false}));

// handle bars
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({defaultLayout: 'main',extname: '.hbs', partialsDir: [path.join(__dirname, 'views/partials')]}));
app.set('view engine', '.hbs');


//static folder
app.use(express.static(path.join(__dirname, 'public')));

//db connection
db
    .authenticate()
    .then(()=> {
        console.log("Conectou ao banco com sucesso");
    })
    .catch(err => {
        console.log("Ocorreu um erro ao conectar", err);
    });


//routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%'; //PH -> PHP, Word -> Wordpress, press -> Wordpress

    if(!search) {
        Job.findAll({order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
    
            res.render('index', {
                jobs
            });
        })
        .catch(err => console.log(err));
    }else {
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
    
            res.render('index', {
                jobs, search    
            });
        })
        .catch(err => console.log(err));
    }

});

//jobs routes 
app.use('/jobs', require('./routes/jobs'));

//login routes 
// app.use('/login', require('./routes/login'));

//users routes 
app.use('/users', require('./routes/users'));



// Sistema de Login
app.use(bodyParser.urlencoded({extended:true}));

app.use('/login', require('./views/login'));

app.use(session({secret: 'yg3ygj342jugrj32yg'}));

var login = "admin";
var password = "123456";



app.post('/views/login',(req, res)=>{

    if(req.body.login = login  && req.body.password == password){
        //Logado com sucesso
        req.session.login = login;
        res.render('add');
    }else{
  
    res.render('login', {error:"Usuario ou senha inválido."});
}
})



app.get('/views/login', (req,res)=>{
    if(req.session.login){
        res.render('add');
    }else{
        res.render('login');
}
})



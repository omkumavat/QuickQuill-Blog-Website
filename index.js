const express = require('express');
const app = express();
const path = require('path');
const bodyParser=require('body-parser');
const exphbs = require('express-handlebars');

// Static files middleware
app.use(express.static(path.join(__dirname, 'Public')));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(bodyParser.json());
app.use(express.json());

// Handlebars configuration
const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views'),
    partialsDir: path.join(__dirname, 'views'),
    allowProtoMethodsByDefault: true,
    allowProtoProperties: true
});
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/',(req,res) => {
    res.render('index',{layout:false});
})
// Import and use the blog router
const blogRouter = require('./routes/blog');
app.use('/', blogRouter);

// Connect to the database
const dbConnect = require('./config/database');
dbConnect();

// Start Server
const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log("App is running at port", PORT);
// });

module.exports=app;
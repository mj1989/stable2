const express = require('express');
const mongoose = require('mongoose');
const horseRouter = require('./routes/horses');
const calendarRouter = require('./routes/calendar');
const Horse = require('./models/horse');
const methodOverride = require('method-override');
const app = express();

mongoose.connect('mongodb://localhost/stablems');

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));


app.get('/', async (req, res) => {
    const horses = await Horse.find().sort({name: 1});
    res.render('horses/index', { horses: horses});
});

app.use('/horses', horseRouter);
app.use('/calendar', calendarRouter);

app.listen(5000);
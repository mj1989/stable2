const express = require('express');
const Horse = require('./../models/horse');
const Activity = require('./../models/activity');
const router = express.Router();
const horseRaces = require('./../assets/races.json');

/*
* All routes bellow are for activities for specific horse
*/
//routing to activity for specific horse
router.get('/:slug/addActivity', async (req, res) => {
    let horse = await Horse.findOne({ slug: req.params.slug });
    res.render('horses/addActivity', {horse: horse, activity: new Activity()});
});

// adding activity for specific horse
router.post('/:slug', async (req, res, next) =>{
  
    req.horse = new Horse();
    next();

}, saveActivityAndRedirect('addActivity'));




function saveActivityAndRedirect(path){
    return async (req, res) =>{
        let horse = await Horse.findOne({ slug: req.params.slug });

        let activity = req.activity;        
        activity.description = req.body.description;
        activity.category = req.body.category;
        activity.startDate = req.body.startDate;
        activity.endDate = req.body.endDate; 
        activity.horseID = horse.id;

        try{
            activity = await activity.save();
            res.redirect(`/horses/${horse.slug}`);
            
        } catch(e){
            res.render(`horses/${path}`, { horse: horse});
        } 
    }
}


/*
* All routes bellow are for horses
*/
router.get('/', async (req, res) => {
    const horses = await Horse.find().sort({name: 1});
    res.render('horses/index', { horses: horses});
});
router.get('/addHorse', (req, res) => {
    res.render('horses/addHorse', {horse: new Horse(), horseRaces: horseRaces.breed});
});

router.get('/edit/:id', async (req, res) => {
    const horse = await Horse.findById(req.params.id);
    res.render('horses/edit', {horse: horse, horseRaces: horseRaces.breed});
});

router.get('/:slug', async (req, res) => {
    let horse = await Horse.findOne({ slug: req.params.slug });
    if(horse == null) res.redirect('/');
    res.render('horses/show', {horse: horse});
});

router.post('/', async (req, res, next) =>{
  
    req.horse = new Horse();
    next();

}, saveHorseAndRedirect('addHorse'));

router.put('/:id', async (req, res, next) => {

    req.horse = await Horse.findById(req.params.id);
    next();

}, saveHorseAndRedirect('edit'))
router.delete('/:id', async (req, res) => {
    await Horse.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

function saveHorseAndRedirect(path){
    return async (req, res) =>{
        let horse = req.horse;        
        horse.name = req.body.name;
        horse.gender = req.body.gender;
        horse.breed = req.body.breed;
        horse.date = req.body.datepicker;       
        try{
            horse = await horse.save();
            res.redirect(`/horses/${horse.slug}`);
            
        } catch(e){
            res.render(`horses/${path}`, { horse: horse});
        } 
    }
}

module.exports = router;
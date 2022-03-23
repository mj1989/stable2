const express = require('express');
const Horse = require('./../models/horse');
const Activity = require('./../models/activity');
const router = express.Router();
const horseRaces = require('./../assets/races.json');
const horse = require('./../models/horse');
const activity = require('./../models/activity');

/*
* All routes bellow are for activities for specific horse
*/
//routing to activity for specific horse
router.get('/:slug/addActivity', async (req, res) => {
    let horse = await Horse.findOne({ slug: req.params.slug });
    res.render('horses/addActivity', {horse: horse, activity: new Activity()});
});

// adding activity for specific horse
router.post('/:slug', async (req, res) =>{
  
    //req.horse = new Horse();
    req.activity = new Activity();
    //
    let horse = await Horse.findOne({ slug: req.params.slug });

    //
    let activity = req.activity;        
    activity.description = req.body.description;
    activity.category = req.body.category;
    //setting time for startDate
    activity.startDate = req.body.startDate;
    activity.startDate.setHours(Number(req.body.startTime.split(':')[0])+1, Number(req.body.startTime.split(':')[1]));
    //setting time for endDate
    activity.endDate = req.body.endDate; 
    activity.endDate.setHours(Number(req.body.endTime.split(':')[0])+1, Number(req.body.endTime.split(':')[1]));
    
    activity.horseID = horse.id;
    
    //
    try{
        activity = await activity.save();
        res.redirect(`/horses/${horse.slug}`);
        
    } catch(e){
        res.render(`horses/show`, { horse: horse, activity: activity, horseRaces: horseRaces.breed});
    } 
});

//routing to editing activity
router.get('/:slug/edit/:id', async (req, res) => {
    
    const activity = await Activity.findById(req.params.id);
    const horse = await Horse.findById(activity.horseID);
    res.render('horses/editActivity', {horse: horse, horseRaces: horseRaces.breed, activity: activity});
});
//editing activity by put
router.put('/:slug/:id', async (req, res, next) => {
    let activity = await Activity.findById(req.params.id);
    let horse = await Horse.findById(activity.horseID);

    activity.description = req.body.description;
    activity.category = req.body.category;
    
    //setting time for startDate
    activity.startDate = req.body.startDate;
    activity.startDate.setHours(Number(req.body.startTime.split(':')[0])+1, Number(req.body.startTime.split(':')[1]));
    //setting time for endDate
    activity.endDate = req.body.endDate; 
    activity.endDate.setHours(Number(req.body.endTime.split(':')[0])+1, Number(req.body.endTime.split(':')[1]));
    
    activity.horseID = horse.id;

    try{
        
        activity = await activity.save();
        res.redirect(`/horses/${horse.slug}`);
        
    } catch(e){
        res.render(`horses/show`, { horse: horse, activity: activity, horseRaces: horseRaces.breed});
    } 

});
//edditing statud done
//editing activity by put
router.put('/:slug/:id/done', async (req, res) => {
    let activity = await Activity.findById(req.params.id);
    let horse = await Horse.findById(activity.horseID);

    activity.isDone = true;

    try{
        activity = await activity.save();
        res.redirect(`/horses/${horse.slug}`);
        
    } catch(e){
        res.render(`horses/show`, { horse: horse, activity: activity, horseRaces: horseRaces.breed});
    } 

});
////editing activity by put undone status
router.put('/:slug/:id/undone', async (req, res) => {
    let activity = await Activity.findById(req.params.id);
    let horse = await Horse.findById(activity.horseID);

    activity.isDone = false;

    try{
        activity = await activity.save();
        res.redirect(`/horses/${horse.slug}`);
        
    } catch(e){
        res.render(`horses/show`, { horse: horse, activity: activity, horseRaces: horseRaces.breed});
    } 

});
//deleting activity
router.delete('/:slug/:id', async (req, res) => {
    let horse = await Horse.findOne({ slug: req.params.slug });
    await Activity.findByIdAndDelete(req.params.id);
    res.redirect(`/horses/${horse.slug}`);
})




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
    let activities = await Activity.find();
    if(horse == null) res.redirect('/');
    res.render('horses/show', {horse: horse, activities: activities});
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
            res.render(`horses/${path}`, {horse: horse, horseRaces: horseRaces.breed});
        } 
    }
}

module.exports = router;
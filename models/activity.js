const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    description:{
        type: String,
        required: true      
    },
    startDate:{
        type:Date,
        default: new Date(),
        required:true
    },
    endDate:{
        type: Date,
        default: new Date(),
        required: true
    },
    category:{
        type: String,
        required: true
    },
    horseID:{
        type: String,
        required: true
    }
});



module.exports = mongoose.model('Activity', activitySchema);
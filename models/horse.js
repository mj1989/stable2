const mongoose = require('mongoose');
const slugify = require('slugify');

const horseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true      
    },
    gender:{
        type: String,
        required: true
    },
    breed:{
        type:String,
        required: true
    },
    date:{
        type:Date,
        default: new Date(),
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    }
});

horseSchema.pre('validate', function(next){
    if(this.name) {
        this.slug = slugify(this.name, {lower:true, strict:true})
    }
    next();
})

module.exports = mongoose.model('Horse', horseSchema);
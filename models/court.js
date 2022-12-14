const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema ({
    url:String,
    filename:String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const opts = {toJSON:{virtuals:true}};

const CourtSchema = new Schema({
    title:String,
    location:String,
    images:[ImageSchema],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    website:String,
    description:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts);

CourtSchema.virtual('properties.popupMarkup').get(function(){
    return `<a href="/courts/${this._id}">${this.title}</a>`
});


CourtSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await review.deleteMany({
            _id:
            {
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Court',CourtSchema)
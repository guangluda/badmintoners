const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const CourtSchema = new Schema({
    title:String,
    location:String,
    image:String,
    website:String,
    description:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

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

module.exports = mongoose.model('Court',CourtSchema);
const mongoose = require('mongoose');
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

module.exports = mongoose.model('Court',CourtSchema);
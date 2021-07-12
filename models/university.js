const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const universitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    maxNumOfStudent: {
        type: Number,
        required: true 
    },
    minGPA: {
        type: Number,
       /* min: 55,
        max:100,*/
        required: true

    },
    currentNumOfStudent: {
        type: Number,
        required: false
    },
    studentArr:
        [{ type: Schema.Types.ObjectId, ref: 'Student' }]
     
});

const University = mongoose.model('University',universitySchema);
module.exports = University;
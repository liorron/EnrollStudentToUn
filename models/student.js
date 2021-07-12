const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true 
    },
    universityName: {
        type: String,
        required: false
    },
    gpa:{
        type:Number,
        required: false
    },
    grades: 
     [{ type: Schema.Types.ObjectId, ref: 'Grade' }]
    
});

const Student = mongoose.model('Student',studentSchema);
module.exports = Student;
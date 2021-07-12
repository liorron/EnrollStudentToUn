const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const gradeSchema = new Schema({
    courseName: {
        type: String,
        required: true
    },
   /* studentId: {
        type: String,
        required: true 
    },*/
    grade: {
        type: Number,
        required: true

    }
});

const Grade = mongoose.model('Grade',gradeSchema);
module.exports = Grade;
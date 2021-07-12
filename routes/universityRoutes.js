const express =require('express');
const router=express.Router();
const University= require('../models/university');
const Student=require('../models/student');
const Grade=require('../models/grade');
const alert = require('alert');

//get request for the home page
//the home page presnt al the univrsities
//click on specific university lead to details page /university/:id
router.get('/university', (req, res) => {
  University.find()
      .then(result => {
        res.render('index', { university: result, title: 'All of the universities' });
      })
      .catch(err => {
        console.log(err);
      });
});
//POST request to creat new univerity
router.post('/university', async (req,res)=>{
  if(req.body.minGPA<55||req.body.minGPA>100 || req.body.maxNumOfStudent<1){
    //check if the GPA amd the maximum number of student is ok
    alert("The average must be between 55 and 100 and the maximum number of students at least 1.");
    res.redirect('/createUniversity');
  }
    else{//check if this university allrady exsist by its name
       var test = await University.exists({'name': req.body.name})
       if(test){
        alert("University already exists");
        res.redirect('/university');
       }
       
       
        else{ 

          const university= new University(req.body);
          university.currentNumOfStudent="0";
          university.save().then((result)=>{
          res.redirect('/university');
  
          }).catch( (err)=>{
          console.log(err);
          });
          }
     }

});
//GET requst for the details about a specific university
//The details are: name, current number of student, maximum number of student and minimum GPA
router.get('/university/:id', (req,res) =>{
    const id= req.params.id;
    University.findById(id).then((result)=>{
        res.render('details',{university: result, title: 'university details'});
    }).catch((err)=>{
        console.log(err);
    });


});
//get request the enrollment page, this page conatin all universities.
router.get('/universityEnroll', (req,res) =>{
   University.find()
      .then(result => {
        res.render('allUniversities', { university: result, title: 'All of the universities' });
      })
      .catch(err => {
        console.log(err);
      });
  });
//get request to enroll specific university. 
//the enroll student page contain form, Fill in the form for the ID of the student who wants to enroll in the university
//a post request from this page will be sent to /universityEnroll/:id
router.get('/universityEnroll/:id', (req,res) =>{
  const id= req.params.id;
  University.findById(id).then((result)=>{
      res.render('enrollStudent',{university: result, title: 'university enroll'});
  }).catch((err)=>{
      console.log(err);
  });
});
//this is the post request that handel the enrollment
//If all the conditions are met the enrollment will be made
router.post('/universityEnroll/:id', (req,res) =>{
  const id= req.params.id;
  //The university id pass through URL
  University.findById(id).then((result)=>{
    //Result is the university
    var minGpa= result.minGPA;
    var currentNumOfStudent =result.currentNumOfStudent;
    var maxNumOfStudent=result.maxNumOfStudent;
    if(currentNumOfStudent<maxNumOfStudent)
    { 

      Student.findOne({'studentId':req.body.id}, (err,res)=>{
        //res is the student
        //it the student foed not exsist it is an error and its catch
        if(err){
          return console.log("error"+err);
        }
        else{//no error while finding the student
          if(res){ 
            if(res.gpa>=minGpa){//If the student meets the grade criterion. Enrollment can be made
              res.universityName=result.name;//save the university name in the student document
              result.currentNumOfStudent+=1;//add 1 to the current number of student
              result.studentArr.push(res);//add the student to the university
              result.save();
              res.save();
              alert("Enrollment success!!");
            }
            else{
              alert("Enrollment failed,The student's GPA is not enough, try to enroll in another university.!");
            }
          }
          else{
            alert("Enrollment failed, Student does not exist");
          }
        }
         return res;
      }).catch(err =>{
        alert("Enrollment failed, Student does not exist");

      });
    
    }
    else{
      alert("Enrollment failed,There is no place in this university to try one another!");
    }
    res.redirect('/university');
  }).catch((err)=>{
      console.log(err);
  });
});
//To get all the enrolled student. page with a list of all the universities is displayed first
//After choosing a university we will see all the students enrolled in it. the get request sendto universityAllStudent/:id
router.get('/universityAllStudent', (req, res) => {
  University.find()
      .then(result => {
        res.render('allUnForStud', { university: result, title: 'All of the universities' });
      })
      .catch(err => {
        console.log(err);
      });
});
//GET request for all the students enrolled in a specific university
router.get('/universityAllStudent/:id', (req,res) =>{
  const id= req.params.id;
  University.findById(id).then((result)=>{
      Student.find({'universityName':result.name}, (err,resu)=>{

        res.render('detailsStudent',{student: resu, title: 'university enroll'});
      });
      
  }).catch((err)=>{
      console.log(err);
  });
});


module.exports = router;

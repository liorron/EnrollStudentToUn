const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const University= require('./models/university');
const Student= require('./models/student');
const Grade=require('./models/grade');
const alert = require('alert');
const universituRout = require('./routes/universityRoutes');


// express app
const app = express();
//conect to mongoDB
const dbURI = 'mongodb+srv://lior:lior1234@studentuniversity.d9lkg.mongodb.net/nodetuts?retryWrites=true&w=majority';
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true }).then(result => app.listen(3000))
.catch(err => console.log(err));
//listen to request aftes the connect

//register the view engine
//ejs+express aoutomatucly looks at the views folder.
app.set('view engine', 'ejs');



//all the file from public folder will be avilable 
app.use(express.static('public'));

//to acsess data from post requests
app.use(express.urlencoded({extend:true }));

//morgan middleware to creat logs
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
  });
//Get request for home page
app.get('/', (req, res) => {
    res.redirect('/university');
});

//GET request to the create new student page
app.get('/createStuedent', (req, res) => {
    res.render('createStudent', { title: 'Create new student' });
  });
//GET request to the create new univerusty page
  app.get('/createUniversity', (req, res) => {
    res.render('createUniversity', { title: 'Create new university' });
  });
//GET requst to page that contain all the student in the system
  app.get('/student', (req, res) => {
    Student.find()
        .then(result => {
          res.render('student', { student: result, title: 'All of the student' });
        })
        .catch(err => {
          console.log(err);
        });
  });
  //POST request to create new student
  app.post('/student',async (req,res)=>{
        var sum =0;
        var cnt=0;
        var gpa=0;
        //Check if the student already exists by ID
        var i = await Student.exists({"studentId":req.body.studentId});
        
        if(i){
            alert("Student already exists");
            res.redirect('/university');
        }

        //}
        else {
            const student= new Student(req.body);
       
        if(req.body.courseName1 && req.body.grade1) {
           const grade1= new Grade();
            sum+= parseInt(req.body.grade1);
            cnt+=1;
            console.log("sum:"+sum);
            grade1.courseName=req.body.courseName1;
            grade1.grade=req.body.grade1;
            grade1.save();
            student.grades.push(grade1);
           
        }
        if(req.body.courseName2 && req.body.grade2) {
            const grade2= new Grade();
            sum+=parseInt(req.body.grade2);
            cnt+=1;
            console.log("sum:"+sum);
            grade2.courseName=req.body.courseName2;
            grade2.grade=req.body.grade2;
            grade2.save();
            student.grades.push(grade2);
          
        }
        if(req.body.courseName3 && req.body.grade3) {
            const grade3= new Grade();
            sum+=parseInt(req.body.grade3);
            cnt+=1;
            console.log("sum:"+sum);
            grade3.courseName=req.body.courseName3;
            grade3.grade=req.body.grade3;
            grade3.save();
            student.grades.push(grade3);
          
        }
        if(req.body.courseName4 && req.body.grade4) {
            sum+=parseInt(req.body.grade4);
            cnt+=1;
            console.log("sum:"+sum);
            const grade4= new Grade();
            grade4.courseName=req.body.courseName4;
            grade4.grade=req.body.grade4;
            grade4.save();
            student.grades.push(grade4);
           
        }
        gpa=sum/cnt;
        student.gpa=gpa;
    student.save().then((result)=>{
        res.redirect('/student');
        //redirect to page of al the student in the system
    }
    ).catch( (err)=>{
        console.log(err);
    });
  }
});

 
   
   
//rute all the universuty requste to routes/universityRoutes.js
app.use(universituRout);
// 404 page
app.use((req, res) => {
  res.status(404).render('404',{title: '404'});
});
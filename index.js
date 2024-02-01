const express = require('express')
const app = express()
const port = 3000
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.get('/certifyu', (req, res) => {
  res.render("home");
})
app.get('/student', (req, res) => {
  res.render("stu_SL");
})

app.get('/faculty', (req, res) => {
  res.render("fac_SL");
})
app.get('/admin_logfail', (req, res) => {
  res.render("home");
})
app.get('/stu_logfail', (req, res) => {
  res.render("Stu_SL");
})
app.get('/fac_logfail', (req, res) => {
  res.render("fac_SL");
})

const { check, validationResult ,matchedData}
  = require('express-validator');

const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.post('/studentSignup', [
  check('email').notEmpty().withMessage('Email Address required').normalizeEmail().isEmail().withMessage('must be a valid email'),
  check('name').trim().notEmpty().withMessage('Name required')
  .matches(/^[a-zA-Z ]*$/).withMessage('Invalid name'),
  check('regd','Only 10 characters')
          .isLength({ min: 10, max: 10 }).matches(/^[20-5]{2}[b0|B0]{2}[1|5]{1}[a|A]{1}[0|1]{1}[1-5]{1}[0-9a-zA-Z]{1}[0-9]{1}$/).withMessage('Invalid ID'),
  check('pwd').trim().notEmpty().withMessage('Password required')
  .isLength({ min: 8 }).withMessage('Give atleast 8 characters')
  .matches(/(?=.*?[A-Z])/).withMessage('At least one Uppercase')
  .matches(/(?=.*?[a-z])/).withMessage('At least one Lowercase')
  .matches(/(?=.*?[0-9])/).withMessage('At least one Number')
  .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('At least one special character')
  .not().matches(/^$|\s+/).withMessage('White space not allowed')
], (req, res) => {
  const errors1 = validationResult(req);
  const {name,regd,branch,email,pwd}= req.body;
  if(!errors1.isEmpty()){
          var errMsg= errors1.mapped();
          var inputData = matchedData(req);
    
         }else{
            var inputData = matchedData(req);  
                const StudentDb = db.collection('Students'); 
                const details = StudentDb.doc(regd); 
                details.set({
                  name: name,
                  regd:regd,
                  branch:branch,
                  email: email,
                  password: pwd
              })
                // .then(() => {
                //     res.render("stu_SL");
                //   });
        }
        res.render('stu_SL', {errors1:errMsg, inputData:inputData});   
});

app.get('/studentLogin', (req, res) => {
  const regd = req.query.regd;
  const pwd = req.query.pwd;
  db.collection("Students")
    .where("regd", "==", regd)
    .where("password", "==", pwd)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
            res.render("upload_view",{regd:regd});
      } else {
        res.render("stu_logfail");
       
      }
    });      
});

app.get('/adminSubmit', (req, res) => {
  const aid = req.query.lid;
  const pwd = req.query.pwd;
  db.collection("Admin")
    .where("Admin_ID", "==", aid)
    .where("Password", "==", pwd)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
            res.render("admin_home");
      } else {
        res.render("loginfail");
       
      }
    });      
});

app.get('/dateSubmit', (req, res) => {
  const month = req.query.mon;
  const year = req.query.year;
  const date = req.query.date;
  res.render("dateSubmit",{date:date,month:month,year:year});
})
app.get('/branchSubmit', (req, res) => {
  const branch = req.query.branch;
  res.render("branchSubmit",{branch:branch});
})
app.get('/fac_dateSubmit', (req, res) => {
  const month = req.query.mon;
  const year = req.query.year;
  const date = req.query.date;
  res.render("fac_dateSubmit",{date:date,month:month,year:year});
})
app.get('/facutlyanalysis', (req, res) => {
  res.render("fac_analysis");
})
app.get('/studentanalysis', (req, res) => {
  res.render("admin");
})
app.get('/facidSubmit', (req, res) => {
  const facid = req.query.facid;
  res.render("facidSubmit",{facid:facid});
})

app.get('/fac_eventSubmit', (req, res) => {
  const event = req.query.event;
  res.render("fac_eventSubmit",{event:event});
})
app.get('/regdSubmit', (req, res) => {
  const regd = req.query.regd;
  res.render("regdSubmit",{regd:regd});
})
app.get('/eventSubmit', (req, res) => {
  const event = req.query.event;
  res.render("eventSubmit",{event:event});
})


app.post('/facultySignup', [
  check('email').notEmpty().withMessage('Email Address required').normalizeEmail().isEmail().withMessage('must be a valid email'),
  check('name').trim().notEmpty().withMessage('Name required')
  .matches(/^[a-zA-Z ]*$/).withMessage('Invalid name'),
  check('facid', 'Only 10 characters')
          .isLength({ min: 10, max: 10 }).matches(/^[20-5]{2}[b0|B0]{2}[1|5]{1}[a|A]{1}[0|1]{1}[1-5]{1}[0-9a-zA-Z]{1}[0-9]{1}$/).withMessage('Invalid ID'),
  check('pwd').trim().notEmpty().withMessage('Password required')
  .isLength({ min: 8 }).withMessage('Give atleast 8 characters')
  .matches(/(?=.*?[A-Z])/).withMessage('At least one Uppercase')
  .matches(/(?=.*?[a-z])/).withMessage('At least one Lowercase')
  .matches(/(?=.*?[0-9])/).withMessage('At least one Number')
  .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('At least one special character')
  .not().matches(/^$|\s+/).withMessage('White space not allowed')
], (req, res) => {
  const errors = validationResult(req);
  const {name,facid,email,pwd}= req.body;
  if(!errors.isEmpty()){
          var errMsg= errors.mapped();
          var inputData = matchedData(req);
    
         }else{
            var inputData = matchedData(req);  
                const FacultyDb = db.collection('Faculty'); 
                const details = FacultyDb.doc(facid); 
                details.set({
                  name: name,
                  faculty_id:facid,
                  email: email,
                  password: pwd
              })
                // .then(() => {
                //     res.render("fac_SL");
                //   });
        }
        res.render('fac_SL', {errors:errMsg, inputData:inputData});   
});
app.get('/facultyLogin', (req, res) => {
  const facid = req.query.facid;
  const pwd = req.query.pwd;
  db.collection("Faculty")
    .where("faculty_id", "==", facid)
    .where("password", "==", pwd)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
            res.render("Fac_upload_view",{facid:facid});
      } else {
        res.render("fac_logfail");
       
      }
    });      
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
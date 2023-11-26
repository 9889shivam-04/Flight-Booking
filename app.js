const express=require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
const bodyParser = require('body-parser')
const { error } = require('console')

// app.set('view engine','ejs')
// app.use('views',path.join(__dirname,'/views'))
// app.use(express.static(__dirname + '/views'));


mongoose.connect('mongodb://127.0.0.1:27017/FlightBooking')
.then(()=>{
    console.log('connect Successfully')
}).catch(err=>{
    console.log('connectivity Error')
})

const data=mongoose.Schema({
    name:String,
    email:String,
    from:String,
    to:String,
    date:String,
    opt:String
})
const Signupdata=mongoose.Schema({
    username:String,
    email:String,
     password:String
})

const database=mongoose.model('FlightBook',data)
const Sign=mongoose.model('Register',Signupdata)

app.get('/',(req,res)=>{
   //  res.render('index',{})
   res.sendFile(__dirname+"/index.html")
})

app.get('/login',(req,res)=>{
   res.sendFile(__dirname+"/Admin.html")
})
app.get('/Thankyou',(req,res)=>{
   res.sendFile(__dirname+"/Thankyou.html")
})
app.get('/ThanksSignup',(req,res)=>{
    res.sendFile(__dirname+"/ThanksSignup.html")
 })

app.get('/Signup',(req,res)=>{
    res.sendFile(__dirname+"/Signup.html")
})
app.get('/Loginsuccess',(req,res)=>{
    res.sendFile(__dirname+"/Loginsuccess.html")
 })

//Login here


app.use(bodyParser.urlencoded({
    extended:true,
}))


app.post('/submit',(req,res)=>{
    const {name,email,from,to,date,opt}=req.body;
    
    const tiket_book=database({
        name,email,from,to,date,opt
    })
    tiket_book.save().then(()=>{
      res.redirect('/Thankyou')
        console.log('Data save')
    }).catch(err=>{
        console.log('Not Store Data')
    })
})
app.post('/Sign',(req,res)=>{
    const {username,email,password}=req.body;
    
    const signin=Sign({
        username,email,password
    })
    signin.save().then(()=>{
      res.redirect('/ThanksSignup')
        console.log('Data save')
    }).catch(err=>{
        console.log('Not Store Data')
    })
})


//login here
app.post('/AdminLogin' ,async(req,res)=>{
    try{
        const{email,password}=req.body
        const user =await Sign.findOne({email});
        if(!user){
           console.log("invalid email")
           res.status(401).json({error:'invalid email'})

        }
        if(user.password!=password){
            console.log('invalid password');
            res.status(401).json({error:'invalid password'})
        }
        // res.status(200).json({message:'Login Succuessfull'})
        res.redirect('/Loginsuccess')
      
    }
    catch{
        res.status(500).json({error:'Login Failed'})
    }

})
//login end here


//show data
app.get('/Index',(req,res)=>{
    database.find({}).then(Index=>{
        const table=`
        <table>
        <tr>
        <th>Full Name</th>
        
        <th>Email</th>
        <th>Password</th>
        <th>D.O.B</th>
        <th>Image</th>
        <th>Gender</th>
        <th>Action</th>
      




        </tr>
        
        
        ${Index.map((Index1)=>`
        <tr>
        
        <td>${Index1.name}</td>
        
        <td>${Index1.email}</td>
        &nbsp;
        <td>${Index1.from}</td>
        &nbsp;
        <td>${Index1.to}</td>
       
        <td>${Index1.date}</th>
        <td>${Index1.opt}</th>

        


        <tr/>
        
        `).join('')}

        <table/>`
        res.send(table);
})
.catch((err)=>{
    console.error('error fetching',err);
    res.status(500).send('error');
});
    })
//show data

app.listen(3001,err=>{
    if(!err){
        console.log('Running')
    }
    else{
        console.log('NOt Runnning')
    }
})
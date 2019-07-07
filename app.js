var port                  = process.env.PORT || 8000;
var express               = require("express");
var unirest               = require('unirest');
var request               = require("request");
var mongoose              = require("mongoose");
var passport              = require("passport");
var bodyParser            = require("body-parser");
var flash                 = require("connect-flash");
var User                  = require("./models/user");
var LocalStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
const methodOverride      = require('method-override');

var favteam= null;

mongoose.connect('mongodb+srv://aman:letmein01@cricmaniac-ereth.mongodb.net/test?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useCreateIndex: true
}).then(()=>{
    console.log('connected to db');
}).catch(err =>{
    console.log('ERROR: err.message');
});


var db = mongoose.connection;
var app     = express();


app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(flash());


//Passport Configuration
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Scooby Doo",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var http = require('http');
var server = http.Server(app);

app.listen(port, ()=>{
    console.log("listening on port 8000");
})


app.use(function info(req, res, next){
    currentUser = req.user;
     res.locals.error     = req.flash("error");
     res.locals.success   = req.flash("success");

    next();
 });


// Routes

// sign up form 
app.get("/register", function(req, res){
    res.render("register"); 
 });

// login form
app.get("/", function(req, res){
    res.render("home");    
})


 //handling user sign up
 app.post("/register", function(req, res){
    User.register(new User({username: req.body.username, fav: req.body.fav}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('home');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/love");
        });
    });
});

app.put("/fav", function(req, res){
    User.findOneAndUpdate({username: currentUser.username},{$set:{fav: req.body.fav}}, function(err, user){
        if(err){
            console.log(err);
            return res.render('about');
        }
         //passport.authenticate("local")(req, res, function(){
            console.log(currentUser)
           
            res.redirect("/love");
         //});
    });
  
})



//login logic and middleware
app.post("/", passport.authenticate("local", {
    
    successRedirect: "/love",
    failureRedirect: "/"
}) ,function(req, res){
       console.log("hello")
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}



app.get("/leaderboard",function(req,res){
    unirest.get("https://dev132-cricket-live-scores-v1.p.rapidapi.com/seriesstandings.php?seriesid=2181")
    .header("X-RapidAPI-Host", "dev132-cricket-live-scores-v1.p.rapidapi.com")
    .header("X-RapidAPI-Key", "0e8fa337camsh8b1db3ec644c942p1568e6jsn4b3c9392a451")
    .end(function (result) {
    //console.log(typeof(result.body));
        data = result.body;
    res.render("leaderboard", {data:data})
    });

});




app.get("/live",function(req,res){
    
    var query = req.query.search;
    var team1 = req.query.team1;
    var team2 = req.query.team2;
    var url   = "https://dev132-cricket-live-scores-v1.p.rapidapi.com/scorecards.php?seriesid=2181&matchid=" + query;
   
    unirest.get(url)
    .header("X-RapidAPI-Host", "dev132-cricket-live-scores-v1.p.rapidapi.com")
    .header("X-RapidAPI-Key", "0e8fa337camsh8b1db3ec644c942p1568e6jsn4b3c9392a451")
    .end(function (result) {
      //console.log(result.status, result.headers, result.body);
       data = result.body;
    //    console.log(req.query.search);

         console.log(team2);
        

        res.render("live", {data:data, t1: team2, t2: team1 });
    });

});


app.get("/matches",function(req,res){
    unirest.get("https://dev132-cricket-live-scores-v1.p.rapidapi.com/matches.php?completedlimit=100&inprogresslimit=100&upcomingLimit=100")
    .header("X-RapidAPI-Host", "dev132-cricket-live-scores-v1.p.rapidapi.com")
    .header("X-RapidAPI-Key", "0e8fa337camsh8b1db3ec644c942p1568e6jsn4b3c9392a451")
    .end(function (result) {
      //console.log(result.status, result.headers, result.body);
       data = result.body
        res.render("matches", {data:data});
    });

});

//fav


const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('34bc2160489a4163b981c2ba614fec10');


app.get("/news", function(req,res){
    request('https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=34bc2160489a4163b981c2ba614fec10',
    function(error, response, body){
        var data = JSON.parse(body) 

        if(error){
            console.log("Something went Wrong!")
            console.log(error)
        } else 
            {    
           res.render("news",{data:data})
           }
    })
})

app.get("/fav",function(req,res){
 favteam = req.query.fav;
 console.log(favteam);
     res.redirect("/love");
})



app.get("/love",isLoggedIn,function(req,res){
    unirest.get("https://dev132-cricket-live-scores-v1.p.rapidapi.com/matches.php?completedlimit=100&inprogresslimit=100&upcomingLimit=100")
    .header("X-RapidAPI-Host", "dev132-cricket-live-scores-v1.p.rapidapi.com")
    .header("X-RapidAPI-Key", "0e8fa337camsh8b1db3ec644c942p1568e6jsn4b3c9392a451")
    .end(function (result) {
     
       var dataa = result.body;
    //    favteam = req.query.fav;
        
       var fav = currentUser.fav;
       console.log(fav);
        
        if(fav== 'IND'){
                 var newsurl = "https://newsapi.org/v2/top-headlines?q=india&category=sports&sortBy=publishedAt&apiKey=34bc2160489a4163b981c2ba614fec10";
                }
        if(fav== 'AGF'){
                 var newsurl = "https://newsapi.org/v2/top-headlines?q=afghanistan&category=sports&sortBy=publishedAt&apiKey=34bc2160489a4163b981c2ba614fec10";
                }
        if(fav== 'AUS'){
                 var newsurl = "https://newsapi.org/v2/top-headlines?q=australia&category=sports&sortBy=publishedAt&apiKey=34bc2160489a4163b981c2ba614fec10";
                }
        if(fav== 'BAN'){
                 var newsurl = "https://newsapi.org/v2/top-headlines?q=bangladesh&category=sports&sortBy=publishedAt&apiKey=34bc2160489a4163b981c2ba614fec10";
                }
        if(fav== 'ENG'){
                 var newsurl = "https://newsapi.org/v2/top-headlines?q=england&category=sports&sortBy=publishedAt&apiKey=34bc2160489a4163b981c2ba614fec10";
                }
        if(fav== 'NZ'){
                 var newsurl = "https://newsapi.org/v2/top-headlines?q=new%20zealand&category=sports&sortBy=publishedAt&apiKey=34bc2160489a4163b981c2ba614fec10";
                }
        if(fav== 'PAK'){
                 var newsurl = "https://newsapi.org/v2/top-headlines?q=pakistan&category=sports&sortBy=publishedAt&apiKey=34bc2160489a4163b981c2ba614fec10";
                }
        if(fav== 'SA'){
                 var newsurl = "https://newsapi.org/v2/top-headlines?q=south%20africa&category=sports&sortBy=publishedAt&apiKey=34bc2160489a4163b981c2ba614fec10";
                }
        if(fav== 'SL'){
                 var newsurl = "https://newsapi.org/v2/top-headlines?q=sri%20lanka&category=sports&sortBy=publishedAt&apiKey=34bc2160489a4163b981c2ba614fec10";
                }
        if(fav== 'WI'){
                var newsurl = "https://newsapi.org/v2/top-headlines?q=west%20indies&category=sports&sortBy=publishedAt&apiKey=34bc2160489a4163b981c2ba614fec10";
                }               
            
            
            unirest.get("https://dev132-cricket-live-scores-v1.p.rapidapi.com/seriesstandings.php?seriesid=2181")
            .header("X-RapidAPI-Host", "dev132-cricket-live-scores-v1.p.rapidapi.com")
            .header("X-RapidAPI-Key", "0e8fa337camsh8b1db3ec644c942p1568e6jsn4b3c9392a451")
            .end(function (result) {
            //console.log(typeof(result.body));
                standingsdata = result.body;
                // console.log(standingsdata)
            })
       request(newsurl ,function(error, response, body){
           var datanews = JSON.parse(body);
            res.render("love", {dataa: dataa, datanews: datanews, fav: fav, standingsdata: standingsdata});

        })
    
        //  User.find({username: "God"}, function(err, items){
        //      console.log(items);
        //  })
        
    });
   

});


//quiz

app.get("/quiz", function(req, res){
    res.render("quiz")
    console.log(currentUser)
})


app.get("/about", function(req, res){
    res.render("about");    
})




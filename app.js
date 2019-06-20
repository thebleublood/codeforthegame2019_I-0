var express = require("express");
var app     = express();
var request = require("request");
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

var cricapi = require("cricapi");

cricapi.setAPIKey("lgtEZ6vTfiQ3ToDh3bznIPJxToM2");

app.get("/matches", function(req,res){
    cricapi.matches(function(error, databundle){ 
        var data = JSON.parse(databundle) 
         //console.log(databundle);
         res.render("matches", {data:data});
    
    });
})


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





 app.get("/", function(req, res){
    res.render("home");    
})

app.get("/about", function(req, res){
    res.render("about");    
})


app.listen("8000", ()=>{
    console.log("listening on port 8000");
})


const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
res.sendFile(__dirname + "/index.html");
});


app.post("/", function(req,res){

const querry = req.body.cityName;
const apiKey = "e144718680d06e20021a6ce885c73b92";
const units = "metric";
const url = ("https://api.openweathermap.org/data/2.5/weather?q=" + querry + "&units=" + units + "&appid=" + apiKey);
https.get(url,function(response){
    console.log(response.statusCode);

    response.on("data",function(data){
        var weatherData = JSON.parse(data)

        const weatherDescription = weatherData.weather[0].description
        const temp = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const pressure = weatherData.main.pressure;
        const icon = weatherData.weather[0].icon
        const imgURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
        res.write("<h1>Temperature in " + querry + " is: "+ temp + " Degree Celcius</h1>");
        res.write("<h3>The weather condition in " + querry + " is: " + weatherDescription + "</h3>");
        res.write("<img src=" + imgURL + ">");
        res.write("<h3>Humidity in " + querry + " is: "+ humidity + "</h3>");
        res.write("<h3>Pressure in " + querry + " is: "+ pressure + "</h3>");

        res.send();

    })
})
 
})








app.listen(3000,function(){
    console.log("Server started");
})
const express = require('express');
const jsonfile = require('jsonfile');

const app = express();

//Allowing CORS 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse application/json
app.use(express.json());
app.use(express.urlencoded({extended :true}));

//Setting json file path and a storage variable
const file = 'file.json';
var data;

//Reading json file
jsonfile.readFile(file, function (err, obj) {
    if (err) console.error(err)
    data = obj;
  });



app.post('/check', (req, res)=>{
    var response = {
        canWatch: 'false',
        url: 'https://vtop.vit.ac.in/vtop/initialProcess'
    }
    console.log(req.body);
    const curDate = new Date(req.body.date);
    const prevDate = new Date(data.date);
    console.log('Current date is ',curDate.getDate());
    console.log('Prev date is ', prevDate.getDate());
    //Check if the first watch of the day
    if(prevDate.getDate() == curDate.getDate()){
        res.send(JSON.stringify(response));
    } else {

        //Ok redirect to new url
        var url = data.url;
        url = url.replace('SeNr', data.season);
        url = url.replace('EpNr', data.episode);
        
        //Set response object
        response.url = url;
        response.canWatch = true;
        
        //Update current data
        if(data.episode == '24'){
            data.episode = '1';
            data.season = String(Number(data.season) + 1);
        } else {
            data.episode = String(Number(data.episode) + 1);
        }

        //Update the date to current date
        data.date = curDate;

        //Write data back to file
        jsonfile.writeFile(file, data, function (err) {
            if (err) console.error(err);
          });
        
        res.send(JSON.stringify(response));

    }
});


app.listen(process.env.PORT || 3000, ()=>{
    console.log("Listening to port");
});
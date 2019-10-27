const express = require('express');
const jsonfile = require('jsonfile');

const app = express();

const file = 'file.json';
var data;

//Reading json file
jsonfile.readFile(file, function (err, obj) {
    if (err) console.error(err)
    data = obj;
  });

app.get('/', (req, res)=>{
    res.send(data);
})
app.post('/check', (req, res)=>{
    var response = {
        canWatch: 'false',
        url: 'https://vtop.vit.ac.in/vtop/initialProcess'
    }
    curDate = req.body.date;
    //Check if the first watch of the day
    if(data.date == curDate){
        res.send(JSON.stringify(response));
    } else {

        //Ok redirect to new url
        var url = data.url;
        url.replace('SeNr', data.season);
        url.replace('EpNr', data.episode);
        
        response.url = url;
        data.url = url;
        //Update current data
        if(data.episode == '24'){
            data.episode = '1';
            data.season = String(Number(data.season) + 1);
        } else {
            data.episode = String(Number(data.episode) + 1);
        }

        //Write data back to file
        jsonfile.writeFile(file, data, function (err) {
            if (err) console.error(err);
          });
        
        res.send(JSON.stringify(response));

    }
})
app.listen(3000 || process.env.PORT, ()=>{
    console.log('Listening to some port');
});
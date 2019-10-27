const express = require('express');

const app = express();

app.get('/', (req, res)=>{
    res.send('Works');
})

app.listen(3000 || process.env.PORT, ()=>{
    console.log('Listening to some port');
});
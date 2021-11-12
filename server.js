const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config();

var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(express.static('public'));

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})


// Your credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Configuration for the client
const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

const translateText = async (text, targetLanguage) => {

    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        console.log(`Error at translateText --> ${error}`);
        return 0;
    }
};

app.get('/translate', urlencodedParser, function (req, res) {
    const text = req.query.txt
    const target = req.query.target
    console.log(text);
    console.log(target);
    translateText(text, target)
    .then((result) => {
        console.log(result)
        res.send('text =  ' + result);
    })
    .catch((err) => {
        console.log(err);
    });
})

var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://localhost", port)
})

const express = require('express');

const app = express();

app.use(express.static(__dirname+'/dist/angular-playground'));

app.get('/*', (req, resp) => {
    resp.sendFile(__dirname+'/dist/angular-playground/index.html');
});

app.listen(process.env.PORT || 8080);
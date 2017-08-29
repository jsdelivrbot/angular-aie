const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist'));

app.listen(process.env.Port || 8080);

app.get ('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
})


console.log("Listening !");

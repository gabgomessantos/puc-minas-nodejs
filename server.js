require('dotenv').config()

const express = require ('express')
const cors = require('cors');
const path = require ('path')
const app = express ()
const apiRouter = require('./api/routes/apiRouter.js')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/app', express.static (path.join (__dirname, '/public')))

let port = process.env.PORT || 3000

app.listen(port, function () {
    console.log(`The SERVER HAS STARTED ON PORT: ${port}`);
  })
  //   Fix the Error EADDRINUSE
  .on("error", function (err) {
    process.once("SIGUSR2", function () {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
      // this is only called on ctrl+c, not restart
      process.kill(process.pid, "SIGINT");
    });
  });

app.use ('/api/v1', apiRouter)

const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const server = require('http').createServer(app)
const io =  require('socket.io')(server)
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');

io.origins((origin, callback)=>{
  if(origin !== 'http://localhost:3000'){
    console.log("callbacks false")
    return callback('origin not allowed', false) 
  }
  console.log("callbacks true")
  callback(null, true)
})
io.on('connection', (socket) => {
  console.log('connected to client')
})
    

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB (react reading list)
mongoose.connect(
 process.env.MONGODB_URI || 'mongodb://localhost/reactreadinglist',
 {
 //  useMongoClient: true
 }
);
// Define API routes here

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});

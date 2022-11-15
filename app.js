const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 3000;
const MONGODB_URL = 'mongodb://localhost:27017/mongo-1';

mongoose.connect(MONGODB_URL, { useNewUrlParser: true });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${MONGODB_URL}`)
})


const VisitorModel = mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  count: {
    type: Number,
    default: 1,
  },
});

const Visitor = mongoose.model('Visitor', VisitorModel);
/***************************************************/
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const visitors = await Visitor.find({});
  res.render("index.ejs", { visitors });
});


app.post("/", async (req, res) => {
  const { query: { name } } = req;
  const paramName = name ? name : 'Anónimo';
  let visitor;

  const visitorBody = {
    name: paramName,
  }

  const transaction = {
    name: paramName, 
    $and:[ { name: { $ne: 'Anónimo' } } ],
    $inc : {count : 1}
  };

  const found = await Visitor.findOneAndUpdate(transaction);
  console.log('found: ', found);
  if(!found) visitor = new Visitor(visitorBody);
  else visitor = new Visitor(found);

  try {
    await visitor.save();
    return res.status(200).send(visitor);
  } catch (err) {
    return res.status(400).json({
      err
    })
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


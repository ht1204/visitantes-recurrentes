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
  console.log('paramName: ', paramName);

  const visitorBody = {
    name: paramName,
    $and: [{ name: { $ne: 'Anónimo' } }],
  }

  const transaction = {
    $inc: { count: 1 }
  };



  try {

    const visitorUpdated = await Visitor.findOneAndUpdate(visitorBody, transaction, {
      new: true, 
      runValidators: true 
    });

    if (visitorUpdated) visitor = new Visitor(visitorUpdated);
    else visitor = new Visitor({ name: paramName });

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


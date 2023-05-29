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


const VisitorSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  count: {
    type: Number,
    default: 1,
  },
});

const Visitor = mongoose.model('Visitor', VisitorSchema);
/***************************************************/
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
 try {
   const {
     query: { name },
   } = req;
   const paramName = name ? name : 'Anónimo';

   const visitorBody = {
     name: paramName,
     $and: [{ name: { $ne: 'Anónimo' } }],
   };

   const transaction = {
     $inc: { count: 1 },
   };

   let visitor;

   const visitorUpdated = await Visitor.findOneAndUpdate(
     visitorBody,
     transaction,
     { new: true, upsert: true }
   );

   if (visitorUpdated) visitor = visitorUpdated;
   else visitor = new Visitor({ name: paramName });

   await visitor.save();

   const visitors = await Visitor.find({});
   res.render('index.ejs', { visitors });
 } catch (err) {
   res.status(500).send('Server Error');
 }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


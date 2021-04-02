const express = require("express");
const bodyParser = require("body-parser");
const password = "ArifulIslamRaju000";
const ObjectId = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yaeov.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productCollection = client.db("rajudb").collection("products");

  app.get("/product", (req, res) => {
    productCollection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product).then((result) => {
      console.log("data added succesfully");
      res.send("success");
    });
  });

  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });

  app.path("/update/:id", (req, res) => {
    productCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { price: req.body.price, quentity: req.body.quentity },
        }
      )
      .then((result) => {
        console.log(result);
      });
  });

  app.delete("/delete/:id", (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
      });
    console.log(req.params.id);
  });
});
//////////////////
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.listen(5000);


const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const app = express();

const uri = "mongodb+srv://organicUser:123456test@cluster0.ez7qy.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


client.connect(err => {
  console.log(err);
  const productCollection = client.db("organicdb").collection("products");


  app.get('/products', (req, res) => {

    productCollection.find({}).limit(6)
      .toArray((err, documents) => {
        res.send(documents);
      })

  })

  //Update Product

  app.get('/product/:id', (req, res) => {

    productCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0])
      })
  })


  app.post("/addProduct", (req, res) => {

    productCollection.insertOne(req.body)

      .then(result => {

        console.log("Data added successfully");
        res.redirect("/");
      })
  });


  //updating

  app.patch('/update/:id',(req,res)=>{

    productCollection.updateOne({ _id: ObjectID(req.params.id) },
    {
      $set : {price: req.body.price, quantity: req.body.quantity}
    })

    .then(result=>{
      
      res.send( result.matchedCount > 0);

    })
  })



  app.delete('/delete/:id', (req, res) => {

    console.log(req.params.id);
    productCollection.deleteOne({ _id: ObjectID(req.params.id) })

      .then(result => {

        res.send(result.deletedCount>0);

      })

  })



});


app.listen(5000, () => console.log("Pot 5000, successfully"));



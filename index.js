const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors')
require('dotenv').config()
const app=express();
const port=process.env.PORT||5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.axhaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

   try{
       await client.connect();
       const database = client.db("glory_hotel")
       const planCollections=database.collection("planCollections");
       const orderCollections=database.collection("orderCollections");

    // Getting all plans api 
       app.get('/plans',async(req,res)=>{
        const cursor = planCollections.find({})
        const result=await cursor.toArray();
        res.send(result);
       })
    //    Getting single plan api 
    app.get('/plans/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:(ObjectId(id))}
        const result= await planCollections.findOne(query);
       res.send(result);
    })
    // Posting plan api 
    app.post('/plans',async(req,res)=>{
       const newPlan=(req.body);
       const result = await planCollections.insertOne(newPlan);
       res.json(result);
    })
    // Order Place api 
    app.post('/orders',async(req,res)=>{
        const newOrder=(req.body);
        const result = await orderCollections.insertOne(newOrder);
        res.json(result)
    })

    // My Order getting Api 
    app.get('/orders',async(req,res)=>{
        if(req.query.email){
        const email= await (req.query.email);
        const query={email:email}
        const cursor = orderCollections.find(query);
        const result=await cursor.toArray();
        res.send(result);}
        else{
            const cursor = orderCollections.find({});
            const result=await cursor.toArray();
            res.send(result);
        }
    })

    // Deleting from My order api 
    app.delete('/orders/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const result = await orderCollections.deleteOne(query);
        res.json(result)
    })

    // Updating status 
    app.put('/orders/:id',async(req,res)=>{
        const id=req.params.id;
        const updatedBook=req.body;
        const filter={_id:ObjectId(id)};
        const updateDoc = {
            $set: {
              status:updatedBook.status
            },
          };
          const result = await orderCollections.updateOne(filter, updateDoc);
          res.json(result);

    })

   }
   finally{

   }
}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('The Glory Hotel Running');
})
app.listen(port,()=>{
    console.log("Listening at ",port);
})
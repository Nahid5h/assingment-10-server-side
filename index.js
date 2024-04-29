const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT ||5000;


// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1j9pcmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const spotCollection = client.db('spotDB').collection('spot');
    app.get('/spot',async (req,res)=>{
      const cursor =spotCollection.find();
      const result =await cursor.toArray();
      res.send(result)

    })
    app.get('/myCard/:email', async (req,res)=>{
      // console.log(req.params.email);
      const result = await spotCollection.find({email:req.params.email}).toArray();
      res.send(result)
    })

    app.post('/addSpot', async(req,res)=>{
      const newSpot =req.body;
      console.log(newSpot)
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);

    })
    app.put("/update/:id", async (req,res)=>{
      const id =req.params.id;
      const filter ={_id:new ObjectId(id)}
      const option ={upsert:true};
      const updateSport= req.body;
      const spot ={
        $set:{
          image :updateSport.image,
          tourists_spot_name:updateSport.tourists_spot_name,
        
         country_Name:updateSport.country_Name,
          location:updateSport.location ,
          description:updateSport.description,
          average_cost:updateSport.average_cost,
          seasonality:updateSport.seasonality,
          travel_time:updateSport.travel_time,
             
          totalVisitorsPerYer:updateSport.totalVisitorsPerYer
        }
      }
      result = await spotCollection.updateOne(filter,spot,option)
     res.send(result)
    })

    app.get("/viewDetail/:id", async(req,res)=>{
      const result = await spotCollection.findOne({_id:new ObjectId(req.params.id),
      })
      res.send(result)
    })
    app.delete("/delete/:id", async (req,res)=>{
      const id =req.params.id;
      console.log(id);
      // const query ={ _id: new ObjectId(id)}
      const result = await spotCollection.deleteOne({_id: new ObjectId(req.params.id),
      })
      console.log(result)
      res.send(result);
    })
   
   
    
     


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('travelling server is running')
})
app.listen(port,()=>{
    console.log(`Traveling server is runing on port:${port}`)
})
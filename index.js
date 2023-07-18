const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//middleware
app.use(cors());
app.use(express.json());

//office_attendance
//Hjes6LQSpsc08sRU

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r3tx4xp.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const usersCollection = client.db("Attendance_form").collection("users");

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user?.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send([]);
      } else {
        const result = await usersCollection.insertOne(user);
        res.send(result);
      }
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.patch('/users/admin/:id', async(req,res)=>{
        const id = req.params.id ;
        const filter = {_id : new ObjectId(id)}
        const updateDoc ={
            $set : {
                role : 'Admin'
            }
        }
        const result = await usersCollection.updateOne(filter,updateDoc);
        res.send(result)
    })
    app.patch('/users/employee/:id', async(req,res)=>{
        const id = req.params.id ;
        const filter = {_id : new ObjectId(id)}
        const updateDoc ={
            $set : {
                role : 'Employee'
            }
        }
        const result = await usersCollection.updateOne(filter,updateDoc);
        res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Office Attendance Is Running !");
});

app.listen(port, () => {
  console.log(`Office Attendance is running  on port ${port}`);
});

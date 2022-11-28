const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const token = jwt.sign({ foo: 'bar' }, '9690918162653d5395551d2e5fdf7d3255505848ac0254014adc26d29887fcafc61718a988a2fcd3ffb8beed815732414ebe6936df795c5ab14c0b9d47a37945');
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000


//middle ware
app.use(cors())
app.use(express.json())
        
//user: dbuserassig
//password: Pcmb5QZVboNCvCAv   

   
const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.DB_PASSWORD}@cluster0.nyumefd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next ){
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send("unauthorized access")
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token , process.env.ACCESS_TOKEN, function(err, decoded){
    if(err){
      return res.status(403).send({message: 'forbidden access'})
    }
    req.decoded = decoded;
    next()
  })

}

async function run() {
    try {
      // const appointmentOptions = client.db('doctors-portal').collection('appointmentOptions')
      const bookingsCollection = client.db('assignment-12').collection('bookingsCollection')
      const usersCollection = client.db('assignment-12').collection('users')
      const productsCollection = client.db('assignment-12').collection('products')
      // SERVICE
      // app.get('/appointmentOptions', async(req, res)=>{
      //   const date = req.query.date ;
      //   const query = {};
      //   const cursor = appointmentOptions.find(query);
      //   const options = await cursor.toArray();
        // const bookingQuery = {appointmentDate: date}
        // const alreadyBooked = await bookingQuery.find(bookingQuery).toArray();
        // options.forEach(option =>{
        //   const optionBooked = alreadyBooked.filter(book => book.treatment === option.name )
        //   console.log(optionBooked);
        // } )
      //   res.send(options);
      // });
      // app.get('/services/:id', async(req, res)=>{
      //   const id = req.params.id;
      //   const query = {_id: ObjectId(id)};
      //   const services = await serviceCollection.findOne(query);
      //   res.send(services);

      // })
      // app.post('/services', async(req, res)=>{
      //   const service = req.body
      //   console.log(service)
      //   const result = await serviceCollection.insertOne(service)
      //   res.send(result)
      // }) 
      
      
   


      
      // Booking
      app.post('/bookings', async(req, res)=>{
        const booking = req.body
        console.log(booking)
        const result = await bookingsCollection.insertOne(booking)
        res.send(result)
      })
      app.get('/bookings', async(req, res)=>{
        console.log(req.query);
        let query = {};
        if(req.query.email){
          query = {
            email : req.query.email
          }
        }
        const cursor = bookingsCollection.find(query);
        const product = await cursor.toArray();
        res.send(product);
      });
      // app.get('/products', async(req, res)=>{
      //   console.log(req.query);
      //   let query = {};
      //   if(req.query.email){
      //     query = {
      //       email : req.query.email
      //     }
      //   }
      //   if(req.query.service){
      //     query = {
      //       service : req.query.service
      //     }
      //   }
      //   const cursor = productsCollection.filter(query);
      //   const product = await cursor.toArray();
      //   res.send(product);
      // });
      // app.get('/reviews/:id', async(req, res)=>{
      //   const id = req.params.id;
      //   const query = {_id: ObjectId(id)};
      //   const review = await reviewCollection.findOne(query);
      //   res.send(review);

      // })
      // app.put('/reviews/:id', async(req, res)=>{
      //   const id = req.params.id;
      //   const filter = {_id: ObjectId(id)};
      //   const review = req.body;
      //   const options = {upsert: true}
      //   const updatedReview = {
      //     $set: {
      //       message: review.message
      //     }
      //   }
      //   const result = await reviewCollection.updateOne(filter, updatedReview, options);
      //   res.send(result);
      // })
      // app.delete('/reviews/:id', async(req, res)=>{
      //   const id = req.params.id;
      //   const query = {_id: ObjectId(id)};
      //   const result = await reviewCollection.deleteOne(query)
      //   console.log(result);
      //   res.send(result)
      // })
      






      // app.put('/reviews/:id', async(req, res)=>{
      //   const id = req.params.id;
      //   const filter = {_id: ObjectId(id)};
      //   const review = req.body;
      //   const options = {upsert: true}
      //   const updatedReview = {
      //     $set: {
      //       message: review.name,         
      //     }   
      //   }      
      //   const result = await reviewCollection.updateOne(filter, updatedReview, options);
      //   res.send(result);
      // })
      app.put('/products/:id' , async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: ObjectId(id)};
        const options = {upsert: true}
        const updatedStatus = {
          $set: {
            status: 'advertise'
          }
        }
        const result = await productsCollection.updateOne(filter, updatedStatus, options);
        res.send(result);
      })
      app.post('/products', async(req, res)=>{
        const products = req.body
        const result = await productsCollection.insertOne(products)
        res.send(result)
      })
      app.delete('/products/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await productsCollection.deleteOne(query)
        console.log(result);
        res.send(result)
      })

      app.get('/products', async(req, res)=>{
        console.log(req.query);
        let query = {};
        if(req.query.category){
          query = {
            category : req.query.category
          }
        }
        if(req.query.email){
          query = {
            email : req.query.email
          }
        }
        if(req.query.status){
          query = {
            status : req.query.status
          }
        }
        const cursor = productsCollection.find(query);
        const product = await cursor.toArray();
        res.send(product);
      });


      // user

    
      app.get('/users', async(req, res)=>{
        console.log(req.query);
        let query = {};
        if(req.query.role){
          query = {
            role : req.query.role
          }
        }
        if(req.query.email){
          query = {
            email : req.query.email
          }
        }
        const cursor = usersCollection.find(query);
        const user = await cursor.toArray();
        res.send(user);
      });
      app.get('/user/admin/:email', async(req, res)=>{
        const email = req.params.email;
        const query = {email}
        const user = await usersCollection.findOne(query);
        res.send({isAdmin: user?.role === 'admin'});
      })

      app.post('/users', async(req, res)=>{
        const user = req.body;
        const result = await usersCollection.insertOne(user)
        res.send(result)
      })
      app.put('/users/admin/:id' , verifyJWT, async(req, res)=>{
        const decodedEmail = req.decoded.email;
        const query = {email : decodedEmail};
        const user = await usersCollection.findOne(query);
        if(user.role !== 'admin'){
          return res.status(403).send({message : 'forbidden access'})
        }
        const id = req.params.id;
        const filter = {_id : ObjectId(id)}
        const options = {upsert: true};
        const updatedDoc = {
          $set: {
            role: 'admin'
          }
        }
        const result = await usersCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
      })
      app.delete('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await usersCollection.deleteOne(query)
        console.log(result);
        res.send(result)
      })
         // JWT
         app.get('/jwt', async(req, res)=>{
          const email = req.query.email;
          const query = {email: email};
          const user = await usersCollection.findOne(query);
          if(user){
            var token = jwt.sign({email}, process.env.ACCESS_TOKEN , { expiresIn: '1h' });
            return res.send({accessToken: token});
          
          }
          console.log(user);
          res.status(403).send({accessToken: ""})
          
        })
      
    } 
    finally {
    }
  }
  run().catch(err => console.log(err));

  




app.get( '/' , (req , res) =>{
    res.send('AllhamDulillah Server is Running')
});

app.listen(port, () =>{
    console.log(` Server Running On Poort ${port}`);
} )
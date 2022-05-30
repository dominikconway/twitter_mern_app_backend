// DEPENDENCIES
require("dotenv").config()
// pull PORT from .env, give default value of 3001
// pull DATABASE_URL from .env
const { PORT = 3001, DATABASE_URL } = process.env

const express = require("express")
const app = express()

const mongoose = require("mongoose")

// Middleware
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Database Connection
mongoose.connect(DATABASE_URL)

mongoose.connection
  .on("open", () => console.log("You are connected to MongoDB"))
  .on("close", () => console.log("You are disconnected from MongoDB"))
  .on("error", (error) => console.log(error))


const TweetSchema = new mongoose.Schema(
    {
        body: String,
        author: String,
        likes: { type: Number, default: 0 },
         
}, {timestamps: true}
)

const Tweet = mongoose.model('Tweet', TweetSchema)


// test route
app.get("/", (req, res) => {
  res.send("hello world")
})

// index 
app.get('/tweets', async (req, res) => {
    try {
        let response = await Tweet.find({})
        res.json(response)
    } catch(error) {
        res.status(400).json(error)
    }
})

// delete
app.delete('/tweets/:id', async (req, res) => {
    try {
        res.json( await Tweet.findByIdAndDelete(req.params.id))
    } catch(error) {
        res.status(400).json(error)
    }
})

// update
app.put('/tweets/:id', async (req, res) => {
    try {
        res.json( await Tweet.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) { 
        res.status(400).json(error)
    }
})

// create 
app.post('/tweets', async (req, res) => {
    try {
        res.json(await Tweet.create(req.body))
    } catch(error) {
        res.status(400).json(error)
    }
})






///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))


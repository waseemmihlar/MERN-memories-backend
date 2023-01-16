import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import posts from './routes/posts.js'
import bodyParser from 'body-parser'
import user from './routes/user.js'

const app=express();


app.use(bodyParser.json({limit:'30mb',extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}))
app.use(cors())


dotenv.config({
    path:'.env'
})

const port=process.env.PORT || 5000


app.use('/posts',posts)
app.use('/user',user)

mongoose.set('strictQuery', false)

mongoose.connect(process.env.CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(()=>app.listen(port,()=>{
            console.log(`Server running on port : ${port}`)
        }))
        .catch(err=>console.log(err))









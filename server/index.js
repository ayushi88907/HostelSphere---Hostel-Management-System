import dotenvConfig from './src/utils/dotenv.config.js';
dotenvConfig();

import express from 'express'
import { dbConnect } from './src/db/dbConnection.js';

const app = express();
const port = process.env.PORT;


// middleware 
app.use(express.static("public"));
app.use(express.json());


// routing...
app.get("/", (req, res)=>{
    res.send("Initial Testing...");
})


dbConnect()
.then((db) => {

    app.listen(port , () => {
        console.log("Database is successfully connected to port: ", db.connection.port);
        console.log("server is running on port", port)
    })

})
.catch((error) => {
    console.log("Server is stop due to: ", error.message);
})


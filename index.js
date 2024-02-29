const express = require("express");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 4000;

// for fetch something the body
app.use(express.json());

//call the database
require("./config/database").connect();

//route import and mount

const user = require("./routes/user");
app.use("/api/v1",user);

//activate

app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`);
})
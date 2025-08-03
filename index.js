// importing
const express = require('express')
const dotenv = require("dotenv")
const UserRoutes=require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes");
var cors = require('cors')


// initialize
const app = express()
dotenv.config()
require("./config/connection")

// midd
app.use(express.json());
app.use(cors())

// routes
app.use("/api/user",UserRoutes)
app.use("/api/posts", postRoutes);

// port setting
const PORT =process.env.PORT

app.listen(PORT, () => {
    console.log(`port is Running ${PORT}`);
  });

const express = require("express");
const mongoose  = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();
require('dotenv').config();

const { requireAuth } = require("./middleware/authMiddleware");
const User = require("./models/users");
const userController = require("./controllers/user");

const app = express();
app.use(
  cors({
    origin: [
      "*",
      "http://localhost:3000"
    ],
  })
);
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const URL = "mongodb://127.0.0.1:27017/assignment9";
mongoose.set('strictQuery', false);
mongoose.connect(URL)
.then(()=>{
    app.listen(3100,()=>{
        console.log("Server started on port 3000...");
    });
})
.catch((err)=>{
    console.log("Error while connecting to mongoose");
    console.log(err, err.message);
});



//--------------------setting router and routes--------------------//

router.post("/login",userController.login_post);
router.post("/register",userController.register_post);
router.post("/tasks",requireAuth,userController.get_task);
router.post("/addTask",requireAuth,userController.task_add);
router.post("/changeStatus",requireAuth,userController.status_change);
router.post("/deleteTask",requireAuth,userController.task_delete);


//--------------------setting router and routes--------------------//

app.use("/",router);
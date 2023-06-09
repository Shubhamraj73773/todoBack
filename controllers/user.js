const User = require("../models/users");
const jwt = require("jsonwebtoken");


const createJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

const filterDeleted = (tasks)=>{
    const fTasks=[];
    tasks.map(task=>{
        if(task.is_deleted == false){
            fTasks.push(task);
        }
    })
    return fTasks;
}

module.exports.login_post = async (req,res)=>{
    
    const { email, password } = req.body;
    const user = await User.login(email, password);
    
    const jwtToken = createJWT(user._id);
    
    res.status(200).json({ 
        message: "Login successful!",
        jwt: jwtToken
    });
}

module.exports.register_post = async (req,res)=>{
    
    const {first_name,last_name,email,password,conf_password} = req.body;
    if(password != conf_password) throw Error("Passwords must match");
    
    const user = new User({
        first_name:first_name,
        last_name:last_name,
        email:email,
        password:password,
    });

    user.password = await User.hashPassword(user.password);
    await user.save();
    const jwtToken = createJWT(user._id);
    
    res.status(201).json({ 
        message: "Registration Successful",
        jwt:jwtToken
    });
}

//get task details
module.exports.get_task = async (req,res)=>{
    const user = await User.findById(res.user.id);

    const tasks = filterDeleted(user.tasks);
    res.send(tasks);
}

//add new tasks
module.exports.task_add = async (req,res)=>{
    const user = await User.findById(res.user.id);

    user.tasks.push({
        name:req.body.task_name
    });
    await user.save();

    const tasks = filterDeleted(user.tasks);
    res.send(tasks);
}

module.exports.status_change = async (req,res)=>{
    
    console.log(req.body);
    const user = await User.findById(res.user.id);
    user.tasks.map(task=>{
        if(task.id  == req.body.task_id){
            task.is_completed=req.body.status;
            return;
        }
    })
    await user.save();
    
    const tasks = filterDeleted(user.tasks);
    res.send(tasks);
}

module.exports.task_delete = async (req,res)=>{
    const user = await User.findById(res.user.id);
    user.tasks.map(task=>{
        if(task.id == req.body.task_id){
            task.is_deleted = true;
            return;
        }
    })
    await user.save();
    console.log(user.tasks);

    const tasks = filterDeleted(user.tasks);
    res.send(tasks);
}
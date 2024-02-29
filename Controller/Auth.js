const bcrypt = require("bcrypt");
const User = require("../models/User");
const { json } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//signup router handler
exports.signup = async (req,res) =>{

    try{
        //get data
        const {name,email,password,role} = req.body;

        //check if user already exists yaha hmm check kr rahe ke is email ke corresponding
        //koi entry hai ya nahi ise findout krke lana hai to sbse pehli entry ko ruturn kr denge
        const existingUser = await User.findOne({email});

        //yadi user exists hai to hm bata denge

        if(existingUser)
        {
            return res.status(400).json({
                    success:false,
                    message:'User already exists',
                
            });
        }
        //ab agar email nhi hai to hm password ko secure krenge
        let hashPassword;
        try{
            //pahla password ko hash krna chahte hai dusra 10 round men
            hashPassword = await bcrypt.hash(password,10);

            //HW - how to apply the restart stratergy
        }
        //agr hm password hash nhi kr sake to
        catch(err)
        {
            return res.status(500).json({
                success:false,
                message:"Error in hashing password ",
            })
        }

        //now we create entry for user
        const user = await User.create({
            name,email,password:hashPassword,role
        })
        //then we do send the response
        return res.status(200).json({
            success:true,
            message:'User created Succesfully',
        })


    }

   catch(error){
    console.error(error);
    return res.status(500).json({
        success:false,
        message:'User cannot be registered, please try again later',
    });
   }
}

// Login

exports.login = async (req,res) => {

    try{
        //data fetch
        const {email,password} = req.body;
        //validation on email and password
        if(!email ||! password)
        {
            return res.status(400).json({
                success:false,
                message:"please fill all the details carefully",

            })
        }

        //then we check in db user entry so we use await

        let user = await User.findOne({email});
        
        //if not a registered user 
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            })
        }

        //for from data fetch user

        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        };

        
        //verify password and generate a JWT Token
        // hm password jo user enter v password jo email entry se db se nikale hai 
        //dono ko compare karenge

        if(await bcrypt.compare(password,user.password))
        {
            //password match & we create token

            let token = jwt.sign(payload,
                    process.env.JWT_SECRET,{
                        expiresIn:"2h",
                    }); //sign method and know we create a token

                    //ab is token ko hm user ke andar daal denge user.token for insert token
                 
                    //user.token = token; //if this not work so
                    user = user.toObject(); //for convert user to object
                    user.token = token; 
                    
                    
                    //ab hm user ke andar se password ko hata denge taki hmara user 
                    //safe rahen ye password hmne user ke object se hataya hai n ki database se
                   
                    user.password = undefined;

                    //here we creating a cookie in cookie we have 3 parameter name,data,options

                    const options = {

                        //defining expiry for 3 days tk expire nhi hogi
                        // 3 day 24 hour 60 minute 60 second 1000 milisecond
                        expires: new Date (Date.now() + 3 * 24 * 60 * 60 * 1000  ),

                        //client side pr access nhi kr payenge
                        httpOnly:true,
                    }
                    res.cookie("rahulCookie",token,options).status(200).json({

                        success:true,
                        token,
                        user,
                        message:"User Logged in Succesfully",

                    });

        }
        else{
            //password match nhi huaa
            return res.status(403).json({
                success:false,
                message:"password incorrect",

            })

        }

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            success:'false',
            message:'Login Failure',
        });

    }

}


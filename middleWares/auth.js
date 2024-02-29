
//auth, isStudent, isAdmin
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res)=>{

    try{
        //extract jwt token  (hmara token jo hai vo header ,cookies v body men hai pr hm b
        // body se nikalenge)
        //Pending : other way to fetch token

        const token = req.body.token;
        if(!token){
            return res.status(401).json({
                success:"false",
                message:"Missing Token",
            })
        }
        //verify the token
        try{
            //we use verify method for verify
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            //decode == payload
            console.log(decode);

            //decoded data store with request

            req.user = decode; // used for check the role


        } catch(err){
            return res.status(401).json({
                success:false,
                message:"token is inValid",

            })

        }
        //for go to the nex middleware

        next();

    }
    catch(err)
    {   
        return res.status(401).json({
            success:false,
            message:"something went wrong, while verifying the token",
        });

    }


}

exports.isStudent = (req,res,next) => {

    try{
        // for verify the  role
        if(req.body.role !== 'student'){
            return res.status(401).json({
                success:false,
                messag:"This is the protected route dor student",
            });
        }
        //for go to the next middleware
        next();

    }catch(err){

        return res.status(500).json({
            success:false,
            message:"User role is not matching",
        })


    }

}



exports.isAdmin = (req,res,next) => {

    try{
        // for verify the  role
        if(req.body.role !== 'Admin'){
            return res.status(401).json({
                success:false,
                messag:"This is the protected route dor Admin",
            });
        }
        //for go to the next middleware
        next();

    }catch(err){

        return res.status(500).json({
            success:false,
            message:"User role is not matching",
        })


    }

}

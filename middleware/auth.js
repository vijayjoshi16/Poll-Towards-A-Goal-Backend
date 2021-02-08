const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

exports.requireSignIn = expressAsyncHandler(async (req,res,next)=>{
  try{
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
      } else {
        return res.status(400).json({ error: "Authorization required" });
      }
      next();
  }catch{
    res.status(401).send({error:"Invalid request"});
  }
})
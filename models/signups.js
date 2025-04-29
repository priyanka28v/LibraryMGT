const mongoose=require('mongoose')
const{schema,model}=mongoose

const userSignupSchema=new mongoose.Schema({
    username:({type:String,required:true}),
    email:({type:String,required:true,unique:true}),
    password:({type:String,required:true})
})

const User=model('User',userSignupSchema)
module.exports=User;
const mongoose=require('mongoose')
const {schema,model}=mongoose
const{user}=require('./signups')

const AuthorSchema=new mongoose.Schema({
    AuthorId:{type:String,required:true,unique:true},
    name:String,
    bio:String,
    nationality:String,
})


    const Author=model('Author',AuthorSchema)

    module.exports=Author



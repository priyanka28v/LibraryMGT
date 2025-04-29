const mongoose=require('mongoose')
const { schema } = require('./Authors')
const{user}=require('./signups')
const { Schema,model } = mongoose

const bookSchema=new Schema({
    BookId:{type:String,required:true,unique:true},
    title:{type:String,required:true},
    genre:{type:String,required:true},
    publication_year :{type:Number,required:true},
    AuthorId :{type:String,ref:'Author',required:true},
})
const Book=model('Book',bookSchema)
module.exports=Book;
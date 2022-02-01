import mongoose from 'mongoose';


const documentSchema = new mongoose.Schema({
    docId:{
        type:String,
        required:true,
        trim:true
    },
    docName:{
        type:String,
        required:true,
        trim:true
    },
    content:{
        type:Object
    }
})

const documentModel = mongoose.model('document',documentSchema);
export default documentModel;





















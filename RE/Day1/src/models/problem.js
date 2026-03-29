const mongoose= require('mongoose');
const {Schema}=mongoose;

const problemSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true
    },
    tags:{
        type:String,
        enum:['Array','String','LinkedList','Graph','Tree'],
        required:true
    },
    visibleTextCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true,
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],
    hiddenTextCases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                required:true
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],
    problemCreator:{
        type: Schema.Types.ObjectId,
        ref:'user', 
        required:true
    }
});

const Problem =mongoose.model('problem',problemSchema);

module.exports =Problem;
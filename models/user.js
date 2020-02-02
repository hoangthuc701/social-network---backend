const mongoose = require('mongoose');
const uuid1 = require('uuid/v1');
const crypto = require('crypto');
const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim: true
    },
    email:{
        type: String,
        required:true,
        trim: true
    },
    hashed_password:{
        type: String,
        required:true
    },
    salt:{
        type:String
    },
    created:{
        type:Date,
        default: Date.now
    },
    updated:{
        type: Date
    },
    photo: {
        data: Buffer,
        contentType: String 
    },
    about:{
        type:String,
        trim:true
    },
    following:[{
        type: ObjectId,
        ref:"User"
    }],
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    resetPasswordLink:{
        data:String,
        default:""
    },
    role:{
        type:String,
        default:"subcriner"
    }
});

//virtual method
userSchema
.virtual("password")
.set(function(password){
    //create temporary variabble call _password
    this._password = password;

    //generate a timestamp 
    this.salt = uuid1();

    //encryptPassword 
    this.hashed_password = this.encryptPassword(password)

})
.get(()=>{
    return this._password;
}) 

//methods
userSchema.methods ={
    encryptPassword: function(password){
        if (!password) return "";
        try{
            return crypto
                    .createHmac('sha1',this.salt)
                    .update(password) 
                    .digest('hex');
        } catch(err){
            return "";
        }
    },
    authenticate : function(plainText){
        return this.encryptPassword(plainText) == this.hashed_password;
    }
}


module.exports = mongoose.model("User",userSchema);
import mongoose, { Schema, Document } from "mongoose";


// interface for typesafety

export interface Message extends Document {
    content: string;
    createdAt: Date
}

// Message Schema

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

// User for typesafety

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isverified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

// It makes sure that UserSchema matches the User interface.
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        // for valid email using regex
        match: [/.+\@.+\..+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verify Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verify code expiry is required"],
    },
    isverified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]

})

const UserModel=(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",UserSchema)
export default UserModel

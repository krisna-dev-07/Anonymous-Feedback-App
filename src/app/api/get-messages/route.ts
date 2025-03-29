import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";//not the user which is in the session
import mongoose from "mongoose";

export async function GET(request: Request) {

    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User not Authenticated"
        },
            { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', message: { $push: '$messages' } } }
        ])

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 401 })
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        },
            { status: 201 })
    } catch (error) {
        console.log("An unexpected error occured:", error);

        return Response.json({
            success: false,
            message: "User not unAuthenticated"
        },
            { status: 500 })
    }
}
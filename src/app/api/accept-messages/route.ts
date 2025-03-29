import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";//not the user which is in the session

export async function POST(request: Request) {
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

    const userId = user._id;

    const { acceptMessages } = await request.json()

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to  update  user status to accept messages"
            },
                {
                    status: 401
                })
        }
        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully "
        },
            {
                status: 200
            })
    } catch (error) {
        console.log("failed to  update  user status to accept messages");

        return Response.json({
            success: false,
            message: "failed to  update  user status to accept messages"
        },
            {
                status: 500
            })
    }
}

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

    const userId = user._id;

    const foundUser = await UserModel.findById(userId)

    try {
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "failed to  found user"
            },
                {
                    status: 404
                })
        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        },
            {
                status: 200
            })
    } catch (error) {
        console.log("failed to  update  user status to accept messages");

        return Response.json({
            success: false,
            message: "Error to get message accepting status"
        },
            {
                status: 500
            })
    }
}
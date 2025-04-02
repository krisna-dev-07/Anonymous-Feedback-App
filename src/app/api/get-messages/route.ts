import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if (!session || !_user) {
        return NextResponse.json({
            success: false,
            message: "User not Authenticated"
        }, { status: 401 });
    }

    try {
        const userId = new mongoose.Types.ObjectId(_user._id);
        
        // First check if user exists
        const userExists = await UserModel.findById(userId);
        if (!userExists) {
            return NextResponse.json(
              { message: 'User not found', success: false },
              { status: 404 }
            );
        }

        // Then get messages with aggregation
        const result = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { 
                _id: '$_id', 
                messages: { $push: '$messages' } 
            }}
        ]);

        // Handle case where user has no messages
        if (!result || result.length === 0) {
            return NextResponse.json({
                success: true,
                messages: [] // Return empty array instead of error
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            messages: result[0].messages
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}
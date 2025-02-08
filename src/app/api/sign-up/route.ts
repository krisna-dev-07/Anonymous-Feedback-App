import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User.model"
import bycrpyt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendverificationemailCode"

export async function POST(request: Request) {
    // connect to database
    await dbConnect()

    try {

        // get user data
        const { username, email, password } = await request.json()

        // check if username already exists and verified
        const existingUserVerifiedbyUsername = await UserModel.findOne({
            username,
            isverified: true
        })
        if (existingUserVerifiedbyUsername) {
            return Response.json(
                {
                    success: false,
                    message: "username already taken"
                },
                { status: 400 }
            )

        }

        const existingUserByEmail = await UserModel.findOne({ email })

        const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString()

        // check if email already exists

        if (existingUserByEmail) {

            // check if email is verified
            
            if (existingUserByEmail.isverified) {
                return Response.json(
                    {
                        success: false,
                        message: "user already exists with this email"
                    },
                    { status: 400 }
                )
            }
            // if email is not verified
            else {
                const hashedPassword = await bycrpyt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000)
                await existingUserByEmail.save()
            }
        }

        // create freshly new user
        else {
            const hashedPassword = await bycrpyt.hash(password, 12)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isverified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse.success) {
            return Response.json({

                success: false,
                message: emailResponse.message,
            },
                { status: 500 })

        }
        return Response.json({

            success: true,
            message: "User created successfully. Please check your email for verification code.",
        },
            { status: 200 })
    } catch (error) {

        console.error("Error creating user", error)
        return Response.json(
            {
                success: false,
                message: "failed to create user"
            },
            {
                status: 500
            }
        )
    }
}

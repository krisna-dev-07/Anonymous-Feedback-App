import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";




const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect()

    try {
        // getting entire url
        const { searchParams } = new URL(request.url)

        // getting username from query
        const queryParam = {

            username: searchParams.get('username')
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result);
        // if result has error
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors
                        .join(', ') : 'invalid query parameters'
                }, { status: 400 }

            )
        }

        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({ username, isverified: true })
        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Username isalready taken'
                }, { status: 400 }
            )
        }

        return Response.json(
            {
                success: true,
                message: 'Username is available'
            }, { status: 201 }
        )




    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )
    }
}
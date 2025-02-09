/**
 * This file is needed because we want to extend the default `User` type of
 * `next-auth` to include additional properties that are specific to our
 * application. because if we use user._id to extract id nextauth will not allow to do so
 *
 * By default, `next-auth` only includes the following properties in the
 * `User` type:
 * - `id`: a unique identifier for the user
 * - `name`: the user's name
 * - `email`: the user's email address
 * - `image`: the user's profile picture
 *
 * However, in our application, we also need to store additional information
 * about the user, such as their username, whether they have been verified, and
 * whether they are accepting messages.
 *
 * By declaring the `User` type in this file, we can extend the default `User`
 * type to include these additional properties.
 */

import 'next-auth'
declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
    interface Session {
        user: {

            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string
        } & DefaultSession['user']
    }
}
// alternative way to  declare
declare module 'next-auth/jwt' {
    interface JWT{

        _id ?: string;
        isVerified ?: boolean;
        isAcceptingMessages ?: boolean;
        username ?: string
    }
}

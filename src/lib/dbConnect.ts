import mongoose, { Connection } from "mongoose";
import { DB_NAME } from "./constants";
// Define a type for the connection object
type ConnectionObject = {
    isConnected?: number  // `isConnected` will store the connection status (0: disconnected, 1: connected)
}

// Create a global connection object to track the database connection state
const connection: ConnectionObject = {}

// Define an asynchronous function to establish a database connection
async function dbConnect(): Promise<void> {
    // Check if there is already an existing connection
    if (connection.isConnected === 1) {
        console.log("already connected");
        return;  // Exit the function if already connected
    }

    try {
        // Try to connect to MongoDB using the connection string from environment variables
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {
            dbName: DB_NAME, // Use the database name from constants.ts
        });

        // Store the connection state (1: connected, 0: not connected)
        connection.isConnected = db.connections[0].readyState ?? 0;

        console.log("db connected");
    } catch (error) {
        console.error("db connection error", error);

        process.exit(1); // Exit the process with a failure code (1)
    }
}

export default dbConnect

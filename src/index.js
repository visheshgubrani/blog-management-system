import connectDB from "./db/connectDB.js";
import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config()

connectDB()
.then(() => {
    const port = process.env.PORT || 5000
    
    app.listen(port, () => {
        console.log(`port is running on: ${port}`);
    })
})
.catch((error) => {
    console.log(`Error ${error}`);
    
}) 
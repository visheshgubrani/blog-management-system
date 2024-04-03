import connectDB from "./db/connectDB.js";
import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    const port = process.env.PORT || 5000
    console.log(port);
    
    app.listen(port, () => {
        console.log(`port is running on: ${port}`);
    })
})
.catch((error) => {
    console.log(`Error ${error}`);
    
}) 
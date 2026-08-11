import 'dotenv/config'
import app from "./src/app.js";
import redisClient from './src/config/redis.config.js';
import { connectDB } from './src/config/db.js';

connectDB();

app.listen(process.env.PORT,()=>{
 console.log("server is running on 3000");
})
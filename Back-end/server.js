import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();

// Lista de orígenes permitidos. Añade la URL de tu frontend de producción aquí.
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"];

app.use(cors({
    origin: function (origin, callback) {
        // Permite peticiones sin origen (como Postman) o si el origen está en la lista blanca.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`)
} )
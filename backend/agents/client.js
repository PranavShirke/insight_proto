import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

let client = null;

export const getClient = () => {
    if (!client) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not set in environment variables");
        }
        client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return client;
};

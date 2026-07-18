import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createGoogleVertex } from "@ai-sdk/google-vertex";
import { streamText } from "ai";

dotenv.config();

const vertex = createGoogleVertex({
  apiKey: process.env.GOOGLE_VERTEX_API_KEY,
  location: process.env.GOOGLE_VERTEX_LOCATION,
  project: process.env.GOOGLE_VERTEX_PROJECT,
});

const app = express();
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    console.log("request:", messages);

    const aiMessages = (messages || []).map((m) => {
      const text = (m.parts || []).map((p) => (p && p.text) || "").join("");
      return {
        role: m.role,
        content: text,
      };
    });

    const response = streamText({
      model: vertex("gemini-2.5-flash"),
      messages: aiMessages,
      system: `You name is Unix, ${userContext.name}'s fitness coach. the user is currently trying to achieve their fitness goal of ${userContext.goal}. Recommend workouts for ${userContext.activity}`,
    });

    // response.pipeDataStreamToResponse(res);
    response.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

app.listen(3001, () =>
  console.log("API server listening on http://localhost:3001"),
);

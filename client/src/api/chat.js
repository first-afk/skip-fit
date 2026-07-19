import dotenv from "dotenv";
import { createGoogleVertex } from "@ai-sdk/google-vertex";
import { streamText } from "ai";

dotenv.config();

const vertex = createGoogleVertex({
  apiKey: process.env.GOOGLE_VERTEX_API_KEY,
  location: process.env.GOOGLE_VERTEX_LOCATION,
  project: process.env.GOOGLE_VERTEX_PROJECT,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, userContext } = req.body;

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

    res.setHeader("Content-Type", "text/plain");
    return response.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

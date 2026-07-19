import dotenv from "dotenv";
import { createGoogleVertex } from "@ai-sdk/google-vertex";
import { streamText } from "ai";

dotenv.config();

// Parse the JSON string from the environment variable safely
let googleCredentials;
try {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    googleCredentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }
} catch (error) {
  console.error(
    "Failed to parse Google Service Account JSON. Check your .env or Vercel Environment Variables.",
  );
}

// Initialize Vertex with the parsed credentials
const vertex = createGoogleVertex({
  location: process.env.GOOGLE_VERTEX_LOCATION,
  project: process.env.GOOGLE_VERTEX_PROJECT || googleCredentials?.project_id,
  googleAuthOptions: {
    credentials: {
      client_email: googleCredentials?.client_email,
      private_key: googleCredentials?.private_key?.replace(/\\n/g, "\n"),
    },
    projectId:
      process.env.GOOGLE_VERTEX_PROJECT || googleCredentials?.project_id,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    res.setHeader("Content-Type", "text/plain");
    return response.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

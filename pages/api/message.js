import Pusher from "pusher";
import Sentiment from "sentiment";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});

let messages = []; // Shared in-memory array

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user, message, timestamp } = req.body;

    if (!user || !message) {
      return res.status(400).json({ error: "User and message are required." });
    }

    // Analyze sentiment
    const sentimentAnalyzer = new Sentiment();
    const sentimentResult = sentimentAnalyzer.analyze(message);

    const chat = {
      user,
      message,
      timestamp,
      sentiment: sentimentResult.score,
    };

    messages.push(chat);

    try {
      // Trigger Pusher
      await pusher.trigger("chat-room", "new-message", { chat });

      res.status(201).json({ success: true, chat });
    } catch (err) {
      console.error("Pusher error:", err);
      res.status(500).json({ error: "Pusher trigger failed." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

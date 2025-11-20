const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenAI } = require("@google/genai");
const fs = require('fs');
require('dotenv').config();

const pdfParse = require('pdf-extraction');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 5000;

//CONFIGURATION
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-chatbot";
const GEN_AI_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash"; 

if (!GEN_AI_KEY) {
  console.error("CRITICAL ERROR: GEMINI_API_KEY is missing in .env file");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

//MONGODB SETUP
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

const ChatSchema = new mongoose.Schema({
  userId: String,
  title: String,
  createdAt: { type: Date, default: Date.now }
});
const MessageSchema = new mongoose.Schema({
  chatId: String,
  role: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', ChatSchema);
const Message = mongoose.model('Message', MessageSchema);


const ai = new GoogleGenAI({ apiKey: GEN_AI_KEY });


async function generateContent(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    
    if (response.text) {
      return response.text;
    } else if (response.response && response.response.text) {
        return typeof response.response.text === 'function' 
          ? response.response.text() 
          : response.response.text;
    } else {
        throw new Error("Received empty response from AI");
    }
  } catch (error) {
    console.error(`AI Generation failed using model '${MODEL_NAME}':`, error);
    throw new Error(`AI Error: ${error.message}`);
  }
}

//ROUTES

app.get('/api/chats/:userId', async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/messages/:chatId', async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/chats', async (req, res) => {
  try {
    const newChat = new Chat({ userId: req.body.userId, title: "New Conversation" });
    await newChat.save();
    res.json(newChat);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/chats/:id', async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    await Message.deleteMany({ chatId: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


app.post('/api/message', upload.single('pdf'), async (req, res) => {
  const { chatId, content, userId } = req.body;
  
  try {
    let finalChatId = chatId;
    if (!finalChatId) {
      const newChat = new Chat({ userId, title: content.substring(0, 30) + "..." });
      await newChat.save();
      finalChatId = newChat._id;
    }

    let userContent = content;
    if (req.file) userContent += ` [File: ${req.file.originalname}]`;
    
    const userMsg = new Message({ chatId: finalChatId, role: 'user', content: userContent });
    await userMsg.save();

    let prompt = content;
    if (req.file) {
      const buffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(buffer);
      prompt = `Context from PDF:\n${data.text}\n\nUser Question:\n${content}`;
      fs.unlinkSync(req.file.path);
    }

    const aiText = await generateContent(prompt);

    const aiMsg = new Message({ chatId: finalChatId, role: 'model', content: aiText });
    await aiMsg.save();

    res.json({ chatId: finalChatId, userMessage: userMsg, aiMessage: aiMsg });

  } catch (err) {
    console.error("Processing Error:", err.message);
    res.status(500).json({ 
      error: "Server Error: " + (err.message || "Unknown error")
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
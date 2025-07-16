import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/ai-assessment', async (req, res) => {
  const { duration, avgHR, maxHR, calories, vo2, recoveryHR } = req.body;

  const prompt = `A user has logged this workout:
  Duration: ${duration} mins
  Average HR: ${avgHR} bpm
  Max HR: ${maxHR} bpm
  Calories: ${calories} kcal
  VO2 Max: ${vo2}
  Recovery HR: ${recoveryHR} bpm

  Provide a short, helpful fitness assessment and recommendation.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful fitness coach." },
        { role: "user", content: prompt }
      ]
    });

    const aiAssessment = completion.choices[0].message.content.trim();
    res.json({ assessment: aiAssessment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
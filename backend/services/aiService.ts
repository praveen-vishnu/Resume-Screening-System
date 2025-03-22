import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// AI Resume Scoring Service
const AI_API_URL = process.env.AI_API_URL as string;
const AI_API_KEY = process.env.AI_API_KEY as string;

if (!AI_API_URL || !AI_API_KEY) {
  throw new Error('AI_API_URL and AI_API_KEY must be defined in the environment variables');
}

// Helper: Delay function for retries
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Analyze Resume with Retry Logic
export const analyzeResume = async (
  jobDescription: string,
  resumeText: string,
  maxRetries = 3, // Retry up to 3 times
  delayMs = 2000 // Delay between retries (2 seconds)
): Promise<number> => {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await axios.post(
        AI_API_URL,
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an AI that evaluates resumes based on a job description and assigns a score from 0 to 100. Return only the numeric score. Do not provide explanations.'
            },
            {
              role: 'user',
              content: `Evaluate the following resume based on this job description and provide a numeric score between 0 and 100 only:\n\n### Job Description:\n${jobDescription}\n\n### Resume:\n${resumeText}`
            }
          ],
          max_tokens: 50 // Reduced token usage for better performance
        },
        {
          headers: {
            Authorization: `Bearer ${AI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        console.log('API response:', JSON.stringify(response.data));

        // Extract and parse the score from the AI's response
        const scoreText = response.data.choices[0]?.message?.content?.trim();
        const score = parseFloat(scoreText);

        if (!isNaN(score) && score >= 0 && score <= 100) {
          console.log(`✅ Resume score: ${score}`);
          return score;
        } else {
          console.warn(`⚠️ Invalid score received: ${scoreText}`);
          throw new Error(`Invalid score returned by AI: ${scoreText}`);
        }
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        console.warn(`⚠️ Rate limit hit. Retrying in ${delayMs / 1000} seconds...`);
        attempts++;
        await delay(delayMs);
      } else {
        console.error('❌ Error during resume analysis:', error.message);
        throw new Error('Failed to process the resume');
      }
    }
  }

  throw new Error('❌ Max retries reached. Failed to process the resume.');
};

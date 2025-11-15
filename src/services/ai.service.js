// services/ai.service.js
import OpenAI from 'openai';
import nlp from 'compromise';

const useMock = process.env.USE_MOCK_AI === 'true';

let openai = null;
if (!useMock && process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Mock fallback used during local development
 */
const mockParse = (text) => {
  const doc = nlp(text);

  return {
    conditions: doc.match('#Condition+').out('array') || [],
    keywords: doc.nouns().out('array') || [],
    specialties: doc.topics().out('array') || [],
    researchInterests: doc.nouns().out('array') || [],
    location: doc.match('#City').out('text') || null,
  };
};

/**
 * Parse natural language using OpenAI (or mock)
 */
export const parseNaturalLanguage = async (text) => {
  try {
    if (useMock || !openai) {
      return {
        success: true,
        data: mockParse(text)
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You extract structured medical onboarding information from a user's text.
Return JSON ONLY with the following fields:

{
  "conditions": [],
  "keywords": [],
  "specialties": [],
  "researchInterests": [],
  "location": null
}

- "conditions": medical issues, diseases
- "keywords": important nouns or phrases related to health or research
- "specialties": research or medical specialties (for researchers)
- "researchInterests": research fields (for researchers)
- "location": city or country only
`
        },
        { role: "user", content: text }
      ]
    });

    const parsed = JSON.parse(response.choices[0].message.content);

    return {
      success: true,
      data: parsed
    };

  } catch (error) {
    console.error("AI parse error:", error.message);
    return {
      success: false,
      error: "Failed to parse natural language"
    };
  }
};

/**
 * General AI response generator
 */
export const generateAIResponse = async (prompt) => {
  try {
    if (useMock || !openai) {
      return {
        success: true,
        data: {
          model: 'mock-ai',
          message: `Mock AI response for: ${prompt}`
        }
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful medical research assistant." },
        { role: "user", content: prompt }
      ]
    });

    return {
      success: true,
      data: response
    };

  } catch (error) {
    console.error('AI error:', error.message);
    return {
      success: false,
      error: "AI service failed"
    };
  }
};

/**
 * Default export (optional)
 */
export default {
  parseNaturalLanguage,
  generateAIResponse
};

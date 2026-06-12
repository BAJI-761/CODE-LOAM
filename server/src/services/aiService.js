const { getModel, isGeminiAvailable } = require('../config/gemini');
const ChatHistory = require('../models/ChatHistory');

const aiService = {
  /**
   * General doubt assistant with context awareness
   */
  async askDoubtAssistant(studentId, message, context) {
    let historyDoc = await ChatHistory.findOne({
      student: studentId,
      'context.type': context.type || 'general',
      'context.referenceId': context.referenceId || null,
    });

    if (!historyDoc) {
      historyDoc = new ChatHistory({
        student: studentId,
        context: {
          type: context.type || 'general',
          referenceId: context.referenceId || null,
        },
        messages: []
      });
    }

    if (!isGeminiAvailable()) {
      const mockResponse = "[Demo Mode] This is a mocked AI response. Please configure GEMINI_API_KEY for real AI integration. Your message was: " + message;
      historyDoc.messages.push({ role: 'user', content: message });
      historyDoc.messages.push({ role: 'assistant', content: mockResponse });
      await historyDoc.save();
      return mockResponse;
    }

    try {
      const model = getModel();
      
      const history = historyDoc.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const systemInstruction = `You are a helpful and educational coding assistant on the platform CodeLoom.
Your goal is to guide the student to the answer, NOT just give them the final code.
Use the Socratic method when applicable. Provide hints, explain concepts, but encourage them to write the code.
If context is provided, tailor your response to it: ${JSON.stringify(context)}.`;

      if (history.length === 0) {
        history.push({
          role: 'user',
          parts: [{ text: `[SYSTEM INSTRUCTION: ${systemInstruction}]` }]
        });
        history.push({
          role: 'model',
          parts: [{ text: 'Understood. I will act as a helpful coding assistant following those guidelines.' }]
        });
      }

      const chat = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(message);
      const responseText = result.response.text();

      historyDoc.messages.push({ role: 'user', content: message });
      historyDoc.messages.push({ role: 'assistant', content: responseText });
      await historyDoc.save();

      return responseText;
    } catch (error) {
      console.error('Error in askDoubtAssistant:', error);
      throw error;
    }
  },

  /**
   * Contextual hint for coding challenges
   */
  async getCodingHint(challengeDetails, userCode) {
    if (!isGeminiAvailable()) {
      return "[Demo Mode] Mock hint: Check your loop conditions and variable assignments. Try printing intermediate values.";
    }

    try {
      const model = getModel();
      const prompt = `You are an expert programming tutor helping a student with a coding challenge.
Challenge Details:
Title: ${challengeDetails.title}
Description: ${challengeDetails.description}

Student's Current Code:
\`\`\`
${userCode}
\`\`\`

Analyze the student's code. Provide a single, helpful hint to guide them towards the correct solution.
CRITICAL RULES:
1. Do NOT provide the complete solution code.
2. Point out logical flaws or syntax errors if any.
3. Keep the hint concise, encouraging, and educational.`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error in getCodingHint:', error);
      throw error;
    }
  },

  /**
   * Explain compilation or runtime errors
   */
  async explainError(code, errorMessage, language) {
    if (!isGeminiAvailable()) {
      return `[Demo Mode] Mock explanation: The error "${errorMessage}" usually means there is a syntax issue or undefined variable on that line.`;
    }

    try {
      const model = getModel();
      const prompt = `You are a friendly and clear coding mentor.
Language: ${language}

The student wrote this code:
\`\`\`${language}
${code}
\`\`\`

And encountered this error:
\`\`\`
${errorMessage}
\`\`\`

Explain what this error means in simple terms. Then, suggest how to fix it without giving the full corrected code if possible, but you can provide a small snippet demonstrating the correct syntax for the specific line.`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error in explainError:', error);
      throw error;
    }
  },

  /**
   * Generate Quiz using AI
   */
  async generateQuiz(topic, difficulty, questionCount) {
    if (!isGeminiAvailable()) {
      const mockQuestions = Array.from({ length: questionCount }).map((_, i) => ({
        question: `[Demo Mode] Mock Question ${i + 1} about ${topic} (${difficulty})`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        explanation: "This is a mock explanation since Gemini is not configured."
      }));
      return mockQuestions;
    }

    try {
      const model = getModel();
      const prompt = `You are an expert curriculum designer. Create a multiple-choice quiz about "${topic}" at a "${difficulty}" level.
Generate exactly ${questionCount} questions.

Format the output as a clean, valid JSON array. Do not include markdown codeblocks or any text outside the JSON.
The JSON array should contain objects with the following structure:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0, // The index of the correct option (0-3)
    "explanation": "Brief explanation of why this is correct."
  }
]

Ensure the JSON is perfectly formatted.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      
      let jsonStr = text;
      if (jsonStr.startsWith('\`\`\`json')) {
        jsonStr = jsonStr.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
      } else if (jsonStr.startsWith('\`\`\`')) {
        jsonStr = jsonStr.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
      }

      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Error in generateQuiz:', error);
      throw error;
    }
  },

  /**
   * Review Code for quality, readability, and performance
   */
  async reviewCode(code, language, challengeDetails) {
    if (!isGeminiAvailable()) {
      return "[Demo Mode] Mock Review:\n1. Readability: Good formatting, but consider better variable names.\n2. Performance: Time complexity looks O(N), which is standard here.\n3. Best Practices: Remember to add docstrings or comments.";
    }

    try {
      const model = getModel();
      const prompt = `You are a senior software engineer doing a code review.
Language: ${language}
${challengeDetails ? `Context Challenge: ${challengeDetails.title}\n` : ''}
Review the following code:
\`\`\`${language}
${code}
\`\`\`

Provide a constructive review focusing on:
1. Readability and Style (naming conventions, structure)
2. Performance/Time Complexity (if applicable)
3. Best Practices in ${language}
4. Potential edge cases not handled.
Keep the review constructive, professional, and concise. Format your response nicely using markdown.`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error in reviewCode:', error);
      throw error;
    }
  }
};

module.exports = aiService;
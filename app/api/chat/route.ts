import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is stored in an environment variable
});


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    // Extract user message
    const userMessage = messages[messages.length - 1]?.content;

    if (!userMessage) {
      return NextResponse.json({ error: 'No message provided.' }, { status: 400 });
    }

    // Send the user's message to OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use 'gpt-4' if required
      messages: [
        { role: 'system', content: 'You are an NFT expert assistant helping users understand NFT creation, deployment, and best practices using the website pixel8r.vercel.app.' },
        ...messages.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

    // Return the response
    return NextResponse.json({
      messages: [
        ...messages,
        {
          role: 'assistant',
          content: assistantMessage,
        },
      ],
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request. Please try again.' },
      { status: 500 }
    );
  }
}

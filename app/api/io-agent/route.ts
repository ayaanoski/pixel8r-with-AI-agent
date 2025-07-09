import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.IO_INTELLIGENCE_API_KEY,
  baseURL: 'https://api.intelligence.io.solutions/api/v1/',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    const finalMessages = messages.length > 0 && messages[0].role === 'system'
      ? messages
      : [
          { role: 'system', content: 'You are a helpful assistant.' },
          ...messages,
        ];

    const completion = await openai.chat.completions.create({
      model: process.env.IO_MODEL_ID || 'meta-llama/Llama-3.3-70B-Instruct',
      messages: finalMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0].message;
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("IO Agent Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

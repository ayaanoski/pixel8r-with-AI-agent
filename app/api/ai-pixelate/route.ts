// app/api/ai-pixelate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('AI Suggestions API called');

  try {
    const body = await request.json();
    console.log('Request body received:', { hasImageData: !!body.imageData });

    const { imageData } = body;

    if (!imageData) {
      console.log('No image data provided');
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    const apiKey = process.env.IO_INTELLIGENCE_API_KEY;
    console.log('API key check:', { hasApiKey: !!apiKey });

    if (!apiKey) {
      console.log('API key not configured');
      return NextResponse.json(
        { error: 'API key not configured. Please set IO_INTELLIGENCE_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    const imageUrl = imageData; // imageData is already base64 or URL

    const aiRequestBody = {
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct",
      messages: [
        {
          role: "system",
          content: "You are an expert image processing AI. Analyze the provided image and suggest optimal settings for pixelation to achieve the best retro 8-bit or pixel art look. Provide values for 'pixelSize' (integer between 2 and 32), 'saturation' (float between 0.5 and 2.0), 'contrast' (float between 0.5 and 1.5), and 'smoothing' (boolean). Respond only with a JSON object containing these four fields. For example: { \"pixelSize\": 10, \"saturation\": 1.3, \"contrast\": 1.1, \"smoothing\": true }"
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and suggest the best pixelation settings for a striking 8-bit or retro art look. Provide 'pixelSize', 'saturation', 'contrast', and 'smoothing' values in JSON format."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 100,
      temperature: 0.8
    };

    console.log('Making request to AI API for suggestions...');

    const aiResponse = await fetch('https://api.intelligence.io.solutions/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aiRequestBody),
    });

    console.log('AI API response status:', aiResponse.status);

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', errorText);
      // Fallback response for AI API failure
      return NextResponse.json({
        pixelSize: 8,
        saturation: 1.2,
        contrast: 1.1,
        smoothing: true
      });
    }

    const aiResult = await aiResponse.json();
    console.log('AI API response:', aiResult);

    const aiMessage = aiResult.choices?.[0]?.message?.content;

    if (!aiMessage) {
      console.log('No message content from AI');
      // Fallback
      return NextResponse.json({
        pixelSize: 8,
        saturation: 1.2,
        contrast: 1.1,
        smoothing: true
      });
    }

    console.log('AI message:', aiMessage);

    let suggestions;
    try {
      // Improved parsing logic to extract only the JSON part
      const jsonStartIndex = aiMessage.indexOf('{');
      const jsonEndIndex = aiMessage.lastIndexOf('}');
      let jsonString = aiMessage;

      if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
        jsonString = aiMessage.substring(jsonStartIndex, jsonEndIndex + 1);
      } else {
        // Fallback if no clear JSON object is found, try to clean up known prefixes
        const answerPrefix = "**Answer:** ";
        if (aiMessage.startsWith(answerPrefix)) {
          jsonString = aiMessage.substring(answerPrefix.length).trim();
        }
      }

      // Remove markdown formatting like ** or *
      jsonString = jsonString.replace(/\*\*/g, '').replace(/\*/g, '').trim();

      suggestions = JSON.parse(jsonString);
      console.log('Parsed suggestions:', suggestions);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.log('AI message that failed to parse:', aiMessage);

      // Fallback to default values if parsing fails
      suggestions = {
        pixelSize: 8,
        saturation: 1.2,
        contrast: 1.1,
        smoothing: true
      };
      console.log('Fallback suggestions due to parsing error:', suggestions);
    }

    // Validate and sanitize the suggestions
    const validatedSuggestions = {
      pixelSize: Math.max(2, Math.min(32, Math.round(suggestions.pixelSize || 8))),
      saturation: Math.max(0.5, Math.min(2.0, parseFloat(suggestions.saturation || 1.2))),
      contrast: Math.max(0.5, Math.min(1.5, parseFloat(suggestions.contrast || 1.1))),
      smoothing: typeof suggestions.smoothing === 'boolean' ? suggestions.smoothing : true
    };

    console.log('Final validated suggestions:', validatedSuggestions);
    return NextResponse.json(validatedSuggestions);

  } catch (error) {
    console.error('Error in AI suggestions API:', error);

    // Return fallback suggestions for any uncaught errors
    return NextResponse.json({
      pixelSize: 8,
      saturation: 1.2,
      contrast: 1.1,
      smoothing: true
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
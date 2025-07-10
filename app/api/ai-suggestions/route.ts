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

    // Check if we have the API key
    const apiKey = process.env.IO_INTELLIGENCE_API_KEY;
    console.log('API key check:', { hasApiKey: !!apiKey });
    
    if (!apiKey) {
      console.log('API key not configured');
      return NextResponse.json(
        { error: 'API key not configured. Please set IOINTELLIGENCE_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    // Prepare the image URL or base64 data
    let imageUrl = imageData;
    
    // If it's a base64 string, we need to handle it differently
    // For now, we'll assume it's a URL or base64 data URL
    if (imageData.startsWith('data:image/')) {
      // It's a base64 data URL, we can use it directly
      imageUrl = imageData;
      console.log('Using base64 image data');
    } else {
      console.log('Using image URL');
    }

    // Prepare the request to the AI API
    const aiRequestBody = {
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct",
      messages: [
        {
          role: "system",
          content: "You are an expert NFT analyst and creator. Analyze the provided image and suggest appropriate NFT metadata including name, description, and estimated price in TLOS. Be creative but realistic. Respond in JSON format with fields: name, description, price (as number). The price should be between 0.1 and 100 TLOS based on the image's artistic value, uniqueness, and potential market appeal."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and suggest NFT metadata including a creative name, detailed description, and estimated price in TLOS. Consider the artistic style, subject matter, colors, composition, and potential market appeal. Respond with a JSON object containing name, description, and price fields."
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
      max_tokens: 500,
      temperature: 0.7
    };

    console.log('Making request to AI API...');

    // Make the request to the AI API
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
      
      // Return a fallback response if AI API fails
      return NextResponse.json({
        name: "Unique Digital Art",
        description: "A beautiful and unique digital artwork perfect for NFT collection",
        price: 1.5
      });
    }

    const aiResult = await aiResponse.json();
    console.log('AI API response:', aiResult);
    
    // Extract the AI's response
    const aiMessage = aiResult.choices?.[0]?.message?.content;
    
    if (!aiMessage) {
      console.log('No message content from AI');
      // Return fallback
      return NextResponse.json({
        name: "Creative Digital Art",
        description: "An inspiring digital artwork with unique artistic elements",
        price: 2.0
      });
    }

    console.log('AI message:', aiMessage);

    // Try to parse the JSON response from AI
    let suggestions;
    try {
      // The AI might return JSON wrapped in markdown code blocks
      const jsonMatch = aiMessage.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiMessage;
      
      suggestions = JSON.parse(jsonString);
      console.log('Parsed suggestions:', suggestions);
    } catch (parseError) {
      // If JSON parsing fails, try to extract information manually
      console.error('Failed to parse AI response as JSON:', parseError);
      console.log('AI message that failed to parse:', aiMessage);
      
      // Fallback: try to extract information using regex
      const nameMatch = aiMessage.match(/(?:name|title)["']?\s*:?\s*["']([^"'\n]+)["']?/i);
      const descMatch = aiMessage.match(/(?:description|desc)["']?\s*:?\s*["']([^"'\n]+)["']?/i);
      const priceMatch = aiMessage.match(/(?:price|cost|value)["']?\s*:?\s*["']?(\d+(?:\.\d+)?)["']?/i);
      
      suggestions = {
        name: nameMatch ? nameMatch[1] : "AI Generated NFT",
        description: descMatch ? descMatch[1] : "A unique digital artwork created with AI assistance",
        price: priceMatch ? parseFloat(priceMatch[1]) : 1.0
      };
      
      console.log('Fallback suggestions:', suggestions);
    }

    // Validate and sanitize the suggestions
    const validatedSuggestions = {
      name: suggestions.name || "AI Generated NFT",
      description: suggestions.description || "A unique digital artwork",
      price: Math.max(0.1, Math.min(100, suggestions.price || 1.0)) // Clamp between 0.1 and 100
    };

    console.log('Final validated suggestions:', validatedSuggestions);
    return NextResponse.json(validatedSuggestions);

  } catch (error) {
    console.error('Error in AI suggestions API:', error);
    
    // Return fallback suggestions instead of error
    return NextResponse.json({
      name: "Digital Masterpiece",
      description: "A stunning digital artwork with unique characteristics and artistic appeal",
      price: 1.0
    });
  }
}

// Handle OPTIONS request for CORS
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
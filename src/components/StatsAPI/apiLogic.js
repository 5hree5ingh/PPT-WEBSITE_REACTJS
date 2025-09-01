import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Extract cart image using AI SDK
export const extractCartImage = async (base64Data) => {
  let cartImageBase64 = "";
  try {
    console.log('Extracting cart image with AI SDK...');
    
    // Create Google AI instance with your API key
    const google = createGoogleGenerativeAI({
      apiKey: 'AIzaSyCmyzKt2vIHawx7qupiO1D01kTrbSmtgIk',
    });

    const result = await generateText({
      model: google('gemini-2.0-flash-exp'),
      providerOptions: {
        google: { responseModalities: ['TEXT', 'IMAGE'] },
      },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Remove the background from the provided image to display just the player in its cart in the #0a0a1a background  . The cart should be at an angle of 30 degree left from the front in the white background .",
            },
            {
              type: "image",
              image: base64Data,
            },
          ],
        },
      ],
    });

    console.log('AI SDK Response:', result);
    
    // Check for image in result.files
    if (result.files && result.files.length > 0) {
      for (const file of result.files) {
        if (file.mediaType.startsWith('image/')) {
          cartImageBase64 = file.base64;
          console.log('Found cart image in result.files!');
          break;
        }
      }
    }
    
    console.log('Cart image base64 length:', cartImageBase64 ? cartImageBase64.length : 0);
    
  } catch (cartError) {
    console.error('Cart extraction failed:', cartError);
  }
  
  return cartImageBase64;
};

// Extract stats using Gemini 2.5 Flash
export const extractStats = async (base64Data) => {
  try {
    const statsResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCmyzKt2vIHawx7qupiO1D01kTrbSmtgIk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Extract the following data from this SmashKarts screenshot and return ONLY a valid JSON object:

{
  "userName": "player username/name",
  "level": "player level number",
  "kills": "number of kills",
  "deaths": "number of deaths",
  "kd": "kill/death ratio",
  "skId": "SmashKarts ID",
  "gamesPlayed": "total games played"
}

Important:
- Return ONLY the JSON object, no other text
- Extract numbers as strings
- Look for player name, level, kills, deaths, K/D ratio, SmashKarts ID, and total games played`
          }, {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Data
            }
          }]
        }]
      })
    });

    const statsData = await statsResponse.json();
    console.log('Stats API Response:', statsData);
    
    if (statsData.candidates && statsData.candidates[0] && statsData.candidates[0].content) {
      const extractedText = statsData.candidates[0].content.parts[0].text;
      console.log('Extracted Text:', extractedText);
      
      try {
        let jsonText = extractedText.trim();
        
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.replace('```json', '').replace('```', '').trim();
        } else if (jsonText.startsWith('```')) {
          jsonText = jsonText.replace('```', '').trim();
        }
        
        const stats = JSON.parse(jsonText);
        console.log('Parsed Stats:', stats);
        
        return {
          discord_username: stats.userName || "Player",
          level: stats.level || "1",
          kills: stats.kills || "0",
          deaths: stats.deaths || "0",
          total_games: stats.gamesPlayed || "0",
          sk_id: stats.skId || "N/A",
          kd_ratio: stats.kd || "0.00"
        };
        
      } catch (parseError) {
        console.error('Failed to parse API response:', parseError);
        console.error('Raw response:', extractedText);
        
        const manualStats = extractStatsManually(extractedText);
        return manualStats;
      }
    } else {
      console.error('No candidates in response:', statsData);
      throw new Error('No data extracted from image');
    }
  } catch (error) {
    console.error('Stats extraction failed:', error);
    throw error;
  }
};

// Helper function to manually extract stats from text response
const extractStatsManually = (text) => {
  try {
    const usernameMatch = text.match(/(?:username|name|userName):\s*([^\n,}]+)/i);
    const levelMatch = text.match(/(?:level):\s*(\d+)/i);
    const killsMatch = text.match(/(?:kills):\s*(\d+)/i);
    const deathsMatch = text.match(/(?:deaths):\s*(\d+)/i);
    const kdMatch = text.match(/(?:kd|k\/d|kill\/death):\s*([\d.]+)/i);
    const skIdMatch = text.match(/(?:skId|smashkarts id|id):\s*([^\n,}]+)/i);
    const gamesMatch = text.match(/(?:gamesPlayed|games|total_games):\s*(\d+)/i);
    
    if (usernameMatch || levelMatch || killsMatch) {
      return {
        discord_username: usernameMatch ? usernameMatch[1].trim() : "Player",
        level: levelMatch ? levelMatch[1] : "1",
        kills: killsMatch ? killsMatch[1] : "0",
        deaths: deathsMatch ? deathsMatch[1] : "0",
        kd_ratio: kdMatch ? kdMatch[1] : "0.00",
        sk_id: skIdMatch ? skIdMatch[1].trim() : "N/A",
        total_games: gamesMatch ? gamesMatch[1] : "0"
      };
    }
    return null;
  } catch (error) {
    console.error('Error in manual extraction:', error);
    return null;
  }
};

// Main function to extract both cart image and stats
export const extractAllData = async (base64Data) => {
  try {
    // Extract cart image and stats in parallel
    const [cartImageBase64, stats] = await Promise.all([
      extractCartImage(base64Data),
      extractStats(base64Data)
    ]);

    if (!stats) {
      throw new Error('Failed to extract stats from image');
    }

    // Create enhanced stats object with cart image
    const enhancedStats = {
      ...stats,
      cart_image: cartImageBase64 ? `data:image/png;base64,${cartImageBase64}` : null
    };

    console.log('Final stats object:', enhancedStats);
    return enhancedStats;

  } catch (error) {
    console.error('Data extraction failed:', error);
    throw error;
  }
};

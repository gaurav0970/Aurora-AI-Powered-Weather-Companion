import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Weather tool function
async function getWeather(city: string): Promise<string> {
  try {
    console.log(`Fetching weather for city: ${city}`);
    
    // First, geocode the city to get coordinates
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );
    
    if (!geoResponse.ok) {
      console.error("Geocoding API error:", geoResponse.status);
      return `Could not find location: ${city}`;
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      return `Could not find location: ${city}. Please check the city name and try again.`;
    }
    
    const { latitude, longitude, name, country } = geoData.results[0];
    console.log(`Found location: ${name}, ${country} at ${latitude}, ${longitude}`);
    
    // Get weather data
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`
    );
    
    if (!weatherResponse.ok) {
      console.error("Weather API error:", weatherResponse.status);
      return `Could not fetch weather data for ${city}`;
    }
    
    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    
    // Map weather codes to descriptions
    const weatherDescriptions: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    
    const weatherDescription = weatherDescriptions[current.weather_code] || "Unknown conditions";
    
    return JSON.stringify({
      city: name,
      country: country,
      temperature: current.temperature_2m,
      feels_like: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      wind_speed: current.wind_speed_10m,
      conditions: weatherDescription,
    });
  } catch (error) {
    console.error("Error fetching weather:", error);
    return `Error fetching weather for ${city}: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log("Received message:", message);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Define the weather tool
    const tools = [
      {
        type: "function",
        function: {
          name: "get_weather",
          description: "Get the current weather for a specific city. Use this when the user asks about weather conditions, temperature, or climate for any location.",
          parameters: {
            type: "object",
            properties: {
              city: {
                type: "string",
                description: "The name of the city to get weather for, e.g., 'London', 'New York', 'Tokyo', 'Pune'",
              },
            },
            required: ["city"],
          },
        },
      },
    ];

    // First API call - let the model decide if it needs to use a tool
    console.log("Calling AI gateway...");
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are Aurora, a friendly and helpful weather assistant. You help users get weather information for any city in the world.

When users ask about weather, use the get_weather tool to fetch real-time data. Be conversational and provide helpful context about the weather conditions.

If the user's message is not about weather, respond politely and guide them to ask about weather in any city.`,
          },
          { role: "user", content: message },
        ],
        tools: tools,
        tool_choice: "auto",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds to your account." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data, null, 2));

    const assistantMessage = data.choices[0].message;

    // Check if the model wants to use a tool
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      console.log("Tool call requested:", toolCall);

      if (toolCall.function.name === "get_weather") {
        const args = JSON.parse(toolCall.function.arguments);
        console.log("Getting weather for:", args.city);
        
        // Execute the weather function
        const weatherResult = await getWeather(args.city);
        console.log("Weather result:", weatherResult);

        // Second API call - send the tool result back to get a natural response
        const finalResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `You are Aurora, a friendly weather assistant. IMPORTANT: Format all weather metrics as a SINGLE CONTINUOUS PARAGRAPH with bold values. DO NOT use tables, pipe characters (|), or any table-like formatting whatsoever.

**EXACT FORMAT REQUIRED:**

# 🌤️ Weather in [City], [Country]

**Current Conditions:** [conditions]

🌡️ Temperature is **15.6°C**, feels like **14.7°C**, with **65%** humidity. Wind speed is **5 km/h** and precipitation is **0 mm**.

---

**Weather Tip:** [Give a short, helpful tip]

CRITICAL RULES:
- Do NOT create any tables, grids, or pipe-delimited structures
- Write everything as flowing paragraph text
- Use ** for bold formatting on numbers and values only
- Keep the tone conversational and friendly`,
              },
              { role: "user", content: message },
              assistantMessage,
              {
                role: "tool",
                tool_call_id: toolCall.id,
                content: weatherResult,
              },
            ],
          }),
        });

        if (!finalResponse.ok) {
          const errorText = await finalResponse.text();
          console.error("Final AI response error:", finalResponse.status, errorText);
          throw new Error(`AI gateway error: ${finalResponse.status}`);
        }

        const finalData = await finalResponse.json();
        const finalContent = finalData.choices[0].message.content;

        return new Response(
          JSON.stringify({ response: finalContent }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // If no tool was called, return the direct response
    return new Response(
      JSON.stringify({ response: assistantMessage.content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in weather-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

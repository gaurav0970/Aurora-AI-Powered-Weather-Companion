# Aurora - AI Weather Chat Assistant 🌤️

A modern, real-time weather chat application powered by AI and built with React, TypeScript, and Tailwind CSS. Get instant weather information for any city with natural conversational responses.

## Features

✨ **AI-Powered Chat Interface**
- Natural language weather queries using Claude/Gemini AI
- Typewriter text effect for engaging responses
- Real-time streaming responses character-by-character

🌍 **Real-Time Weather Data**
- Accurate weather information using Open-Meteo API
- Automatic city geocoding and timezone detection
- Current conditions including temperature, humidity, wind speed, and precipitation

🎨 **Beautiful UI**
- Modern glass-morphism design with aurora-themed gradient
- Responsive design for mobile and desktop
- Dark mode with custom color scheme
- Smooth animations and transitions

⚡ **Fast & Performant**
- Built with Vite for instant hot module reloading
- Optimized React components with TypeScript
- Client-side markdown rendering with custom styling

## Tech Stack

**Frontend:**
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Lucide React** - Icon set
- **React Router** - Navigation
- **React Markdown** - Markdown rendering
- **Sonner** - Toast notifications

**Backend:**
- **Supabase Edge Functions** - Serverless functions (Deno runtime)
- **Google Gemini 2.5 Flash** - AI model via Lovable API Gateway

**APIs:**
- **Open-Meteo** - Free weather data API
- **Lovable AI Gateway** - Claude/Gemini access

## How It Works

1. **User Input** → You ask about weather in any city
2. **AI Processing** → Gemini 2.5 Flash determines the city and calls the weather tool
3. **Weather Fetch** → Open-Meteo API provides real-time weather data
4. **AI Response** → AI formats the response as a conversational paragraph with bold values
5. **Typewriter Effect** → Response displays character-by-character for better UX

### Architecture

```
User Input
    ↓
Aurora Chat Component
    ↓
Supabase Edge Function (weather-chat)
    ↓
Gemini 2.5 Flash AI
    ↓
Open-Meteo Weather API
    ↓
Formatted Response
    ↓
Client-Side Transform (tables → paragraphs)
    ↓
Typewriter Display Effect
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm or yarn
- Supabase account (for Edge Functions)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/sky-gazer-bot.git
cd sky-gazer-bot
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

### Running Locally

**Development server:**
```bash
npm run dev
```

The app will start at `http://localhost:8080`

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Lint code:**
```bash
npm run lint
```

## Configuration

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and publishable key from project settings
3. Add them to `.env` file

### Edge Function Deployment

The `weather-chat` Edge Function handles AI-powered weather queries:

```bash
# Link to your Supabase project
npx supabase link --project-ref your_project_ref

# Deploy the function
npx supabase functions deploy weather-chat
```

Set the `LOVABLE_API_KEY` secret in Supabase dashboard for Gemini API access.

## Project Structure

```
src/
├── components/
│   ├── Aurora.tsx              # Main chat component with typewriter effect
│   ├── ChatMessage.tsx         # Message display with markdown rendering
│   ├── ChatInput.tsx           # Input field with multiline support
│   ├── AuroraBackground.tsx    # Animated background
│   └── ui/                     # shadcn UI components
├── pages/
│   ├── Index.tsx               # Home page
│   └── NotFound.tsx            # 404 page
├── integrations/
│   └── supabase/
│       ├── client.ts           # Supabase client
│       └── types.ts            # Generated types
├── App.tsx                     # App routing
├── main.tsx                    # Entry point
└── index.css                   # Global styles

supabase/
└── functions/
    └── weather-chat/
        └── index.ts            # Edge Function for AI weather queries
```

## Features in Detail

### Typewriter Effect
Responses display character-by-character at 12ms per character for engaging user experience.

### Paragraph Formatting
Weather metrics are displayed as bold values in natural language:
```
🌡️ Temperature is **15.6°C**, feels like **14.7°C**, with **65%** humidity. Wind speed is **5 km/h**.
```

### Multiline Input
- Press **Enter** to send message
- Press **Shift+Enter** to add new line

### Real-Time Weather
- Automatic city geocoding
- Current temperature, feels-like, humidity, wind speed, precipitation
- Contextual weather tips based on conditions

## Customization

### Change AI Model
Edit `supabase/functions/weather-chat/index.ts` and change the model:
```typescript
model: "google/gemini-2.0-flash" // or other available models
```

### Adjust Typewriter Speed
Edit `src/components/Aurora.tsx`:
```typescript
const speed = 12; // milliseconds per character
```

### Customize Colors
Edit `src/index.css` and modify the `--aurora-*` CSS variables:
```css
--aurora-teal: 173 80% 50%;
--aurora-purple: 280 60% 50%;
--aurora-green: 160 70% 45%;
```

## API Limits

- **Open-Meteo**: Free tier - unlimited requests
- **Gemini via Lovable Gateway**: Depends on your account tier
- **Supabase**: Free tier includes generous Edge Function limits

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. Responses load faster on broadband connections
2. Weather data is cached by Open-Meteo for 10 minutes
3. Build size is ~600KB (gzipped: ~180KB)

## Troubleshooting

**"Rate limit exceeded" error:**
- Wait a few moments and try again
- Check your Lovable API account limits

**"Could not find location" error:**
- Check city spelling
- Try a larger city or nearby metro area

**Typewriter effect not showing:**
- Clear browser cache
- Ensure JavaScript is enabled
- Check console for errors (F12)

**Function not deploying:**
- Verify Supabase credentials: `npx supabase projects list`
- Check function logs: `npx supabase functions logs weather-chat`

## License

MIT License - feel free to use this project for personal or commercial use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open a GitHub issue.

---

**Built with ❤️ using React, Vite, and Supabase**

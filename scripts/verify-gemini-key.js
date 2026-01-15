const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Try to load .env.local manually since we're not in Next.js context
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
        process.env[key] = value;
      }
    });
    console.log('Loaded .env.local');
  } else {
    console.log('No .env.local found, relying on existing environment variables.');
  }
} catch (e) {
  console.error('Error loading .env.local:', e);
}

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY is not set in environment or .env.local');
    process.exit(1);
  }

  console.log('Testing Gemini API key...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // List available models to debug model name issues
    /*
    console.log('Fetching available models...');
    try {
        // Note: The listModels method might not be directly exposed on the instance in older versions or varies by SDK version. 
        // We'll rely on the specific model call first, but if that fails, the user can uncomment this or we can try a known stable model.
        // Actually, let's try 'gemini-pro' as a fallback if flash fails, or just print the error clearly.
    } catch (e) {
        console.log('Could not list models:', e.message);
    }
    */

    // Try a few common model names if the first one fails, or just stick to one and error out.
    // The user reported gemini-1.5-flash 404. Let's try 'gemini-1.5-flash-latest' or 'gemini-pro'.
    // Better yet, let's use the error handling to suggest checking the model name.
    
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
    
    for (const name of modelNames) {
      console.log(`Trying model: ${name}...`);
      try {
        const model = genAI.getGenerativeModel({ model: name });
        const prompt = 'Say "Hello, World!" if you can hear me.';
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ Success with model: ${name}`);
        console.log('---------------------------------------------------');
        console.log(text);
        console.log('---------------------------------------------------');
        return; // Exit function on success
      } catch (error) {
        console.log(`❌ Failed with ${name}: ${error.message}`);
        // Continue to next model
      }
    }
    
    console.error('❌ All model attempts failed.');
  } catch (error) {
    console.error('❌ Error testing Gemini API:');
    console.error(error.message);
  }
}

testGemini();

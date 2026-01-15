const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Load env vars
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
      }
    });
  }
} catch (e) { console.error(e); }

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No GEMINI_API_KEY found.');
    process.exit(1);
  }

  // Note: The Node.js SDK doesn't always expose listModels directly on the main client in the same way as the REST API.
  // We can use the model manager if available, or just standard REST call if needed.
  // Actually, checking the docs for @google/generative-ai, there isn't a direct `genAI.listModels()`.
  // We usually have to know the model name.
  
  // However, the error message from the user said: "Call ListModels to see the list of available models"
  // This implies we *can* call it, but maybe not easily via this specific SDK helper?
  // Let's try to access it via the `GoogleAIFileManager` or similar if it was for files, but for models...
  
  // Let's try a simple fetch to the REST API to list models, bypassing the SDK for a moment to be sure.
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  console.log('Fetching available models via REST API...');
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
      console.log('Available Models:');
      data.models.forEach(m => {
        if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
           console.log(`- ${m.name.replace('models/', '')} (${m.displayName})`);
        }
      });
    } else {
      console.log('No models found in response:', data);
    }
  } catch (error) {
    console.error('Error fetching models:', error);
  }
}

listModels();

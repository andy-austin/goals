# How to Test Gemini AI Integration

This guide will help you set up and test the Google Generative AI (Gemini) integration.

## Step 1: Get a Free Gemini API Key

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google Account.
3.  Click on the **"Get API key"** button (usually on the top left).
4.  Click **"Create API key"**.
5.  Select **"Create API key in new project"** (or use an existing one).
6.  Copy the generated key (it starts with `AIza...`).

## Step 2: Configure Your Environment

1.  Create or edit the file named `.env.local` in the root of your project:
    ```bash
    touch .env.local
    ```
2.  Add your Gemini API key to it:
    ```env
    GEMINI_API_KEY=AIzaSyYourKeyHere...
    ```
3.  **Important:** Ensure `ANTHROPIC_API_KEY` is *not* set in this file, OR explicitly set `AI_PROVIDER=gemini` to force using Gemini.

    ```env
    # Option A: Only Gemini Key (Auto-detects)
    GEMINI_API_KEY=AIzaSy...

    # Option B: Both Keys present, Force Gemini
    ANTHROPIC_API_KEY=sk-...
    GEMINI_API_KEY=AIzaSy...
    AI_PROVIDER=gemini
    ```

## Step 3: Verify the Key (Standalone Script)

We created a script to verify your key works directly with Google's servers, bypassing the app logic.

Run this command in your terminal:

```bash
node scripts/verify-gemini-key.js
```

If successful, you will see a "Hello, World!" message from Gemini.

## Step 4: Verify the App Integration

1.  Start the development server (if not running):
    ```bash
    npm run dev
    ```

2.  In a separate terminal window, test the API endpoint using `curl`:

    ```bash
    curl -X POST http://localhost:3000/api/ai/suggest \
      -H "Content-Type: application/json" \
      -d '{
        "type": "description",
        "input": "I want to save for a rainy day"
      }'
    ```

3.  **Expected Output:** You should receive a JSON response with a refined goal description.
    ```json
    {"suggestion":"Build a dedicated emergency fund...","reasoning":"..."}
    ```

## Troubleshooting

- **Error: "AI service not configured"**: check that `.env.local` exists and has `GEMINI_API_KEY`. Restart the Next.js server (`npm run dev`) after changing `.env.local`.
- **Error: "Invalid API key"**: Double-check you copied the full key string.
- **Anthropic is used instead**: Ensure `AI_PROVIDER` is not set to `anthropic` and that `ANTHROPIC_API_KEY` is removed or `AI_PROVIDER=gemini` is set.
- **Error: "Model not found" (404)**:
  1.  Run `node scripts/list-models.js` to see which models are available to your key.
  2.  Ensure you are using a supported region or key type.
  3.  Restart the server.

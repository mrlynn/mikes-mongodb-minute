const prompts = [
  {
    topic: "Full-Text Search with Atlas Search",
    difficulty: "Beginner",
    context: "Explain how full-text search works in Atlas Search and demo a simple index."
  },
  {
    topic: "Autocomplete for Better UX",
    difficulty: "Intermediate",
    context: "Demonstrate autocomplete and why it improves UX immediately."
  },
  {
    topic: "Faceted Navigation with Atlas Search",
    difficulty: "Intermediate",
    context: "Show how to build faceted navigation (like ecommerce filters) in Atlas Search."
  },
  {
    topic: "Scoring and Boosting in Search Results",
    difficulty: "Advanced",
    context: "Explain scoring and boosting, and show how to prefer recent content."
  },
  {
    topic: "Synonyms for Smarter Search",
    difficulty: "Intermediate",
    context: "Teach synonyms with a real-world example (\"car\" ↔ \"automobile\")."
  },
  {
    topic: "Highlights Feature in Search Results",
    difficulty: "Beginner",
    context: "Demonstrate the highlights feature and show highlighted search results."
  },
  {
    topic: "Fuzzy Matching: How Fuzzy is Too Fuzzy?",
    difficulty: "Intermediate",
    context: "Show how to do fuzzy matching and when it becomes too fuzzy."
  }
];

async function generateEpisode(prompt, episodeNumber) {
  try {
    const response = await fetch("http://localhost:3002/api/ai/generate-episode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: prompt.topic,
        category: "Atlas Search",
        difficulty: prompt.difficulty,
        additionalContext: prompt.context
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`❌ Failed to generate episode ${episodeNumber}:`, error);
      return null;
    }

    const data = await response.json();
    const episode = data.episode;

    // Save to database
    const saveResponse = await fetch("http://localhost:3002/api/episodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...episode,
        episodeNumber: episodeNumber
      })
    });

    if (!saveResponse.ok) {
      console.error(`❌ Failed to save episode ${episodeNumber}`);
      return null;
    }

    const savedEpisode = await saveResponse.json();
    console.log(`✅ Episode ${episodeNumber}: "${savedEpisode.title}" created (ID: ${savedEpisode._id})`);
    return savedEpisode;

  } catch (error) {
    console.error(`❌ Error generating episode ${episodeNumber}:`, error.message);
    return null;
  }
}

async function generateAllEpisodes() {
  console.log("🚀 Starting Atlas Search episodes generation...\n");

  let episodeNumber = 39; // Starting from episode 39

  for (const prompt of prompts) {
    console.log(`📝 Generating episode ${episodeNumber}: ${prompt.topic}...`);
    await generateEpisode(prompt, episodeNumber);
    episodeNumber++;

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n✨ All Atlas Search episodes generated!");
}

generateAllEpisodes();

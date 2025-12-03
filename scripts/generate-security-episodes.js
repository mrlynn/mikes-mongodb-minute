const prompts = [
  {
    topic: "Least Privilege Access and Role Assignment",
    difficulty: "Intermediate",
    context: "Explain least privilege access and how to assign proper roles to app users."
  },
  {
    topic: "Storing Secrets Safely",
    difficulty: "Beginner",
    context: "Demonstrate how to store secrets safely and avoid embedding connection strings in code."
  },
  {
    topic: "Client-Side Field-Level Encryption",
    difficulty: "Advanced",
    context: "Explain client-side field-level encryption at a conceptual level."
  },
  {
    topic: "Auditing Database Access in Atlas",
    difficulty: "Intermediate",
    context: "Show how to audit database access through Atlas."
  },
  {
    topic: "Common API Security Mistakes",
    difficulty: "Intermediate",
    context: "Show common mistakes developers make when exposing APIs that talk to MongoDB — and how to avoid them."
  }
];

async function generateEpisode(prompt, episodeNumber) {
  try {
    const response = await fetch("http://localhost:3002/api/ai/generate-episode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: prompt.topic,
        category: "Security",
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
  console.log("🚀 Starting Security & Best Practices episodes generation...\n");

  let episodeNumber = 52; // Starting from episode 52

  for (const prompt of prompts) {
    console.log(`📝 Generating episode ${episodeNumber}: ${prompt.topic}...`);
    await generateEpisode(prompt, episodeNumber);
    episodeNumber++;

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n✨ All Security & Best Practices episodes generated!");
}

generateAllEpisodes();

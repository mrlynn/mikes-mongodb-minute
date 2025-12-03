const prompts = [
  {
    topic: "Mapping SQL JOINs to MongoDB",
    difficulty: "Intermediate",
    context: "Explain how to map SQL JOIN-heavy schemas into MongoDB with embedding strategies."
  },
  {
    topic: "Relational Migrator for Database Migration",
    difficulty: "Beginner",
    context: "Show how Relational Migrator accelerates moving from Postgres/MySQL to MongoDB."
  },
  {
    topic: "Modernizing with Microservices",
    difficulty: "Advanced",
    context: "Explain how to modernize legacy applications by introducing microservices backed by MongoDB."
  },
  {
    topic: "Schema Evolution Without Downtime",
    difficulty: "Intermediate",
    context: "Do a quick schema evolution without downtime demo using flexible documents."
  }
];

async function generateEpisode(prompt, episodeNumber) {
  try {
    const response = await fetch("http://localhost:3002/api/ai/generate-episode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: prompt.topic,
        category: "Migration",
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
  console.log("🚀 Starting Migration & Modernization episodes generation...\n");

  let episodeNumber = 57; // Starting from episode 57

  for (const prompt of prompts) {
    console.log(`📝 Generating episode ${episodeNumber}: ${prompt.topic}...`);
    await generateEpisode(prompt, episodeNumber);
    episodeNumber++;

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n✨ All Migration & Modernization episodes generated!");
}

generateAllEpisodes();

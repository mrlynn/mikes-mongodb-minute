const prompts = [
  {
    topic: "Reading MongoDB explain() Plans",
    difficulty: "Intermediate",
    context: "Explain how to read an explain() plan in under a minute and show what developers should ALWAYS check first."
  },
  {
    topic: "Compound Indexes and Index Ordering",
    difficulty: "Intermediate",
    context: "Introduce compound indexes and how index ordering ({ a: 1, b: 1 }) affects performance."
  },
  {
    topic: "Covered Queries: Eliminating Disk Access",
    difficulty: "Advanced",
    context: "Teach covered queries and demonstrate how they eliminate disk access."
  },
  {
    topic: "Why Your Query Isn't Using an Index",
    difficulty: "Intermediate",
    context: "Explain why queries sometimes don't hit indexes even when one exists — and how to fix it."
  },
  {
    topic: "Monitoring Slow Queries in Atlas",
    difficulty: "Beginner",
    context: "Show how to monitor slow queries in Atlas and quickly diagnose an index problem."
  },
  {
    topic: "10x Performance with One Index Refactor",
    difficulty: "Intermediate",
    context: "Demonstrate a 60-second index refactor that improves read performance 10x on a sample query."
  },
  {
    topic: "Equality, Range, and Sort: Index Prefixes Matter",
    difficulty: "Advanced",
    context: "Explain the difference between equality, range, and sort operations and how index prefixes affect each."
  },
  {
    topic: "Collation and Case-Insensitive Search",
    difficulty: "Intermediate",
    context: "Show the impact of collation on indexes and case-insensitive search."
  },
  {
    topic: "Partial Indexes: Reduce Size and Cost",
    difficulty: "Advanced",
    context: "Explain partial indexes and when they dramatically reduce index size and cost."
  },
  {
    topic: "Find the Bad Query Challenge",
    difficulty: "Beginner",
    context: "Do a 'find the bad query' episode: give one unindexed query and show the correct optimized one."
  }
];

async function generateEpisode(prompt, episodeNumber) {
  try {
    const response = await fetch("http://localhost:3001/api/ai/generate-episode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: prompt.topic,
        category: "Indexing",
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
    const saveResponse = await fetch("http://localhost:3001/api/episodes", {
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
  console.log("🚀 Starting Query Performance & Indexing episodes generation...\n");

  let episodeNumber = 11; // Starting from episode 11

  for (const prompt of prompts) {
    console.log(`📝 Generating episode ${episodeNumber}: ${prompt.topic}...`);
    await generateEpisode(prompt, episodeNumber);
    episodeNumber++;

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n✨ All Query Performance & Indexing episodes generated!");
}

generateAllEpisodes();

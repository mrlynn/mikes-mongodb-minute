const prompts = [
  {
    topic: "Embed vs Reference in MongoDB",
    difficulty: "Beginner",
    context: "Explain when to embed vs. reference in MongoDB using a real-world example (e.g., orders + items). Highlight the performance tradeoffs in 60 seconds."
  },
  {
    topic: "Schema Anti-Patterns from SQL to MongoDB",
    difficulty: "Intermediate",
    context: "Show the schema anti-patterns developers fall into when moving from SQL to MongoDB, and how to fix them."
  },
  {
    topic: "The Bucket Pattern for Time-Series Data",
    difficulty: "Intermediate",
    context: "Teach the bucket pattern using an IoT time-series example and demonstrate why it reduces write load."
  },
  {
    topic: "Polymorphic Schemas in MongoDB",
    difficulty: "Advanced",
    context: "Give a fast explanation of polymorphic schemas and when they're a superpower instead of a problem."
  },
  {
    topic: "Modeling One-to-Many Relationships",
    difficulty: "Beginner",
    context: "Explain how to model one-to-many relationships efficiently without creating JOIN-like bottlenecks."
  },
  {
    topic: "The Extended Reference Pattern",
    difficulty: "Intermediate",
    context: "Walk through the extended reference pattern and why it reduces expensive lookups."
  },
  {
    topic: "Relational to Document Schema Migration",
    difficulty: "Intermediate",
    context: "Teach how to reshape a relational schema (tables) into a MongoDB schema (documents) step-by-step."
  },
  {
    topic: "Schema Flexibility for Product Iteration",
    difficulty: "Beginner",
    context: "Demonstrate how schema flexibility helps during early product iteration, with a concrete example."
  },
  {
    topic: "Arrays as Your MongoDB Superpower",
    difficulty: "Beginner",
    context: "Explain why arrays are your friend in MongoDB and show two patterns where arrays remove complexity."
  },
  {
    topic: "Document-Level Schema Versioning",
    difficulty: "Advanced",
    context: "Give a quick demo of schema versioning inside documents and why it's safer than database-wide migrations."
  }
];

async function generateEpisode(prompt, episodeNumber) {
  try {
    const response = await fetch("http://localhost:3001/api/ai/generate-episode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: prompt.topic,
        category: "Data Modeling",
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
  console.log("🚀 Starting Data Modeling episodes generation...\n");

  let episodeNumber = 1;

  for (const prompt of prompts) {
    console.log(`📝 Generating episode ${episodeNumber}: ${prompt.topic}...`);
    await generateEpisode(prompt, episodeNumber);
    episodeNumber++;

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n✨ All Data Modeling episodes generated!");
}

generateAllEpisodes();

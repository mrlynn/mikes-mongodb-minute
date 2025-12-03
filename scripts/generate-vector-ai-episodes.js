const prompts = [
  {
    topic: "Understanding Embeddings in MongoDB",
    difficulty: "Beginner",
    context: "Explain embeddings in simple developer language and show how MongoDB stores them."
  },
  {
    topic: "Your First $vectorSearch Query",
    difficulty: "Beginner",
    context: "Demonstrate the $vectorSearch stage with a tiny example."
  },
  {
    topic: "Build a Semantic Search Endpoint",
    difficulty: "Intermediate",
    context: "Show how to build a semantic search endpoint in under a minute using Atlas Vector Search."
  },
  {
    topic: "Keyword vs Semantic Search: The Fun Analogy",
    difficulty: "Beginner",
    context: "Explain the difference between keyword search and semantic search with a fun analogy."
  },
  {
    topic: "Hybrid Search: Best of Both Worlds",
    difficulty: "Advanced",
    context: "Teach the hybrid search pattern (keyword + vector) using $search + $vectorSearch."
  },
  {
    topic: "Metadata + Embeddings for RAG Apps",
    difficulty: "Intermediate",
    context: "Show how to store both metadata and embeddings in the same document to power RAG apps."
  },
  {
    topic: "Personalized Recommendations with Embeddings",
    difficulty: "Intermediate",
    context: "Walk through using embeddings to personalize recommendations in a simple example."
  },
  {
    topic: "Normalization, Dimensionality, and Embedding Choice",
    difficulty: "Advanced",
    context: "Explain the importance of normalization, dimensionality, and embedding choice."
  },
  {
    topic: "RAG Pipeline: Where MongoDB Fits",
    difficulty: "Intermediate",
    context: "Show the RAG pipeline at a high level and where MongoDB fits into each step."
  },
  {
    topic: "Debugging Vector Search with Distances",
    difficulty: "Advanced",
    context: "Teach how to debug vector search by visualizing distances and top-K results."
  }
];

async function generateEpisode(prompt, episodeNumber) {
  try {
    const response = await fetch("http://localhost:3000/api/ai/generate-episode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: prompt.topic,
        category: "Vector & AI",
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
    const saveResponse = await fetch("http://localhost:3000/api/episodes", {
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
  console.log("🚀 Starting Vector Search & AI Integration episodes generation...\n");

  let episodeNumber = 29; // Starting from episode 29

  for (const prompt of prompts) {
    console.log(`📝 Generating episode ${episodeNumber}: ${prompt.topic}...`);
    await generateEpisode(prompt, episodeNumber);
    episodeNumber++;

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n✨ All Vector Search & AI Integration episodes generated!");
}

generateAllEpisodes();

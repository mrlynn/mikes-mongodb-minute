const prompts = [
  {
    topic: "Aggregation Pipeline: Match, Group, Sort",
    difficulty: "Beginner",
    context: "Walk through a mini pipeline with $match → $group → $sort and explain each stage visually."
  },
  {
    topic: "$lookup and Performance Traps",
    difficulty: "Advanced",
    context: "Explain $lookup and how to avoid performance traps by shaping your data model correctly."
  },
  {
    topic: "$facet: Multiple Aggregations in One Pass",
    difficulty: "Advanced",
    context: "Demonstrate $facet to run multiple aggregations in one pass."
  },
  {
    topic: "$project Tricks for Reshaping Documents",
    difficulty: "Intermediate",
    context: "Show $project tricks for reshaping documents."
  },
  {
    topic: "$merge vs $out: When to Use Each",
    difficulty: "Intermediate",
    context: "Explain the difference between $merge and $out and when to use each."
  },
  {
    topic: "Visual Tour of Aggregation Pipeline Builder",
    difficulty: "Beginner",
    context: "Do a visual tour of the aggregation pipeline builder in Compass."
  }
];

async function generateEpisode(prompt, episodeNumber) {
  try {
    const response = await fetch("http://localhost:3002/api/ai/generate-episode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: prompt.topic,
        category: "Aggregation",
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
  console.log("🚀 Starting Aggregation Framework episodes generation...\n");

  let episodeNumber = 46; // Starting from episode 46

  for (const prompt of prompts) {
    console.log(`📝 Generating episode ${episodeNumber}: ${prompt.topic}...`);
    await generateEpisode(prompt, episodeNumber);
    episodeNumber++;

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n✨ All Aggregation Framework episodes generated!");
}

generateAllEpisodes();

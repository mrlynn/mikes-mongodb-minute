const prompts = [
  {
    topic: "Serverless Instances for Unpredictable Workloads",
    difficulty: "Beginner",
    context: "Explain serverless instances and why they're ideal for unpredictable or low-traffic workloads."
  },
  {
    topic: "Atlas Triggers for Automatic Collection Updates",
    difficulty: "Intermediate",
    context: "Walk through a trigger that automatically updates a summary collection when data changes."
  },
  {
    topic: "Backend Logic with Atlas Functions",
    difficulty: "Intermediate",
    context: "Show how to use Atlas Functions to run backend logic without deploying a server."
  },
  {
    topic: "Automated Scaling in Atlas",
    difficulty: "Intermediate",
    context: "Demonstrate setting up automated scaling and when developers should enable it."
  },
  {
    topic: "Spotting CPU/IO Bottlenecks with Atlas Metrics",
    difficulty: "Beginner",
    context: "Explain Atlas metrics charts and how to spot CPU/IO bottlenecks."
  },
  {
    topic: "Network Peering vs Private Endpoints",
    difficulty: "Advanced",
    context: "Walk through the basics of Network Peering vs Private Endpoints."
  },
  {
    topic: "Scheduling Jobs with Atlas Scheduled Triggers",
    difficulty: "Intermediate",
    context: "Show how to schedule a maintenance job using Atlas Scheduled Triggers."
  },
  {
    topic: "Multi-Region Deployments and Failover",
    difficulty: "Advanced",
    context: "Explain why multi-region deployments matter and demo failover behavior conceptually."
  }
];

async function generateEpisode(prompt, episodeNumber) {
  try {
    const response = await fetch("http://localhost:3000/api/ai/generate-episode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: prompt.topic,
        category: "Atlas",
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
  console.log("🚀 Starting MongoDB Atlas Features episodes generation...\n");

  let episodeNumber = 21; // Starting from episode 21

  for (const prompt of prompts) {
    console.log(`📝 Generating episode ${episodeNumber}: ${prompt.topic}...`);
    await generateEpisode(prompt, episodeNumber);
    episodeNumber++;

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n✨ All MongoDB Atlas Features episodes generated!");
}

generateAllEpisodes();

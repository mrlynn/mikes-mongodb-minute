/**
 * Script to create a vector search index for feedback embeddings
 * 
 * This script creates a MongoDB Atlas Vector Search index on the feedback collection
 * to enable semantic clustering of free-text feedback.
 * 
 * Run this script after deploying to production:
 * node scripts/create-feedback-vector-index.js
 * 
 * Or create the index manually in MongoDB Atlas:
 * 1. Go to Atlas Search
 * 2. Create Search Index
 * 3. Use JSON Editor
 * 4. Paste the index definition below
 */

const indexDefinition = {
  name: "feedback_embedding_index",
  type: "vectorSearch",
  definition: {
    fields: [
      {
        type: "vector",
        path: "embedding",
        numDimensions: 1536, // text-embedding-3-small dimensions
        similarity: "cosine",
      },
      {
        type: "filter",
        path: "type",
      },
      {
        type: "filter",
        path: "episodeId",
      },
    ],
  },
};

console.log("Vector Search Index Definition:");
console.log(JSON.stringify(indexDefinition, null, 2));
console.log("\n");
console.log("To create this index:");
console.log("1. Go to MongoDB Atlas → Search → Create Search Index");
console.log("2. Select 'JSON Editor'");
console.log("3. Paste the definition above");
console.log("4. Save and wait for the index to build");
console.log("\n");
console.log("Or use the MongoDB CLI:");
console.log("mongocli atlas search indexes create --clusterName <your-cluster> --db mikes_mongodb_minute --collection feedback --file index-definition.json");


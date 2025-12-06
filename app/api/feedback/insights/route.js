import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

// Cluster feedback by semantic similarity using vector search
async function clusterFeedbackBySimilarity(db, feedbackList) {
  if (feedbackList.length === 0) return [];

  const clusters = [];
  const processed = new Set();

  for (let i = 0; i < feedbackList.length; i++) {
    if (processed.has(i)) continue;

    const currentFeedback = feedbackList[i];
    const cluster = {
      id: clusters.length,
      representative: currentFeedback.text.substring(0, 100),
      count: 1,
      feedback: [currentFeedback],
      episodeIds: currentFeedback.episodeId ? [currentFeedback.episodeId] : [],
    };

    processed.add(i);

    // Find similar feedback using vector search
    if (currentFeedback.embedding) {
      try {
        const similarFeedback = await db
          .collection("feedback")
          .aggregate([
            {
              $vectorSearch: {
                index: "feedback_embedding_index",
                path: "embedding",
                queryVector: currentFeedback.embedding,
                numCandidates: 50,
                limit: 10,
              },
            },
            {
              $match: {
                type: "freeText",
                text: { $exists: true, $ne: "" },
                _id: { $ne: new ObjectId(currentFeedback._id) },
              },
            },
            {
              $project: {
                text: 1,
                episodeId: 1,
                timestamp: 1,
                _id: 1,
              },
            },
          ])
          .toArray();

        // Group similar feedback (threshold: top 5 most similar)
        similarFeedback.slice(0, 5).forEach((similar) => {
          const similarIndex = feedbackList.findIndex(
            (f) => f._id?.toString() === similar._id?.toString()
          );
          if (similarIndex !== -1 && !processed.has(similarIndex)) {
            cluster.count++;
            cluster.feedback.push(feedbackList[similarIndex]);
            if (
              similar.episodeId &&
              !cluster.episodeIds.includes(similar.episodeId)
            ) {
              cluster.episodeIds.push(similar.episodeId);
            }
            processed.add(similarIndex);
          }
        });
      } catch (error) {
        // Vector search index might not exist yet - that's okay
        console.log("Vector search not available:", error.message);
      }
    }

    // Only include clusters with multiple feedback items or significant feedback
    if (cluster.count > 1 || cluster.feedback[0].text.length > 50) {
      clusters.push(cluster);
    }
  }

  // Sort by count and return top clusters
  return clusters.sort((a, b) => b.count - a.count).slice(0, 10);
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "7");
    const episodeId = searchParams.get("episodeId");

    const db = await getDb();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const filter = {
      timestamp: { $gte: startDate },
    };
    if (episodeId) filter.episodeId = episodeId;

    // Get all feedback in the time period
    const feedback = await db.collection("feedback").find(filter).toArray();

    // Calculate insights
    const insights = {
      totalFeedback: feedback.length,
      byType: {},
      byPage: {},
      satisfaction: {
        helpful: 0,
        notHelpful: 0,
        ratio: 0,
      },
      topEpisodes: [],
      topTopics: [],
      confusionHotspots: [],
      behaviorMetrics: {},
    };

    // Group by type
    feedback.forEach((f) => {
      insights.byType[f.type] = (insights.byType[f.type] || 0) + 1;
      insights.byPage[f.page] = (insights.byPage[f.page] || 0) + 1;

      // Satisfaction metrics
      if (f.type === "satisfaction") {
        if (f.value === "helpful") insights.satisfaction.helpful++;
        if (f.value === "notHelpful") insights.satisfaction.notHelpful++;
      }

      // Behavior metrics
      if (f.type === "behavior" && f.action) {
        insights.behaviorMetrics[f.action] =
          (insights.behaviorMetrics[f.action] || 0) + 1;
      }
    });

    // Calculate satisfaction ratio
    const totalSatisfaction =
      insights.satisfaction.helpful + insights.satisfaction.notHelpful;
    if (totalSatisfaction > 0) {
      insights.satisfaction.ratio =
        insights.satisfaction.helpful / totalSatisfaction;
    }

    // Top episodes by feedback count
    const episodeCounts = {};
    feedback
      .filter((f) => f.episodeId)
      .forEach((f) => {
        episodeCounts[f.episodeId] = (episodeCounts[f.episodeId] || 0) + 1;
      });

    insights.topEpisodes = Object.entries(episodeCounts)
      .map(([id, count]) => ({ episodeId: id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get episodes data for top episodes
    if (insights.topEpisodes.length > 0) {
      const episodeIds = insights.topEpisodes.map((e) => e.episodeId);
      const episodes = await db
        .collection("episodes")
        .find({
          _id: { $in: episodeIds.map((id) => new ObjectId(id)) },
        })
        .toArray();

      const episodeMap = {};
      episodes.forEach((ep) => {
        episodeMap[ep._id.toString()] = {
          title: ep.title,
          category: ep.category,
          slug: ep.slug,
        };
      });

      insights.topEpisodes = insights.topEpisodes.map((e) => ({
        ...e,
        episode: episodeMap[e.episodeId] || null,
      }));
    }

    // Free text analysis with vector search clustering
    const freeTextFeedback = feedback.filter(
      (f) => f.type === "freeText" && f.text && f.embedding
    );

    // Basic keyword extraction for confusion hotspots
    const keywordCounts = {};
    const confusionKeywords = [
      "confused",
      "don't understand",
      "unclear",
      "missing",
      "doesn't make sense",
      "hard to follow",
    ];

    feedback
      .filter((f) => f.type === "freeText" && f.text)
      .forEach((f) => {
        const lowerText = f.text.toLowerCase();
        confusionKeywords.forEach((keyword) => {
          if (lowerText.includes(keyword)) {
            keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
          }
        });
      });

    insights.confusionHotspots = Object.entries(keywordCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Vector search clustering for similar feedback
    if (freeTextFeedback.length > 0) {
      insights.feedbackClusters = await clusterFeedbackBySimilarity(
        db,
        freeTextFeedback
      );
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


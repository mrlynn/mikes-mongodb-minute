import { NextResponse } from "next/server";
import { getEpisodeById } from "@/lib/episodes";

export async function POST(req) {
  try {
    const { episodeId, title, description, tags, category } = await req.json();

    if (!episodeId) {
      return NextResponse.json(
        { error: "episodeId is required" },
        { status: 400 }
      );
    }

    // Get episode data if not provided
    let episodeData = { title, description, tags, category };
    if (!title || !description) {
      const episode = await getEpisodeById(episodeId);
      if (episode) {
        episodeData = {
          title: episodeData.title || episode.title || "",
          description: episodeData.description || episode.tip || episode.problem || "",
          tags: episodeData.tags || episode.tags || [],
          category: episodeData.category || episode.category || "",
        };
      }
    }

    // Generate AI suggestions using OpenAI or similar
    // For now, we'll create simple suggestions based on the title
    const suggestions = generateTitleSuggestions(episodeData);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error generating title suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}

function generateTitleSuggestions({ title, description, tags, category }) {
  // Simple rule-based suggestions (can be replaced with AI later)
  const baseTitle = title || "MongoDB Tip";
  const words = baseTitle.split(" ");
  
  // Create variations
  const suggestions = [
    baseTitle.length > 40 ? baseTitle.substring(0, 37) + "..." : baseTitle,
  ];

  // Add question format
  if (!baseTitle.includes("?")) {
    const questionTitle = `Why ${words.slice(0, 3).join(" ")}?`;
    if (questionTitle.length <= 40) {
      suggestions.push(questionTitle);
    }
  }

  // Add "How to" format
  if (!baseTitle.toLowerCase().startsWith("how")) {
    const howToTitle = `How to ${words.slice(0, 4).join(" ")}`;
    if (howToTitle.length <= 40) {
      suggestions.push(howToTitle);
    }
  }

  // Add category-specific prefix
  if (category) {
    const categoryTitle = `${category}: ${words.slice(0, 3).join(" ")}`;
    if (categoryTitle.length <= 40) {
      suggestions.push(categoryTitle);
    }
  }

  // Remove duplicates and limit to 5
  return [...new Set(suggestions)].slice(0, 5);
}


// Utilities for working with NewsItem data without hardcoding content.
import type { NewsItem } from "./types"

export function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Category mapping for URL slugs (Kannada names to English slugs)
const categorySlugMap: Record<string, string> = {
  "ಸಾಮಾನ್ಯ": "general",
  "ರಾಜಕೀಯ": "politics",
  "ಕ್ರೀಡೆ": "sports",
  "ಮನರಂಜನೆ": "entertainment",
  "ತಂತ್ರಜ್ಞಾನ": "technology",
  "ಟೆಕ್ನಾಲಜಿ": "technology",
  "Technology": "technology",
  "Techology": "technology", // Fix typo
  "ಆರೋಗ್ಯ": "health",
  "ವ್ಯಾಪಾರ": "business",
  "ಶಿಕ್ಷಣ": "education",
  "ಸುದ್ದಿ": "news",
  "ರಾಷ್ಟ್ರೀಯ": "national",
  "ಅಂತರರಾಷ್ಟ್ರೀಯ": "international",
  "ದೇಶ-ವಿದೇಶ": "national-international",
  "ರಾಜ್ಯ": "state",
  "ಜಿಲ್ಲೆ": "district",
  "ಬೆಂಗಳೂರು": "bangalore",
  "ಮೈಸೂರು": "mysore",
  "ಹುಬ್ಬಳ್ಳಿ": "hubballi",
  "ಮಂಗಳೂರು": "mangalore",
  "ಬೆಳಗಾವಿ": "belagavi",
  "ವೀಡಿಯೊ": "video",
  "Video": "video",
  "ಗ್ಯಾಲರಿ": "gallery",
  "Gallery": "gallery",
  "ಬ್ಲಾಗ್": "blog",
  "Blog": "blog",
  "ಜೀವನ ಶೈಲಿ": "lifestyle"
};

export function slugifyCategory(name: string) {
  if (!name || !name.trim()) return "";
  
  const trimmedName = name.trim();
  
  // First check if we have a predefined mapping
  if (categorySlugMap[trimmedName]) {
    return categorySlugMap[trimmedName];
  }

  // Fallback: create a slug from the name itself
  // For Kannada text, we'll use a simple approach
  return trimmedName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0C80-\u0CFFa-z0-9\-]/g, "") // Keep Kannada, English and numbers
    .replace(/-+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getCategoryNameFromSlug(slug: string): string {
  // Find the Kannada name for the given slug
  const entry = Object.entries(categorySlugMap).find(([_, s]) => s === slug);
  return entry ? entry[0] : slug;
}

export function getCategories(items: NewsItem[]) {
  const set = new Set(
    items.filter((i) => i.categrory_Name?.trim()).map((i) => i.categrory_Name.trim()),
  )
  return Array.from(set).sort()
}

export function getBySlug(items: NewsItem[], slug: string) {
  return items.find((i) => i.slug === slug)
}

export function filterByCategory(items: NewsItem[], categorySlug: string) {
  if (!categorySlug || !items.length) return [];
  
  return items.filter((i) => {
    if (!i.categrory_Name) return false;
    return slugifyCategory(i.categrory_Name) === categorySlug;
  });
}

export function getCategoryFromSlug(items: NewsItem[], categorySlug: string) {
  if (!categorySlug || !items.length) return categorySlug;
  
  // First try to find by exact category name match
  const found = items.find((i) => i.categrory_Name && slugifyCategory(i.categrory_Name) === categorySlug);
  
  if (found) {
    return found.categrory_Name;
  }
  
  // Fallback to mapped name
  return getCategoryNameFromSlug(categorySlug);
}

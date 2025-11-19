import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Prefer fetching from the internal API route which already proxies the remote
// Kannada news API. This is more reliable and centralizes caching/error handling.
async function fetchData() {
  // Try the internal API first
  try {
    const res = await fetch("/api/news", { next: { revalidate: 300 } });
    if (res.ok) return res.json();
    // If internal API failed for some reason, fall back to remote API
    console.warn("/api/news returned non-ok, falling back to remote API", res.status);
  } catch (err) {
    console.warn("Fetching /api/news failed, falling back to remote API", err);
  }

  // Fallback to remote endpoint
  const remote = await fetch(
    "https://newsapi.timesmed.com/WebAPI/getnewslist?siteId=31&language=Kannada",
    { next: { revalidate: 300 } }
  );
  if (!remote.ok) throw new Error("Failed to fetch blog data from remote API");
  return remote.json();
}

export default async function BlogDetail({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const json = await fetchData();

    // decode incoming slug (browser may send percent-encoded values)
    const rawSlug = params?.slug ?? "";
    const decodedSlug = typeof rawSlug === "string" ? decodeURIComponent(rawSlug) : String(rawSlug);

    // Check if we have news data that could be treated as blog posts
    const news = json?.data?.news || [];
    const blogs = json?.data?.blogs || [];

    // Helper to test equality more robustly (handles encoded/decoded and numeric ids)
    const matches = (itemSlug: any, candidate: string) => {
      if (!itemSlug) return false;
      try {
        return (
          String(itemSlug) === candidate ||
          String(itemSlug) === encodeURIComponent(candidate) ||
          decodeURIComponent(String(itemSlug)) === candidate
        );
      } catch (e) {
        return String(itemSlug) === candidate;
      }
    };

    // First try to find in blogs (slug or blog_id)
    let blog: any = blogs.find((b: any) => matches(b.slug ?? b.blog_slug, decodedSlug) || String(b.blog_id) === decodedSlug || String(b.blog_id) === encodeURIComponent(decodedSlug));

    // If not found in blogs, try to find in news (treat news as blog posts)
    if (!blog && news.length > 0) {
      blog = news.find((n: any) => matches(n.slug, decodedSlug));
    }

    if (!blog) {
      console.warn(`Blog not found for slug: ${rawSlug} (decoded: ${decodedSlug})`);
      return notFound();
    }

    // Format date helper
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link
              href="/"
              className="text-orange-600 hover:text-orange-800 transition-colors duration-300 font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link
              href="/blog"
              className="text-orange-600 hover:text-orange-800 transition-colors duration-300 font-medium"
            >
              Blog
            </Link>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-900 font-semibold truncate">
              {blog.blog_Title || blog.news_Title}
            </span>
          </nav>

          {/* Article Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Featured Image */}
            {(blog.image || blog.blog_Image) && (
              <div className="relative h-64 md:h-96 w-full overflow-hidden bg-gray-100">
                <Image
                  src={blog.image || blog.blog_Image || '/placeholder-news.svg'}
                  alt={blog.blog_Title || blog.news_Title || "Blog image"}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Meta information */}
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                {blog.insert_Date && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(blog.insert_Date)}
                  </div>
                )}
                {(blog.categrory_Name || blog.news_Source) && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {blog.categrory_Name || blog.news_Source}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {blog.blog_Title || blog.news_Title}
              </h1>

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: blog.blog_Content || blog.news_Content || ""
                }}
              />
            </div>
          </div>

          {/* Back to Blog Button */}
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error("Error in BlogDetail:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Blog
          </h1>
          <p className="text-gray-600 mb-6">Please try again later.</p>
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
}

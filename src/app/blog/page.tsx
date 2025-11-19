"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch blog data");
        const json = await res.json();
        setBlogs(json?.data?.blogs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">ಬ್ಲಾಗ್</h1>
        <div className="text-center py-12">Loading blogs...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">ಬ್ಲಾಗ್</h1>
        <div className="text-center py-12 text-red-600">Error: {error}</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">ಬ್ಲಾಗ್</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((b: any) => (
          <article key={b.blog_id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Blog Image */}
            {(b.image || b.blog_Image) && (
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <Image
                  src={b.image || b.blog_Image || '/placeholder-news.svg'}
                  alt={b.blog_Title || "Blog image"}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="p-6">
              <h2 className="font-semibold text-xl mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                {b.blog_Title}
              </h2>
              
              {b.blog_Summary && (
                <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                  <div dangerouslySetInnerHTML={{ __html: b.blog_Summary }} />
                </div>
              )}
              
              <Link
                href={`/blog/${b.slug || b.blog_id}`}
                className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium transition-colors"
              >
                ಓದಿ ಮುಂದುವರಿಸಿ
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

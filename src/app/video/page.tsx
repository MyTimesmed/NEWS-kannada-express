"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Helper function to create embeddable YouTube URL
function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

export default function Page() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch video data");
        const json = await res.json();
        setVideos(json?.data?.videos || []);
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
        <h1 className="text-2xl font-semibold mb-6">ವೀಡಿಯೊ</h1>
        <div className="text-center py-12">Loading videos...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">ವೀಡಿಯೊ</h1>
        <div className="text-center py-12 text-red-600">Error: {error}</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">ವೀಡಿಯೊ</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v: any) => {
          const videoId = getYouTubeVideoId(v.fileName || '');
          const isYouTubeVideo = !!videoId;
          
          return (
            <article
              key={v.videoDetail_id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-full h-48 relative bg-gray-100 group">
                <Image
                  src={v.image || '/placeholder-news.svg'}
                  alt={v.videoTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority={false}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
                
                {/* Video duration or indicator */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  Video
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-3 line-clamp-2">{v.videoTitle}</h2>
                
                {isYouTubeVideo ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        // Create modal or iframe to embed video
                        const modal = document.createElement('div');
                        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                        modal.innerHTML = `
                          <div class="relative w-full max-w-4xl mx-4">
                            <button class="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300">&times;</button>
                            <div class="relative pt-[56.25%]">
                              <iframe 
                                src="${getYouTubeEmbedUrl(videoId)}"
                                class="absolute inset-0 w-full h-full"
                                frameborder="0"
                                allowfullscreen
                              ></iframe>
                            </div>
                          </div>
                        `;
                        
                        // Close modal on click
                        modal.addEventListener('click', (e) => {
                          if (e.target === modal || (e.target as HTMLElement).textContent === '×') {
                            document.body.removeChild(modal);
                          }
                        });
                        
                        document.body.appendChild(modal);
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 mr-2" fill="currentColor" />
                      ವೀಡಿಯೊ ಪ್ಲೇ ಮಾಡಿ
                    </button>
                    <Link
                      href={v.fileName}
                      className="block text-center text-orange-600 hover:text-orange-800 text-sm"
                      target="_blank"
                    >
                      YouTube ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={v.fileName}
                    className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium"
                    target="_blank"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    ವೀಕ್ಷಣೆ ಮಾಡಿ
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { NewsItem } from "@/lib/types";
import Ad from "./Ad";
import Image from "next/image";

export default function Hero() {
  const { data, error, isLoading } = useSWR("news-data", fetcher);

  // Get random news items from the data
  const getNews = () => {
    if (!data?.data?.news) return [];

    const allNews = data.data.news;
    // Function to get random unique news items
    const getRandomNews = (newsArray: NewsItem[], count: number) => {
      const shuffled = [...newsArray].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, newsArray.length));
    };

    return getRandomNews(allNews, 8);
  };

  const news = getNews();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("kn-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-orange-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ಲೋಡ್ ಆಗುತ್ತಿದೆ...
          </h2>
          <p className="text-gray-600">ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 mb-4 tracking-tight">
            ಕನ್ನಡ ಎಕ್ಸ್‌ಪ್ರೆಸ್
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            ಕರ್ನಾಟಕದ ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳು ಮತ್ತು ನವೀಕರಣಗಳು
          </p>
        </div>

        {/* Hero Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Large Featured Cards - 2 stacked */}
          <div className="lg:col-span-8 space-y-6">
            {news.slice(0, 2).map((item, idx) => (
              <Link
                key={item.news_Id}
                href={`/news/${encodeURIComponent(item.slug)}`}
                className="block group"
              >
                <div
                  className={`relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] ${
                    idx === 0 ? "h-96" : "h-80"
                  }`}
                >
                  <div className="relative h-full overflow-hidden">
                    <Image
                      src={item.image || '/placeholder-news.svg'}
                      alt={item.news_Title}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="inline-block px-3 py-1 bg-orange-600 rounded-full text-sm font-semibold mb-3">
                        {idx === 0 ? "ಪ್ರಮುಖ ಸುದ್ದಿ" : "ಮುಖ್ಯ ಸುದ್ದಿ"}
                      </span>
                      <h2
                        className={`font-bold mb-2 line-clamp-2 ${
                          idx === 0
                            ? "text-2xl md:text-3xl"
                            : "text-xl md:text-2xl"
                        }`}
                      >
                        {item.news_Title}
                      </h2>
                      <p
                        className={`text-gray-200 line-clamp-2 mb-3 ${
                          idx === 0 ? "text-base" : "text-sm"
                        }`}
                      >
                        {item.news_Content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          {item.news_Source}
                        </span>
                        <span className="text-sm text-gray-300">
                          {formatDate(item.insert_Date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Side Cards */}
          <div className="lg:col-span-4 space-y-6">
            {news.slice(2, 4).map((item) => (
              <Link
                key={item.news_Id}
                href={`/news/${encodeURIComponent(item.slug)}`}
                className="block group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image || '/placeholder-news.svg'}
                      alt={item.news_Title}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {item.news_Title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {item.news_Content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.news_Source}</span>
                      <span>{formatDate(item.insert_Date)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Grid of smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.slice(4, 8).map((item, idx) => (
            <Link
              key={item.news_Id}
              href={`/news/${encodeURIComponent(item.slug)}`}
              className="group"
            >
              <div
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-2"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image || '/placeholder-news.svg'}
                    alt={item.news_Title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full shadow-lg">
                      {item.categrory_Name}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {item.news_Title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {item.news_Content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span className="font-medium">{item.news_Source}</span>
                    <span>{formatDate(item.insert_Date)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Last Card - Full Width */}
        {news[7] && (
          <div className="mt-6">
            <Link
              href={`/news/${encodeURIComponent(news[7].slug)}`}
              className="block group"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <Image
                      src={news[7].image || '/placeholder-news.svg'}
                      alt={news[7].news_Title}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="inline-block w-fit px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
                      {news[7].categrory_Name}
                    </span>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                      {news[7].news_Title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 line-clamp-3">
                      {news[7].news_Content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="font-medium">{news[7].news_Source}</span>
                      <span>{formatDate(news[7].insert_Date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

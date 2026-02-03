import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { BlogApiServer } from '@/lib/blog-api';
import JsonLd from '@/components/json-ld';
import { generateArticleSchema } from '@/lib/schemas/article-schema';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';
import ReadingProgress from '@/components/blog/reading-progress';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await BlogApiServer.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await BlogApiServer.getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found | Warrior Leap Blog' };
  }

  return {
    title: `${post.title} | Warrior Leap Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Warrior Leap Blog`,
      description: post.excerpt,
      type: 'article',
      url: `https://warriorleap.com/blog/${post.slug}`,
      images: post.featured_image ? [{ url: post.featured_image }] : undefined,
      publishedTime: post.published_at,
      authors: [post.author],
      tags: post.tags,
    },
    alternates: {
      canonical: `https://warriorleap.com/blog/${post.slug}`,
    },
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-brand-dark">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderContent(content: string) {
  return content.split('\n').map((line, index) => {
    if (line.trim() === '') return null;
    if (line.startsWith('# '))
      return (
        <h1 key={index} className="text-2xl font-bold text-brand-dark mt-8 mb-1">
          {formatText(line.substring(2))}
        </h1>
      );
    if (line.startsWith('## '))
      return (
        <h2 key={index} className="text-xl font-semibold text-brand-dark mt-7 mb-1">
          {formatText(line.substring(3))}
        </h2>
      );
    if (line.startsWith('### '))
      return (
        <h3 key={index} className="text-base font-semibold text-brand-dark mt-5 mb-1">
          {formatText(line.substring(4))}
        </h3>
      );
    if (line.startsWith('- '))
      return (
        <li key={index} className="text-gray-700 ml-4 mb-1">
          {formatText(line.substring(2))}
        </li>
      );
    if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
      return (
        <p key={index} className="font-semibold text-brand-dark mt-4 mb-1">
          {formatText(line)}
        </p>
      );
    }
    return (
      <p key={index} className="text-gray-700 leading-relaxed mb-4">
        {formatText(line)}
      </p>
    );
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await BlogApiServer.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await BlogApiServer.getRelatedPosts(post.id, post.tags, 2);

  const breadcrumbs = [
    { name: 'Home', url: 'https://warriorleap.com' },
    { name: 'Blog', url: 'https://warriorleap.com/blog' },
    { name: post.title, url: `https://warriorleap.com/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={generateArticleSchema(post)} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <div className="min-h-screen bg-white">
        <ReadingProgress />

        {/* Back Button */}
        <div className="border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <Link
              href="/blog"
              className="text-gray-600 hover:text-brand-primary text-sm font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article */}
        <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          <header className="mb-8">
            {post.tags[0] && (
              <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded mb-4 inline-block">
                {post.tags[0]}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.read_time} min read
              </span>
            </div>
          </header>

          {post.featured_image && (
            <div className="mb-8 rounded-xl overflow-hidden bg-gray-100">
              <img src={post.featured_image} alt={post.title} className="w-full h-auto" />
            </div>
          )}

          <div className="prose max-w-none">{renderContent(post.content)}</div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold text-brand-dark mb-6">Related Articles</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow block"
                  >
                    {relatedPost.featured_image && (
                      <div className="h-32 bg-gray-200">
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-brand-dark mb-2 line-clamp-2">{relatedPost.title}</h4>
                      <span className="text-brand-primary text-xs font-medium inline-flex items-center gap-1">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}

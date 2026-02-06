import type { Metadata } from 'next';
import { BlogApiServer } from '@/lib/blog-api';
import JsonLd from '@/components/json-ld';
import { generateBreadcrumbSchema } from '@/lib/schemas/breadcrumb-schema';
import BlogListingClient from '@/components/blog/blog-listing-client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Cold Therapy Blog & Recovery Guides',
  description:
    'Guides, tips, and research on cold therapy, ice baths, and recovery. Written for anyone getting into cold plunging.',
  openGraph: {
    title: 'Cold Therapy Blog & Recovery Guides | Warrior Leap',
    description:
      'Guides, tips, and research on cold therapy, ice baths, and recovery.',
    type: 'website',
    url: 'https://warriorleap.com/blog',
  },
  alternates: {
    canonical: 'https://warriorleap.com/blog',
  },
};

export default async function BlogPage() {
  const posts = await BlogApiServer.getPublishedPosts();

  const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();

  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Warrior Leap Blog',
    description:
      'Guides, tips, and research on cold therapy, ice baths, and recovery.',
    url: 'https://warriorleap.com/blog',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.slice(0, 10).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://warriorleap.com/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  const breadcrumbs = [
    { name: 'Home', url: 'https://warriorleap.com' },
    { name: 'Blog', url: 'https://warriorleap.com/blog' },
  ];

  return (
    <>
      <JsonLd data={blogListSchema} />
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <BlogListingClient posts={posts} allTags={allTags} />
    </>
  );
}

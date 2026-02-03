import { BlogPost } from '@/types/blog';

export function generateArticleSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://warriorleap.com/about',
      jobTitle: 'Cold Therapy Expert',
      worksFor: {
        '@type': 'Organization',
        name: 'Warrior Leap',
        url: 'https://warriorleap.com',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Warrior Leap',
      logo: {
        '@type': 'ImageObject',
        url: 'https://warriorleap.com/assets/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://warriorleap.com/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    wordCount: post.content.split(/\s+/).length,
    articleSection: 'Cold Therapy',
  };
}

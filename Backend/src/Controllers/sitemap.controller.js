import mongoose from 'mongoose';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { asyncHandler } from '../Utils/asyncHandler.js';

export const generateSitemap = asyncHandler(async (req, res) => {
  // Create a stream for sitemap
  const stream = new SitemapStream({ 
    hostname: 'https://snippethub.tech',
    xmlns: {
      news: false,
      xhtml: false,
      image: false,
      video: false
    }
  });
  
  // Add static routes
  const staticRoutes = [
    { url: '/', changefreq: 'daily', priority: 1 },
    { url: '/explore', changefreq: 'hourly', priority: 0.9 },
    { url: '/auth', changefreq: 'monthly', priority: 0.5 },
    { url: '/create', changefreq: 'weekly', priority: 0.8 },
    { url: '/collections', changefreq: 'daily', priority: 0.8 },
    { url: '/dashboard', changefreq: 'daily', priority: 0.9 },
    { url: '/profile', changefreq: 'weekly', priority: 0.7 },
  ];

  // Get dynamic routes from database
  const [snippets, collections, users] = await Promise.all([
    mongoose.model('Snippet').find({}, 'id updatedAt'),
    mongoose.model('Collection').find({}, 'id updatedAt'),
    mongoose.model('User').find({}, 'username updatedAt')
  ]);

  // Convert database data to sitemap entries
  const dynamicRoutes = [
    ...snippets.map(snippet => ({
      url: encodeURI(`/snippets/${snippet._id}`),
      lastmod: snippet.updatedAt,
      changefreq: 'weekly',
      priority: 0.6
    })),
    ...collections.map(collection => ({
      url: encodeURI(`/collections/${collection._id}`),
      lastmod: collection.updatedAt,
      changefreq: 'weekly',
      priority: 0.6
    })),
    ...users.map(user => ({
      url: encodeURI(`/user/${user.username}`),
      lastmod: user.updatedAt,
      changefreq: 'weekly',
      priority: 0.6
    }))
  ];

  // Combine static and dynamic routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  // Create sitemap
  const data = await streamToPromise(
    Readable.from(allRoutes).pipe(stream)
  );

  // Set headers and send response
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');
  res.send(data);
});

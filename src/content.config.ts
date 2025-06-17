import {glob} from 'astro/loaders';
import {defineCollection, z} from 'astro:content';

const seoSchema = z.object({
    title: z.string().min(5).max(120).optional(),
    description: z.string().min(15).max(160).optional(),
    image: z
        .object({
            src: z.string(),
            alt: z.string().optional()
        })
        .optional(),
    pageType: z.enum(['website', 'article']).default('website')
});

const blog = defineCollection({
    loader: glob({pattern: '**/*.{md,mdx}', base: './src/content/blog'}),
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        publishDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        isFeatured: z.boolean().default(false),
        tags: z.array(z.string()).default([]),
        seo: seoSchema.optional()
    })
});

const pages = defineCollection({
    loader: glob({pattern: '**/*.{md,mdx}', base: './src/content/pages'}),
    schema: z.object({
        title: z.string(),
        seo: seoSchema.optional(),
        showHeader: z.boolean().default(false),
    })
});

const projects = defineCollection({
    loader: glob({pattern: '**/*.{md,mdx}', base: './src/content/projects'}),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        publishDate: z.coerce.date(),
        isFeatured: z.boolean().default(false),
        seo: seoSchema.optional()
    })
});

const tutorials = defineCollection({
    loader: glob({pattern: '**/*.{md,mdx}', base: './src/content/tutorials'}),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        publishDate: z.coerce.date(),
        draft: z.boolean().optional(),
        seo: seoSchema.optional()
    })
});

export const collections = {blog, pages, projects, tutorials};

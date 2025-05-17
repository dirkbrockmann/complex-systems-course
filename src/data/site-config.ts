export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Author = {
    name: string;
    image?: Image;
    url?: string;
}

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    website: string;
    author: Author;
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    logo: {
        light: '/logo.png',
        dark: '/logo_dark.png',
        alt: 'SynoSys'
    },
    website: 'https://synosys.github.io/teaching/complex-systems-biology/',
    title: 'Introduction to Complex Systems in Biology (and Beyond)',
    author: {
        name: 'Dirk Brockmann',
        image: {
            src: '/author.jpg',
            alt: 'Dirk Brockmann'
        },
        url: 'https://synosys.github.io'
    },
    subtitle: 'A course by Dirk Brockmann',
    description: '',
    image: {
        src: '/complexity.png',
        alt: 'Complex Systems in Biology'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        // {
        //     text: 'Projects',
        //     href: '/projects'
        // },
        // {
        //     text: 'Blog',
        //     href: '/blog'
        // },
        // {
        //     text: 'Tags',
        //     href: '/tags'
        // },
        {
            text: 'Contact',
            href: '/contact'
        },
        {
            text: 'Explorables',
            href: 'https://complexity-explorables.org'
        }
    ],
    footerNavLinks: [

        {
            text: 'Contact',
            href: '/contact'
        }, {
            text: 'Terms',
            href: '/terms'
        }
    ],
    socialLinks: [

        {
            text: 'Center Synergy of Systems',
            href: 'https://synosys.github.io'
        }, {
            text: 'TU Dresden',
            href: 'https://tu-dresden.de'
        }
    ],

    hero: {
        title: 'Welcome!', // need to update this
        text: "brüllafen alarm ist auch was schönes, vor allem morgens", // need to update this
        image: {
            src: '/hero.jpeg', // need to update this
            alt: 'A person sitting at a desk in front of a computer' // need to update this
        },
        actions: [ // get rid of this
            {
                text: 'Get in Touch',
                href: '/contact'
            }
        ]
    },
    subscribe: { // get rid of this
        title: 'Subscribe to Dante Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        formUrl: '#'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;

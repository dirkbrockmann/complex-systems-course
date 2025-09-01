import type {ImageMetadata} from 'astro:assets';
import {default as complexityImg} from '../assets/complexity.png';
import authorImg from '../assets/dirk.png';
import logoDark from '../assets/generated/logo_dark.png';
import logoLight from '../assets/logo.png';

export type Image = {
    src: ImageMetadata;
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
        src: logoLight.src,
        alt: 'SynoSys'
    },
    logoDark: {
        src: logoDark.src,
        alt: 'SynoSys (Dark)'
    },
    website: 'https://dirkbrockmann.github.io/',
    base: '/complex-systems-course/',
    title: 'Introduction to Complex Systems',
    author: {
        name: 'Dirk Brockmann',
        image: {
            src: authorImg.src,
            alt: 'Dirk Brockmann'
        },
        url: 'https://synosys.github.io'
    },
    subtitle: 'Module M0500-31W20, WiSe 2025/25',
    description: '',
    image: {
        src: complexityImg.src,
        alt: 'Complex Systems in Biology'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },

        {
            text: 'TL;DR',
            href: '/tldr'
        },
        {
            text: 'Seminar',
            href: '/seminar'
        },
        {
            text: 'Lab Course',
            href: '/lab'
        },
        {
            text: 'Tutorials',
            href: '/tutorials'
        },
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


    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;

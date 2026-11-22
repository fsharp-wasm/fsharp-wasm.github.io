import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Projects',
      href: getPermalink('/projects'),
    },
    {
      text: 'Docs',
      href: getPermalink('/docs'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Community',
      href: getPermalink('/community'),
    },
    {
      text: 'Explore',
      links: [
        { text: 'Live demos', href: getPermalink('/demos') },
        { text: 'Examples', href: getPermalink('/examples') },
        { text: 'Benchmarks', href: getPermalink('/benchmarks') },
        { text: 'Backend benchmarks', href: getPermalink('/benchmarks/backend') },
        { text: 'Tests', href: getPermalink('/tests') },
        { text: 'Backend on the edge', href: getPermalink('/backend') },
        { text: 'Roadmap', href: getPermalink('/docs/roadmap') },
      ],
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
  ],
  actions: [
    {
      text: 'GitHub',
      href: 'https://github.com/fsharp-wasm/fsharp-wasm',
      target: '_blank',
      icon: 'tabler:brand-github',
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Project',
      links: [
        { text: 'All projects', href: getPermalink('/projects') },
        { text: 'Documentation', href: getPermalink('/docs') },
        { text: 'Getting Started', href: getPermalink('/docs/getting-started') },
        { text: 'Architecture', href: getPermalink('/docs/architecture') },
        { text: 'Roadmap', href: getPermalink('/docs/roadmap') },
        { text: 'Live demos', href: getPermalink('/demos') },
        { text: 'Examples', href: getPermalink('/examples') },
        { text: 'Benchmarks', href: getPermalink('/benchmarks') },
        { text: 'Backend benchmarks', href: getPermalink('/benchmarks/backend') },
        { text: 'Tests', href: getPermalink('/tests') },
        { text: 'Backend on the edge', href: getPermalink('/backend') },
      ],
    },
    {
      title: 'Community',
      links: [
        { text: 'Join the community', href: getPermalink('/community') },
        { text: 'GitHub', href: 'https://github.com/fsharp-wasm' },
        { text: 'Discussions', href: 'https://github.com/fsharp-wasm/fsharp-wasm/discussions' },
        {
          text: 'Contributing',
          href: 'https://github.com/fsharp-wasm/fsharp-wasm/blob/main/CONTRIBUTING.md',
        },
        {
          text: 'Security',
          href: 'https://github.com/fsharp-wasm/fsharp-wasm/blob/main/SECURITY.md',
        },
      ],
    },
    {
      title: 'About',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Contact', href: getPermalink('/contact') },
        { text: 'Why sponsor', href: getPermalink('/sponsor') },
        { text: 'Sponsor the organisation', href: 'https://github.com/sponsors/fsharp-wasm', target: '_blank' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Terms', href: getPermalink('/terms') },
        { text: 'Privacy Policy', href: getPermalink('/privacy') },
        {
          text: 'Apache License 2.0',
          href: 'https://github.com/fsharp-wasm/fsharp-wasm/blob/main/LICENSE',
          target: '_blank',
        },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    {
      ariaLabel: 'GitHub',
      icon: 'tabler:brand-github',
      href: 'https://github.com/fsharp-wasm',
    },
  ],
  footNote: `Brought to you by the <a class="text-violet-600 underline dark:text-violet-400" href="https://github.com/fsharp-wasm">fsharp-wasm organization</a>. Sponsored by <a class="text-violet-600 underline dark:text-violet-400" href="https://www.amano.services/" target="_blank" rel="noopener">Amano Services</a>.`,
};

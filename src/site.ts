// What the site says about Redvars, from the brand section of the manifesto.
export const site = {
    name: 'Redvars',
    tagline: 'The Modern Platform for Enterprise Applications.',
    motto: 'Code Less. Scale Everywhere. Build Natively.',
    description:
        'A unified, high-performance platform that simplifies and accelerates the engineering of secure, resilient, and enterprise-grade software from the core database layer to the user interface.',
    email: 'hello@redvars.com',
    githubUrl: 'https://github.com/redvars',
};

// Peacock, our design system, loads from its npm release on jsDelivr, as its readme shows.
const peacockVersion = '3.9.1';

export function peacockAsset(path: string): string {
    return `https://cdn.jsdelivr.net/npm/@redvars/peacock@${peacockVersion}/dist/${path}`;
}

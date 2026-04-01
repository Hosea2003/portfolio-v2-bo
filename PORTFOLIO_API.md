# Portfolio API Documentation

Base URL: `http://localhost:1338`

GraphQL Playground: `http://localhost:1338/graphql`

## Authentication

Public access requires permissions to be enabled in:
**Settings > Users & Permissions > Roles > Public** — enable `find` and `findOne` for all content types.

All queries support `locale` parameter: `"en"` (default) or `"fr"`.

---

## Data Models

### PersonalInfo (Single Type)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Full name ("RINDRA HOSEA") |
| role | String | Yes | Job title ("Full Stack Developer") |
| subtitle | String | No | Tech stack tagline ("React • Next.js • React Native") |
| bio | String | No | Short biography text |
| heroCtaText | String | No | CTA button text (default: "Hire me") |
| profileImage | Media | No | Profile photo (single image) |
| resume | Media | No | Resume file (PDF) |
| socialLinks | [SocialLink] | No | Repeatable component |
| email | String | No | Contact email |

### ContactInfo (Single Type)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Section heading ("Let's Work Together") |
| subtitle | String | No | Section subheading |
| email | String | No | Contact email |
| phone | String | No | Phone number |
| location | String | No | Location/city |

### Project (Collection)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Project name |
| slug | UID | Yes | URL-friendly identifier (auto from title) |
| category | String | Yes | Project type ("Marketplace", "Mobile Application") |
| description | String | Yes | Project description |
| image | Media | No | Main project image (single) |
| gallery | Media | No | Additional screenshots (multiple) |
| url | String | No | Live project URL |
| githubUrl | String | No | GitHub repository URL |
| technologies | JSON | No | Array of tech names, e.g. `["React", "Node.js"]` |
| featured | Boolean | No | Show in featured section (default: false) |
| order | Integer | No | Sort order (default: 0) |

### Experience (Collection)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| role | String | Yes | Job title |
| company | String | Yes | Company name |
| companyLogo | Media | No | Company logo (single image) |
| companyUrl | String | No | Company website URL |
| startDate | Date | Yes | Start date (YYYY-MM-DD) |
| endDate | Date | No | End date (null if current) |
| isCurrent | Boolean | No | Currently working here (default: false) |
| description | String | Yes | Role description |
| technologies | JSON | No | Array of tech names used |
| order | Integer | No | Sort order (default: 0) |

### Service (Collection)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Service name ("Backend Development") |
| description | String | Yes | Short description ("NestJS • Django") |
| icon | String | No | Icon identifier (e.g. "server", "layout") |
| order | Integer | No | Sort order (default: 0) |

### Skill (Collection)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Technology name ("React") |
| icon | Media | No | Technology icon/logo |
| category | Enum | No | One of: `frontend`, `backend`, `mobile`, `database`, `devops`, `other` |
| proficiency | Integer | No | Skill level 0-100 |
| order | Integer | No | Sort order (default: 0) |

### SocialLink (Component — shared.social-link)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| platform | Enum | Yes | One of: `github`, `linkedin`, `twitter`, `facebook`, `instagram`, `youtube`, `dribbble`, `behance`, `other` |
| url | String | Yes | Profile URL |
| label | String | No | Display label |

---

## GraphQL Queries

### Fetch all portfolio data (single query)

```graphql
query Portfolio($locale: I18NLocaleCode) {
  personalInfo(locale: $locale) {
    name
    role
    subtitle
    bio
    heroCtaText
    email
    profileImage {
      url
      alternativeText
    }
    resume {
      url
    }
    socialLinks {
      platform
      url
      label
    }
  }

  contactInfo(locale: $locale) {
    title
    subtitle
    email
    phone
    location
  }

  projects(locale: $locale, sort: "order:asc", filters: { featured: { eq: true } }) {
    documentId
    title
    slug
    category
    description
    image {
      url
      alternativeText
    }
    gallery {
      url
      alternativeText
    }
    url
    githubUrl
    technologies
    featured
    order
  }

  experiences(locale: $locale, sort: "order:asc") {
    documentId
    role
    company
    companyLogo {
      url
    }
    companyUrl
    startDate
    endDate
    isCurrent
    description
    technologies
    order
  }

  services(locale: $locale, sort: "order:asc") {
    documentId
    title
    description
    icon
    order
  }

  skills(locale: $locale, sort: "order:asc") {
    documentId
    name
    icon {
      url
    }
    category
    proficiency
    order
  }
}
```

Variables:
```json
{ "locale": "en" }
```

### Fetch single project by slug

```graphql
query ProjectBySlug($slug: String!, $locale: I18NLocaleCode) {
  projects(filters: { slug: { eq: $slug } }, locale: $locale) {
    title
    slug
    category
    description
    image {
      url
      width
      height
      alternativeText
    }
    gallery {
      url
      width
      height
      alternativeText
    }
    url
    githubUrl
    technologies
  }
}
```

Variables:
```json
{ "slug": "rico", "locale": "fr" }
```

---

## REST API Equivalents

```
GET /api/personal-info?locale=en&populate=*
GET /api/contact-info?locale=fr
GET /api/projects?locale=en&populate=*&sort=order:asc&filters[featured][$eq]=true
GET /api/experiences?locale=en&populate=*&sort=order:asc
GET /api/services?locale=en&sort=order:asc
GET /api/skills?locale=en&populate=*&sort=order:asc
```

---

## Integration Example (Next.js)

```typescript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const GRAPHQL_URL = `${STRAPI_URL}/graphql`;

interface StrapiImage {
  url: string;
  alternativeText: string | null;
  width?: number;
  height?: number;
}

interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'dribbble' | 'behance' | 'other';
  url: string;
  label: string | null;
}

interface PersonalInfo {
  name: string;
  role: string;
  subtitle: string | null;
  bio: string | null;
  heroCtaText: string | null;
  email: string | null;
  profileImage: StrapiImage | null;
  resume: { url: string } | null;
  socialLinks: SocialLink[];
}

interface ContactInfo {
  title: string;
  subtitle: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
}

interface Project {
  documentId: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: StrapiImage | null;
  gallery: StrapiImage[];
  url: string | null;
  githubUrl: string | null;
  technologies: string[] | null;
  featured: boolean;
  order: number;
}

interface Experience {
  documentId: string;
  role: string;
  company: string;
  companyLogo: StrapiImage | null;
  companyUrl: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  technologies: string[] | null;
  order: number;
}

interface Service {
  documentId: string;
  title: string;
  description: string;
  icon: string | null;
  order: number;
}

interface Skill {
  documentId: string;
  name: string;
  icon: StrapiImage | null;
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'devops' | 'other';
  proficiency: number | null;
  order: number;
}

interface PortfolioData {
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  projects: Project[];
  experiences: Experience[];
  services: Service[];
  skills: Skill[];
}

const PORTFOLIO_QUERY = `
  query Portfolio($locale: I18NLocaleCode) {
    personalInfo(locale: $locale) {
      name role subtitle bio heroCtaText email
      profileImage { url alternativeText }
      resume { url }
      socialLinks { platform url label }
    }
    contactInfo(locale: $locale) {
      title subtitle email phone location
    }
    projects(locale: $locale, sort: "order:asc", filters: { featured: { eq: true } }) {
      documentId title slug category description
      image { url alternativeText }
      gallery { url alternativeText }
      url githubUrl technologies featured order
    }
    experiences(locale: $locale, sort: "order:asc") {
      documentId role company
      companyLogo { url }
      companyUrl startDate endDate isCurrent description technologies order
    }
    services(locale: $locale, sort: "order:asc") {
      documentId title description icon order
    }
    skills(locale: $locale, sort: "order:asc") {
      documentId name
      icon { url }
      category proficiency order
    }
  }
`;

export async function getPortfolioData(locale: 'en' | 'fr' = 'en'): Promise<PortfolioData> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: PORTFOLIO_QUERY, variables: { locale } }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  return json.data;
}

// Helper to get full image URL from Strapi
export function strapiImageUrl(image: StrapiImage | null): string | null {
  if (!image?.url) return null;
  if (image.url.startsWith('http')) return image.url;
  return `${STRAPI_URL}${image.url}`;
}
```

### Usage in a page

```typescript
import { getPortfolioData, strapiImageUrl } from '@/lib/strapi';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const data = await getPortfolioData(params.locale as 'en' | 'fr');

  return (
    <>
      <h1>{data.personalInfo.name}</h1>
      <p>{data.personalInfo.role}</p>

      {data.projects.map((project) => (
        <div key={project.documentId}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          {project.image && (
            <img src={strapiImageUrl(project.image)} alt={project.image.alternativeText || ''} />
          )}
        </div>
      ))}
    </>
  );
}
```

---

## Media URLs

Uploaded images return relative paths like `/uploads/photo_abc123.jpg`.
Prepend your Strapi base URL: `http://localhost:1338/uploads/photo_abc123.jpg`.

In production, configure an upload provider (AWS S3, Cloudinary, etc.) for absolute URLs.

export interface PropertyUnit {
  name: string;
  type: string;
  capacity: number;
  price: number;
  description: string;
}

export interface PropertyExperience {
  name: string;
  duration: string;
  price: number;
  description: string;
}

export interface PropertyReview {
  author: string;
  text: string;
  featured: boolean;
}

export interface PropertyColors {
  dark: string;
  accent: string;
  tint: string;
}

export interface PropertyData {
  name: string;
  type: 'glamping' | 'villa' | 'hotel' | 'eco-lodge' | 'campsite';
  location: {
    area: string;
    description: string;
    how_to_reach: string;
  };
  description: string;
  colors: PropertyColors;
  units: PropertyUnit[];
  experiences: PropertyExperience[];
  reviews: PropertyReview[];
  contact: {
    phone: string;
    email: string;
    website: string;
    instagram: string;
  };
  images: string[];
}

export interface GeneratedContent {
  tagline: string;
  story: { p1: string; p2: string; p3: string };
  pullquote: string;
  experience: { p1: string; p2: string };
  experience_pillars: Array<{ label: string; headline: string; body: string }>;
  units: Array<{ name: string; tagline: string }>;
  hero_experience: { name: string; narrative: string };
  add_ons: Array<{ name: string; line1: string; line2: string }>;
  archetypes: Array<{ title: string; invitation: string }>;
  closing_line: string;
}

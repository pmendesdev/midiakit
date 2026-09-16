export interface Partnership {
  id: string;
  brand_name: string;
  logo_url: string;
  campaign_description: string;
  link: string;
  created_at: string;
  category?: string;
  highlight?: boolean;
}

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  change?: string;
  description: string;
  iconName: string;
  highlight?: boolean;
}

export interface DeliverableItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  format: string;
  icon: string;
  category?: string;
  benefit?: string;
  highlight?: boolean;
}

export interface DemographicsData {
  femalePercentage: number;
  malePercentage: number;
  ageBrackets: { range: string; percentage: number }[];
  topLocations: { city: string; state: string; percentage: number }[];
}

export interface InfluencerProfile {
  name: string;
  handle: string;
  city: string;
  state: string;
  age: number;
  sonName: string;
  sonAge: number;
  bio: string;
  avatarUrl: string;
  badgeText?: string;
  niches?: string[];
  ctaText?: string;
  contact: {
    instagram: string;
    phone: string;
    phoneFormatted: string;
    email: string;
  };
}

export interface CompanyLogo {
  id: string;
  name: string;
  logoUrl: string;
  category: string;
  campaignDescription?: string;
  deliverables?: string;
  year?: string;
  website?: string;
  isCustom?: boolean;
}

export interface FollowerGrowthPoint {
  month: string;
  monthFull: string;
  followers: number;
  followersFormatted: string;
  newFollowers: number;
  growthRate: string;
  impressions: string;
  highlightEvent?: string;
}

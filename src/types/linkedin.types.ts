export interface LinkedInAnalyticsElement {
  pivotValues?: string[];
  [key: string]: any;
}

export interface LinkedInAnalyticsResponse {
  elements: LinkedInAnalyticsElement[];
}

export interface LinkedInOrganizationLookupResponse {
  results: Record<string, LinkedInOrganization>;
}

export interface DateRange {
  start: {
    year: number;
    month: number;
    day: number;
  };
  end: {
    year: number;
    month: number;
    day: number;
  };
}

// -------

export interface LinkedInOrganizationsResponse {
  organizations: Record<string, LinkedInOrganization>;
}

export interface LinkedInOrganization {
  id: number;
  vanityName: string;
  localizedName: string;
  name: LocalizedText;
  primaryOrganizationType: string; // Often "NONE"
  locations: OrganizationLocation[];
  localizedWebsite?: string;
  logoV2?: OrganizationLogo;
}

export interface LocalizedText {
  localized: Record<string, string>; // e.g., { "en_US": "Name" }
  preferredLocale: {
    country: string;
    language: string;
  };
}

export interface OrganizationLocation {
  locationType: "HEADQUARTERS" | "OTHER";
  address: LocationAddress;
  description?: LocalizedText;
  localizedDescription?: string;
  streetAddressFieldState: "UNSET_OPT_OUT" | "OPT_OUT" | string;
  geoLocation: string; // URN string
}

export interface LocationAddress {
  geographicArea?: string; // State/Province
  country: string; // ISO Country code
  city: string;
  line1?: string;
  line2?: string;
  postalCode?: string;
}

export interface OrganizationLogo {
  cropped: string; // URN
  original: string; // URN
  cropInfo: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

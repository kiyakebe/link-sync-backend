export interface LinkedInAnalyticsElement {
  pivotValues?: string[];
  [key: string]: any;
}

export interface LinkedInOrganization {
  id: number;
  name: string;
  [key: string]: any;
}

export interface LinkedInAnalyticsResponse {
  elements: LinkedInAnalyticsElement[];
}

export interface LinkedInOrganizationLookupResponse {
  results: LinkedInOrganization[];
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

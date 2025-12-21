import { linkedinClient } from "../utils/linkedin-client";
import {
  LinkedInOrganization,
  LinkedInOrganizationLookupResponse,
} from "../types/linkedin.types";

export class OrganizationService {
  static async lookup(ids: number[]): Promise<LinkedInOrganization[]> {
    if (!ids.length) {
      return [];
    }

    const response =
      await linkedinClient.get<LinkedInOrganizationLookupResponse>(
        "/organizationsLookup",
        {
          params: {
            ids: `List(${ids.join(",")})`,
          },
        }
      );

    return response.data.results || [];
  }
}

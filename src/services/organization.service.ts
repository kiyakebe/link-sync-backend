import { linkedinClient } from "../utils/linkedin-client";
import { LinkedInOrganizationLookupResponse } from "../types/linkedin.types";

export class OrganizationService {
  static async lookup(
    ids: number[]
  ): Promise<LinkedInOrganizationLookupResponse> {
    if (!ids.length) {
      return {
        results: {},
      };
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

    return response.data;
  }
}

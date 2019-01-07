import { schema } from "normalizr";
import { MemberOAuth } from "./oauth";

export interface Member {
  id: number;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  profile_image_url: string;
  affiliation: string;
  oauth: MemberOAuth | null;
  is_author_connected: boolean;
  author_id: number;
}

export const memberSchema = new schema.Entity("members");

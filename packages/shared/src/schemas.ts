import * as auth from "./tables/auth";

export const schema = {
  // DO NOT modify `./tables/auth.ts`
  // which is AUTO genereated by 'better-auth'
  ...auth,
};

// Export individual schemas for easier imports
export * from "./tables/auth";

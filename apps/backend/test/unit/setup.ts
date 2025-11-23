import { beforeEach, vi } from "vitest";

vi.mock("@/infra/logger", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/infra/logger")>();

  return {
    ...actual,
    withContext: vi.fn(),
    getLogger: vi.fn(() => {
      return {
        trace: vi.fn(),
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        fatal: vi.fn(),
      };
    }),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

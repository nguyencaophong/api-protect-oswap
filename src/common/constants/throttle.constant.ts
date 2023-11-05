export const throttlerOptions: Record<string, any> = {
  short: {
    short: {
      limit: 5,
      ttl: 10000,
    },
  },
  medium: {
    medium: {
      limit: 10,
      ttl: 30000,
    },
  },
  long: {
    long: {
      limit: 15,
      ttl: 60000,
    },
  },
};

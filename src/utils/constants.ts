// status codes
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,

  INTERNAL_SERVER_ERROR: 500,
} as const;

// cache
export const CacheTTL = {
  PRODUCTS: 300,
  PRODUCT: 300,
  CATEGORY: 3600,
} as const;


// HTTP status codes
export const HttpStatus = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Cache TTL (seconds)
export const CacheTTL = {
  PRODUCTS: 300,
  PRODUCT: 300,

  CATEGORIES: 3600,
  CATEGORY: 3600,

  ORDERS: 120,
  ORDER: 120,

  USERS: 600,
  USER: 600,
} as const;


// USERNAME & PASSWORD REGEX

export const USERNAME_REGEX =
  /^(?=.{3,30}$)(?!.*[._]{2})[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/;

export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/;
declare type JWTPayload = {
  exp: number;
  mail: string;
  role: string;
};

declare module 'cookie-cutter'
declare module 'cookie'
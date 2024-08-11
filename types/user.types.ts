export type UserType = {
  id?: string;
  name?: string;
  rating?: number;
  countryCode: string;
};

export type AuthType = {
  id?: string;
  name?: string | undefined;
  email?: string | undefined;
  pwd?: string | undefined;
};

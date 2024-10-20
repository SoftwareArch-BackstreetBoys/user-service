export interface GoogleUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserFromJwt {
  id: string;
  sub: {
    email: string;
    fullName: string;
    picture: string;
  };
  iat: number;
}

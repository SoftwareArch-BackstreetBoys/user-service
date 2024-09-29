import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserFromJwt } from 'src/interfaces/auth.interfaces';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.['jwt'] || null, // extract the cookies from the request
      ]),
      ignoreExpiration: false, // if the cookie is expired, an exception will be thrown
      secretOrKey: process.env.JWT_SECRET, // the JWT Secret that will be used to check the integrity and authenticity of the token
    });
  }

  async validate(payload: UserFromJwt) {
    return payload; // any other validation on the payload if needed
  }
}

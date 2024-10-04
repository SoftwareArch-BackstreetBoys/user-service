import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { Response } from 'express';
import { GoogleUser } from 'src/interfaces/auth.interfaces';
import { User } from 'src/interfaces/user.interfaces';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async signInWithGoogle(
    user: GoogleUser,
    res: Response,
  ): Promise<{
    encodedUser: string;
  }> {
    if (!user) throw new BadRequestException('Unauthenticated');

    const existingUser = await this.usersService.registerGoogleUser(user);

    const encodedUser = await this.encodeUserDataAsJwt(existingUser);

    this.setJwtTokenToCookies(res, existingUser);

    return {
      encodedUser,
    };
  }

  private async encodeUserDataAsJwt(user: User) {
    // even though we did not define a password on our user's schema
    // we extract it from the user in case we will have it on the future
    const userData = { ...user, password: undefined };

    return await this.jwtService.signAsync(userData, { expiresIn: '3d' });
  }

  setJwtTokenToCookies(res: Response, user: User) {
    const expirationDateInMilliseconds =
      new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
    const cookieOptions: CookieOptions = {
      httpOnly: true, // this ensures that the cookie cannot be accessed through JavaScript!
      secure: process.env.NODE_ENV === 'production', // this ensures that the cookie is only sent over HTTPS in production
      expires: new Date(expirationDateInMilliseconds),
    };

    res.cookie(
      'jwt',
      this.jwtService.sign({
        id: user.id,
        sub: {
          email: user.email,
          fullName: user.fullName,
          picture: user.picture,
        },
      }),
      cookieOptions,
    );
  }
}

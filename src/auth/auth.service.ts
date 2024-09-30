import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { CookieOptions } from 'express';
import { Response } from 'express';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { users } from 'src/drizzle/schema';
import { GoogleUser } from 'src/interfaces/auth.interfaces';
import { User } from 'src/interfaces/user.interfaces';
import { DrizzeDB } from 'src/types/drizzle';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(DRIZZLE) private db: DrizzeDB,
  ) {}
  async signInWithGoogle(
    user: GoogleUser,
    res: Response,
  ): Promise<{
    encodedUser: string;
  }> {
    if (!user) throw new BadRequestException('Unauthenticated');
    const studentIdRegex =
      /^\d{2}[013478]\d{5}(?:01|02|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|51|53|55|56|58|63|92|99)+@student\.chula\.ac\.th$/gm;

    if (!studentIdRegex.test(user.email))
      throw new BadRequestException('Not a Chula Student Email');
    let existingUser = await this.findUserByEmail(user.email);

    if (!existingUser) existingUser = await this.registerGoogleUser(res, user);

    const encodedUser = await this.encodeUserDataAsJwt(existingUser);

    this.setJwtTokenToCookies(res, existingUser);

    return {
      encodedUser,
    };
  }
  private async findUserByEmail(email: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) return null;
    return user;
  }
  private async registerGoogleUser(res: Response, user: GoogleUser) {
    try {
      const fullName =
        !user.firstName && !user.lastName
          ? user.email
          : `${user.lastName || ''} ${user.firstName || ''}`.trim();

      const newUser = await this.db
        .insert(users)
        .values({
          email: user.email,
          fullName,
          picture: user.picture,
        })
        .returning();

      return newUser[0];
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  private async encodeUserDataAsJwt(user: User) {
    // even though we did not define a password on our user's schema
    // we extract it from the user in case we will have it on the future
    const userData = { ...user, password: undefined };

    return await this.jwtService.signAsync(userData, { expiresIn: '3d' });
  }

  setJwtTokenToCookies(res: Response, user: User) {
    const expirationDateInMilliseconds =
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
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
        },
      }),
      cookieOptions,
    );
  }
}

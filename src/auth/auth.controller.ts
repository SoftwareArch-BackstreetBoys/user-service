import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './google/google.guard';
import { JwtGuard } from './jwt/jwt.guard';
import { GoogleUser } from 'src/interfaces/auth.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('login')
  async googleAuthRedirect(
    @Req() req: Request,
    @Res() res: Response,
    @Query('state') state: string,
  ) {
    const json: string = Buffer.from(state, 'base64').toString('utf-8');

    // if we had used a cache to store the state, here we can pull the state out from the cache using the key received in the state
    // parse it back into a JSON object
    const { path }: { path: string } = JSON.parse(json) as { path: string };

    const { encodedUser } = await this.authService.signInWithGoogle(
      req.user as GoogleUser,
      res,
    );
    return res.redirect(
      `${process.env.GOOGLE_REDIRECT_URL_CLIENT}?path=${path}&jwtUser=${encodedUser}`,
    );
  }

  @UseGuards(JwtGuard)
  @Get('protected-route')
  async protectedAuthRoute() {
    return 'I am protected';
  }

  @UseGuards(JwtGuard)
  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.redirect(process.env.GOOGLE_REDIRECT_URL_CLIENT);
  }
}

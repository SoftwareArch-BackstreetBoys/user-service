import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './google/google.guard';
import { JwtGuard } from './jwt/jwt.guard';
import { GoogleUser } from 'src/interfaces/auth.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  async googleAuth(@Req() req) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google-auth-redirect')
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { encodedUser } = await this.authService.signInWithGoogle(
      req.user as GoogleUser,
      res,
    );
    return res.redirect(
      `${process.env.GOOGLE_REDIRECT_URL_CLIENT}?jwtUser=${encodedUser}`,
    );
  }
  @UseGuards(JwtGuard)
  @Get('protected-route')
  async protectedAuthRoute() {
    return 'I am protected';
  }
}

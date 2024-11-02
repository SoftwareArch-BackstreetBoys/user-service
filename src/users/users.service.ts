import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import * as moment from 'moment';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { users } from 'src/drizzle/schema';
import { GoogleUser } from 'src/interfaces/auth.interfaces';
import { DrizzeDB } from 'src/types/drizzle';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: DrizzeDB) {}

  // Not in use
  private readonly studentIdRegex =
    /^\d{2}[013478]\d{5}(?:01|02|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|51|53|55|56|58|63|92|99)+@student\.chula\.ac\.th$/gm;

  async findUserByEmail(email: string) {
    if (!this.studentIdRegex.test(email))
      throw new BadRequestException('Not a Chula Student Email');

    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user ? user : null;
  }

  async findUserById(id: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return user ? user : null;
  }

  async registerGoogleUser(user: GoogleUser) {
    try {
      if (!user.email.endsWith('@student.chula.ac.th'))
        throw new BadRequestException('Not a Chula Student Email');
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const date = moment().add(7, 'hours').toDate();
      const newUser = await this.db
        .insert(users)
        .values({
          id: user.id,
          email: user.email,
          fullName,
          picture: user.picture,
        })
        .onConflictDoUpdate({
          target: [users.id],
          // @ts-expect-error: Unreachable code error
          set: { lastLogin: date },
        })
        .returning();

      return newUser[0];
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}

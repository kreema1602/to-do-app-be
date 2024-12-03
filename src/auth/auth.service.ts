import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.userService.hasAccount(username);
    if (user.length <= 0) {
      return {
        status: 404,
        message: 'Account not found',
      };
    }
    if (user[0].password !== password) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.getTokens(user[0].id, user[0].username);

    return tokens;
  }

  async getTokens(user_id: string, username: string) {
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user_id,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1m',
        },
      ),
    ]);

    return {
      accessToken,
    };
  }

  getTokenRemainingTime(token: string): number | null {
    try {
      const decodedToken: any = this.jwtService.decode(token);
      if (decodedToken?.exp) {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const remainingTime = decodedToken.exp - currentTime; // Remaining time in seconds
        return remainingTime > 0 ? remainingTime : 0; // Return 0 if token has already expired
      }
      return null; // If no `exp` claim is found
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
}

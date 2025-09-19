import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@/core/config/config.service';
import { IJwtPayload, IUserPayload } from '@/shared/interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: IJwtPayload): Promise<IUserPayload> {
    // NOW WE CHECK THE DATABASE!
    const user = await this.authService.validateUser(payload);
    return { id: user.id, email: user.email };
  }
}

import { Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import type { IGetTempTokenVo, IUserMeVo } from '@teable/openapi';
import { Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { AUTH_SESSION_COOKIE_NAME } from '../../const';
import { EmitControllerEvent } from '../../event-emitter/decorators/emit-controller-event.decorator';
import { Events } from '../../event-emitter/events';
import type { IClsStore } from '../../types/cls';
import { AuthService } from './auth.service';
import { TokenAccess } from './decorators/token.decorator';
import { SessionService } from './session/session.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly cls: ClsService<IClsStore>
  ) {}

  @Post('signout')
  @HttpCode(200)
  @EmitControllerEvent(Events.USER_SIGNOUT)
  async signout(@Req() req: Express.Request, @Res({ passthrough: true }) res: Response) {
    await this.sessionService.signout(req);
    res.clearCookie(AUTH_SESSION_COOKIE_NAME);
  }

  @Get('/user/me')
  async me(@Req() request: Express.Request) {
    return {
      ...request.user,
      organization: this.cls.get('organization'),
    };
  }

  @Get('/user')
  @TokenAccess()
  async user(@Req() request: Express.Request) {
    return this.authService.getUserInfo(request.user as IUserMeVo);
  }

  @Get('temp-token')
  async tempToken(): Promise<IGetTempTokenVo> {
    return this.authService.getTempToken();
  }
}

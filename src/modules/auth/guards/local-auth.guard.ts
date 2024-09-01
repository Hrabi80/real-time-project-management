import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// this class to define the authentication strategy
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}


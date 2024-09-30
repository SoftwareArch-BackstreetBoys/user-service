import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    // get the path out of the query parameters
    const { path } = context.switchToHttp().getRequest().query;

    // create a JSON object with all of the state that needs to be persisted during the OAuth flow
    const json: string = JSON.stringify({ path });

    // stringify the state, and base64-encode it
    // alternatively, this state object can be persisted to a cache, and the cache key sent as the state
    const state: string = Buffer.from(json, 'utf-8').toString('base64');

    // set the state; this will be returned back in the callback from the OAuth provider
    return {
      state,
    };
  }
}

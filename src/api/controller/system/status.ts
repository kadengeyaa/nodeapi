import { controller, httpGet, BaseHttpController, httpHead } from 'inversify-express-utils';

@controller('/v1/status')
export class StatusController extends BaseHttpController {
  @httpGet('/')
  async get(): Promise<void> {
    this.httpContext.response.status(200).end();
  }
  @httpHead('/')
  async head(): Promise<void> {
    this.httpContext.response.status(200).end();
  }
}

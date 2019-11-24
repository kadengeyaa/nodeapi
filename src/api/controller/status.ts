import { controller, httpGet, BaseHttpController, httpHead } from 'inversify-express-utils';

@controller('/status')
export class StatusController extends BaseHttpController {
  @httpGet('/')
  get(): void {
    this.httpContext.response.status(200).end();
  }
  @httpHead('/')
  head(): void {
    this.httpContext.response.status(200).end();
  }
}

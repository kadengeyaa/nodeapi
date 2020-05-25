import { injectable } from 'inversify';
import AfricasTalking from 'africastalking';
import { AFRICASTALKING_API_KEY, AFRICASTALKING_USERNAME, AFRICASTALKING_FROM } from '../../config/africastalking';

const sms = AfricasTalking({
  apiKey: AFRICASTALKING_API_KEY,
  username: AFRICASTALKING_USERNAME,
}).SMS;

@injectable()
export class SmsService {
  async send(params: { to: string | string[]; message: string; enqueue?: boolean }): Promise<void> {
    await sms.send({ ...params, ...{ from: AFRICASTALKING_FROM } });
  }
}

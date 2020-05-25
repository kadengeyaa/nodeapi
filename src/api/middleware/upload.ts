import { Response, Request, RequestHandler, NextFunction } from 'express';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import * as multer from 'multer';
import { extname } from 'path';
import { sync } from 'mkdirp';

@injectable()
export class UploadMiddleware extends BaseMiddleware {
  async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { file } = req;

      if (!file) throw new Error('Failed to upload file');

      next();
    } catch (error) {
      next(error);
    }
  }
}

export function upload(filePath: string, fields?: multer.Field[]): RequestHandler {
  const uploader = multer.default({
    dest: filePath,
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        sync(filePath);
        callback(null, filePath);
      },
      filename: (req, file, callback) => {
        callback(null, Date.now() + extname(file.originalname));
      },
    }),
  });

  if (fields) return uploader.fields(fields);

  return uploader.single('file');
}

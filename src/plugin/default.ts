import searchPlugin from 'mongoosastic';
import idValidator from 'mongoose-id-validator';
import { pagePlugin } from './page';
import { Document, Schema, Model } from 'mongoose';
import { logger } from '../loader/logger';
import { SearchableModel } from './types';
import { historyPlugin } from './history';

async function look(q): Promise<Document[]> {
  const model = this as SearchableModel<Document>;

  return new Promise((resolve, reject) => {
    model.search(
      {
        query_string: {
          query: q,
          analyzer: 'autocomplete',
        },
      },
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results.hits.hits);
      },
    );
  });
}

function toJson(): any {
  const object = (this as Document).toObject();

  return object;
}

function plugin(schema: Schema, options: { searchable?: boolean } = {}): void {
  schema.plugin(historyPlugin);
  schema.plugin(idValidator);
  schema.plugin(pagePlugin);

  const { searchable } = options;

  if (searchable) {
    schema.plugin(searchPlugin, { hydrate: true });
    schema.statics.look = look;
  }

  schema.methods.toJSON = toJson;

  // Index all text fields to allow easy search
  schema.index({ '$**': 'text' });
}

export function initSearch(
  model: Model<Document> & {
    createMapping(filter: any, callback: any): void;
    bulkError(): any;
    synchronize(): any;
  },
): void {
  model.bulkError().on('error', (error, res) => {
    logger.error('ELASTIC_ERROR %o', error);
    logger.info('ELASTIC_RES %o', res);
  });

  model.createMapping(
    {
      analysis: {
        filter: {
          autocomplete: {
            type: 'edge_ngram',
            min_gram: 2,
            max_gram: 10,
          },
        },
        analyzer: {
          autocomplete: {
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase', 'autocomplete'],
          },
        },
      },
    },
    (error, mapping) => {
      const title = model.collection.collectionName.toUpperCase();

      if (error) {
        logger.error(`ELASTIC_SEARCH_${title}_SYNC_MAPPING_ERROR %o`, error);
        logger.info(`ELASTIC_SEARCH_${title}_SYNC_MAPPING %o`, mapping);
      }

      const stream = model.synchronize();

      let count = 0;

      stream.on('data', (err, doc) => {
        count += 1;

        if (err) {
          logger.error(`ELASTIC_SEARCH_${title}_SYNC_DATA_ERROR %o`, err);
          logger.info(`ELASTIC_SEARCH_${title}_SYNC_DATA_DOC %o`, doc);
        }
      });

      stream.on('close', () => {
        logger.info(`ELASTIC_SEARCH_${title}_SYNC_CLOSE_COUNT %o`, count);
      });

      stream.on('error', (e) => {
        if (e) logger.error(`ELASTIC_SEARCH_${title}_SYNC_ERROR_COUNT %o`, error);
      });
    },
  );
}

export const defaultPlugin = plugin;

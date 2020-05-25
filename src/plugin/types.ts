import { Model, Document } from 'mongoose';

export interface PageResult<T> {
  docs: T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
  sort: string;
}

export interface Populate {
  path: string;
  select?: string;
  populate?: Populate[];
}

export interface PageOptions {
  sort?: string;
  select?: string;
  limit?: number;
  page?: number;
  populate?: Populate[];
}

export interface PagedModel<T extends Document> extends Model<T> {
  page(query: any, options: PageOptions): Promise<PageResult<T>>;
}

export interface SearchableModel<T extends Document> extends Model<T> {
  look(q: string): Promise<T[]>;
  search(q: any, callback: any): Promise<T[]>;
}

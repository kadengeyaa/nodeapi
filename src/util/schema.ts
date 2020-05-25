import { Schema } from 'mongoose';

export const pointSchema = new Schema(
  {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
      validate: {
        validator: function (array: number[]): boolean {
          return array && array.length === 2;
        },
        message: '{VALUE} must contain only 2 values',
        isAsync: false,
      },
    },
    accuracy: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { _id: false, timestamps: false },
);

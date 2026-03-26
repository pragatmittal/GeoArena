import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  name: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answer: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  region: string;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    name: { type: String, required: true },
    hint: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    answer: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    region: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

QuestionSchema.index({ answer: '2dsphere' });

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

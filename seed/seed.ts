import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGO_URI = 'mongodb://localhost:27017/geoquiz';

const questionSchema = new mongoose.Schema({
  name: String,
  hint: String,
  difficulty: String,
  region: String,
  answer: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  }
});

const Question = mongoose.model('Question', questionSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf-8'));
    
    await Question.deleteMany({});
    await Question.insertMany(data);
    
    console.log(`Successfully seeded ${data.length} questions.`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
}

seed();

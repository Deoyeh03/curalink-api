require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// models
const User = require('../models/User');
const ClinicalTrial = require('../models/ClinicalTrials');
const Publication = require('../models/Publication');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/curalink';

const seedUsers = async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = [
    {
      name: 'Alice Patient',
      email: 'alice@curalink.com',
      password: passwordHash,
      role: 'PATIENT',
      interests: ['cancer', 'immunotherapy'],
      onboarded: true,
    },
    {
      name: 'Dr. Bob Researcher',
      email: 'bob@curalink.com',
      password: passwordHash,
      role: 'RESEARCHER',
      interests: ['genetics', 'oncology'],
      onboarded: true,
    },
  ];
  await User.insertMany(users);
  console.log(`👤 Seeded ${users.length} users`);
};

const seedTrials = async () => {
  const trials = [
    {
      title: 'Cancer Immunotherapy Phase II',
      summary: 'A phase II clinical trial testing new immunotherapy drugs.',
      condition: 'Cancer',
      status: 'Recruiting',
      location: 'New York',
      source: 'clinicaltrials.gov',
    },
    {
      title: 'Genetic Screening in Rare Diseases',
      summary: 'Study on the role of genes in rare metabolic disorders.',
      condition: 'Metabolic Disorder',
      status: 'Active',
      location: 'London',
      source: 'clinicaltrials.gov',
    },
  ];
  await ClinicalTrial.insertMany(trials);
  console.log(`🧪 Seeded ${trials.length} trials`);
};

const seedPublications = async () => {
  const pubs = [
    {
      title: 'Advances in Immunotherapy Research',
      abstract: 'Recent developments in checkpoint inhibitors.',
      authors: ['Bob Researcher'],
      journal: 'Medical Journal',
      year: 2024,
      doi: '10.1000/immuno.2024.01',
    },
    {
      title: 'Genetic Mapping of Rare Diseases',
      abstract: 'Genome-wide study of rare inherited disorders.',
      authors: ['Dr. A. Scientist'],
      journal: 'Nature Genetics',
      year: 2023,
      doi: '10.1000/genetics.2023.77',
    },
  ];
  await Publication.insertMany(pubs);
  console.log(`📚 Seeded ${pubs.length} publications`);
};

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // clean db first
    await User.deleteMany();
    await ClinicalTrial.deleteMany();
    await Publication.deleteMany();

    await seedUsers();
    await seedTrials();
    await seedPublications();

    console.log('🌱 Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();

import mongoose from 'mongoose';

const clinicalTrialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: String,
    condition: String,
    status: String,
    startDate: Date,
    endDate: Date,
    location: String,
    investigator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    source: { type: String, default: 'clinicaltrials.gov' },
  },
  { timestamps: true }
);

clinicalTrialSchema.index({ title: 'text', summary: 'text', condition: 'text' });

export default mongoose.model('ClinicalTrial', clinicalTrialSchema);

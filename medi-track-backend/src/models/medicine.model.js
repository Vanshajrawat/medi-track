import mongoose, { Schema } from 'mongoose';

const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide medicine name'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide medicine quantity'],
      min: 0,
    },
    camp: {
      type: Schema.Types.ObjectId,
      ref: 'Camp',
      required: true,
    },
    dispensedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
      },
    ],
  },
  { timestamps: true }
);

const Medicine = mongoose.model('Medicine', medicineSchema);

export { Medicine };

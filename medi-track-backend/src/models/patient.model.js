import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginateV2 from 'mongoose-aggregate-paginate-v2';

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide patient name'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Please provide patient age'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    contact: {
      type: String,
      default: '',
    },
    camp: {
      type: Schema.Types.ObjectId,
      ref: 'Camp',
      required: true,
    },
    assignedDoctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    vitals: {
      bloodPressure: {
        type: String,
        default: '',
      },
      weight: {
        type: String,
        default: '',
      },
      temperature: {
        type: String,
        default: '',
      },
    },
    complaint: {
      type: String,
      default: '',
    },
    prescription: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Add pagination plugin
patientSchema.plugin(mongooseAggregatePaginateV2);

const Patient = mongoose.model('Patient', patientSchema);

export { Patient };

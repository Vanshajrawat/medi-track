import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginateV2 from 'mongoose-aggregate-paginate-v2';

const campSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a camp title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide camp date'],
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

// Add pagination plugin
campSchema.plugin(mongooseAggregatePaginateV2);

const Camp = mongoose.model('Camp', campSchema);

export { Camp };

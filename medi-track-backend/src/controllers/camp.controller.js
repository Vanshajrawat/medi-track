import { Camp } from '../models/camp.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createCamp = asyncHandler(async (req, res) => {
  const { title, description, location, date } = req.body;

  if (!title || !location || !date) {
    throw new ApiError(400, 'Title, location, and date are required');
  }

  const camp = await Camp.create({
    title,
    description: description || '',
    location,
    date,
    organizer: req.user._id,
  });

  const populatedCamp = await camp.populate('organizer', 'name email');

  return res
    .status(201)
    .json(new ApiResponse(201, populatedCamp, 'Camp created successfully'));
});

const getCamps = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const camps = await Camp.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'organizer',
        foreignField: '_id',
        as: 'organizer',
      },
    },
    {
      $unwind: '$organizer',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'doctors',
        foreignField: '_id',
        as: 'doctors',
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const result = await Camp.aggregatePaginate(
    Camp.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'organizer',
          foreignField: '_id',
          as: 'organizer',
        },
      },
      {
        $unwind: '$organizer',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'doctors',
          foreignField: '_id',
          as: 'doctors',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]),
    options
  );

  return res.status(200).json(
    new ApiResponse(200, result, 'Camps fetched successfully')
  );
});

const getCampById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const camp = await Camp.findById(id)
    .populate('organizer', 'name email')
    .populate('doctors', 'name email');

  if (!camp) {
    throw new ApiError(404, 'Camp not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, camp, 'Camp fetched successfully'));
});

const joincamp = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const camp = await Camp.findById(id);
  if (!camp) {
    throw new ApiError(404, 'Camp not found');
  }

  // Check if doctor is already in the camp
  if (camp.doctors.includes(req.user._id)) {
    throw new ApiError(400, 'You are already part of this camp');
  }

  // Add doctor to camp
  camp.doctors.push(req.user._id);
  await camp.save();

  const updatedCamp = await camp.populate('organizer', 'name email').populate('doctors', 'name email');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCamp, 'Joined camp successfully'));
});

const updateCampStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['upcoming', 'active', 'completed'].includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const camp = await Camp.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
    .populate('organizer', 'name email')
    .populate('doctors', 'name email');

  if (!camp) {
    throw new ApiError(404, 'Camp not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, camp, 'Camp status updated successfully'));
});

export { createCamp, getCamps, getCampById, joincamp, updateCampStatus };

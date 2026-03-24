import { Patient } from '../models/patient.model.js';
import { Camp } from '../models/camp.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const registerPatient = asyncHandler(async (req, res) => {
  const { name, age, gender, contact, camp, complaint, vitals } = req.body;

  if (!name || !age || !gender || !camp) {
    throw new ApiError(400, 'Name, age, gender, and camp are required');
  }

  // Check if camp exists
  const campExists = await Camp.findById(camp);
  if (!campExists) {
    throw new ApiError(404, 'Camp not found');
  }

  const patient = await Patient.create({
    name,
    age,
    gender,
    contact: contact || '',
    camp,
    complaint: complaint || '',
    vitals: vitals || {},
    assignedDoctor: req.user.role === 'doctor' ? req.user._id : null,
  });

  const populatedPatient = await patient
    .populate('camp', 'title location date')
    .populate('assignedDoctor', 'name email');

  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedPatient, 'Patient registered successfully')
    );
});

const getPatientsByCamp = asyncHandler(async (req, res) => {
  const { campId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check if camp exists
  const campExists = await Camp.findById(campId);
  if (!campExists) {
    throw new ApiError(404, 'Camp not found');
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const result = await Patient.aggregatePaginate(
    Patient.aggregate([
      {
        $match: { camp: require('mongoose').Types.ObjectId(campId) },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedDoctor',
          foreignField: '_id',
          as: 'assignedDoctor',
        },
      },
      {
        $unwind: {
          path: '$assignedDoctor',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'camps',
          localField: 'camp',
          foreignField: '_id',
          as: 'camp',
        },
      },
      {
        $unwind: '$camp',
      },
      {
        $sort: { createdAt: -1 },
      },
    ]),
    options
  );

  return res.status(200).json(
    new ApiResponse(200, result, 'Patients fetched successfully')
  );
});

const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { vitals, prescription, assignedDoctor } = req.body;

  const patient = await Patient.findById(id);
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  if (vitals) {
    patient.vitals = { ...patient.vitals, ...vitals };
  }

  if (prescription) {
    patient.prescription = prescription;
  }

  if (assignedDoctor) {
    patient.assignedDoctor = assignedDoctor;
  }

  await patient.save();

  const updatedPatient = await patient
    .populate('camp', 'title location date')
    .populate('assignedDoctor', 'name email');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPatient, 'Patient updated successfully'));
});

export { registerPatient, getPatientsByCamp, updatePatient };

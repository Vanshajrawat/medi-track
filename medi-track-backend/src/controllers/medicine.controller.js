import { Medicine } from '../models/medicine.model.js';
import { Camp } from '../models/camp.model.js';
import { Patient } from '../models/patient.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const addMedicine = asyncHandler(async (req, res) => {
  const { name, quantity, camp } = req.body;

  if (!name || !quantity || !camp) {
    throw new ApiError(400, 'Name, quantity, and camp are required');
  }

  // Check if camp exists
  const campExists = await Camp.findById(camp);
  if (!campExists) {
    throw new ApiError(404, 'Camp not found');
  }

  const medicine = await Medicine.create({
    name,
    quantity,
    camp,
  });

  const populatedMedicine = await medicine.populate('camp', 'title location');

  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedMedicine, 'Medicine added successfully')
    );
});

const dispenseMedicine = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { patientId } = req.body;

  if (!patientId) {
    throw new ApiError(400, 'Patient ID is required');
  }

  const medicine = await Medicine.findById(id);
  if (!medicine) {
    throw new ApiError(404, 'Medicine not found');
  }

  // Check if patient exists
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  // Check if already dispensed to this patient
  if (medicine.dispensedTo.includes(patientId)) {
    throw new ApiError(400, 'Medicine already dispensed to this patient');
  }

  // Check if quantity available
  if (medicine.dispensedTo.length >= medicine.quantity) {
    throw new ApiError(400, 'Insufficient medicine quantity');
  }

  medicine.dispensedTo.push(patientId);
  await medicine.save();

  return res
    .status(200)
    .json(new ApiResponse(200, medicine, 'Medicine dispensed successfully'));
});

const getMedicinesBycamp = asyncHandler(async (req, res) => {
  const { campId } = req.params;

  // Check if camp exists
  const campExists = await Camp.findById(campId);
  if (!campExists) {
    throw new ApiError(404, 'Camp not found');
  }

  const medicines = await Medicine.find({ camp: campId }).populate(
    'camp',
    'title location'
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, medicines, 'Medicines fetched successfully')
    );
});

export { addMedicine, dispenseMedicine, getMedicinesBycamp };

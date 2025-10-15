// backend/validators/signup.validators.js
import Joi from "joi";

const base = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).required(),
  phone: Joi.string().min(7).required(),
  // role is optional on client: backend will default to buyer when missing
  role: Joi.string().valid("buyer", "vendor", "farmer", "rider").optional(),
});

export const buyerSchema = base.keys({
  /* no extra */
});

export const vendorSchema = base.keys({
  businessName: Joi.string().min(2).required(),
  ownerName: Joi.string().min(2).required(),
  location: Joi.string().required(),
});

export const farmerSchema = base.keys({
  farmName: Joi.string().min(2).required(),
  contactPerson: Joi.string().min(2).required(),
  location: Joi.string().required(),
  produceTypes: Joi.array().items(Joi.string()).optional(),
});

export const riderSchema = base.keys({
  idNumber: Joi.string().required(),
  vehicleType: Joi.string()
    .valid("motorbike", "bicycle", "truck", "van", "other")
    .required(),
  vehicleName: Joi.string().optional(),
});

export const schemasByRole = {
  buyer: buyerSchema,
  vendor: vendorSchema,
  farmer: farmerSchema,
  rider: riderSchema,
};

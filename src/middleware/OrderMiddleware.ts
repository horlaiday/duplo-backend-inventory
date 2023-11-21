import { NextFunction, Request, Response } from "express";
import Joi from "joi";


export async function validateOrderRequest(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	//get refresh token from request body
	const { businessId, amount, status } = req.body;

	//define validation schema
	const schema = Joi.object({
		businessId: Joi.string().required().label("Business ID"),
		amount: Joi.number().positive().required().label("Amount"),
		status: Joi.string().required().label("Status"),
	});

	//validate request
	const { error } = schema.validate({ businessId, amount, status });

	//throw error if request is invalid
if (error) {
	error.message = error.message.replace(/\"/g, "");
	next(error);
	return;
	}

	next();
}
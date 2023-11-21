import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export async function validateBusinessRequest(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	//get refresh token from request body
	const { name, email, website } = req.body;

	//define validation schema
	const schema = Joi.object({
		name: Joi.string().required().label("Name"),
		email: Joi.number().positive().required().label("Email"),
		website: Joi.string().required().label("Website"),
	});

	//validate request
	const { error } = schema.validate({ name, email, website });

	//throw error if request is invalid
	if (error) {
		error.message = error.message.replace(/\"/g, "");
		next(error);
		return;
	}

	next();
}

import { NextFunction, Request, Response } from "express";
import { businessRepository, orderRepository } from "../util/repository";

export async function getBusinesses(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {

		// get all business with associated orders
		const business = await businessRepository.find();
		console.log("===business===", business);

		// map over business and get orders for each business
		const businessWithOrders = await Promise.all(
			business.map(async (business) => {
				const orders = await orderRepository.find({
					businessId: business._id,
				});
				return { ...business.toObject(), orders };
			}),
		);
		console.log("===businessWithOrders===", businessWithOrders);
		res.status(200).json({ status: "SUCCESS", data: businessWithOrders });

		// res.status(200).json({ status: "SUCCESS", data: business });
	} catch (error) {
		next(error);
	}
}

export async function createBusiness(req: Request, res: Response, next: NextFunction) {
	try {
		const { name, email, website } = req.body;
		const business = await businessRepository.create({ name, email, website });
		business.save();
		console.log("===business===", business);
		
		res.status(200).json({ status: "SUCCESS", data: business });
	} catch (error) {
		next(error);
	}
}
import { NextFunction, Request, Response } from "express";
import { businessRepository, orderRepository } from "../util/repository";
import axios from "axios";
import mongoose from "mongoose";


export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { businessId, amount, status } = req.body;
		const order = await orderRepository.create({
			businessId,
			amount,
			status,
		});

		// Make a POST request to the government tax API
		const logTx = await logTax(order);

		console.log("==logTx==", logTx);
		

		res.status(200).json({ message: "Order submitted successfully." });

	} catch (error) {
		next(error);
	}
}

export const getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { businessId } = req.params;
		// Check if business exists
		const business = await businessRepository.findById(businessId);
		if (!business) {
			return res.status(400).json({ message: "Business not found." });
		}
		// get orders that belong to the business
		// const orders = await orderRepository.find({ businessId });
		const orders = await getOrderStatistics(businessId);

		console.log("==orders==", orders);
		
		

		res.status(200).json({ 
			status: "SUCCESS",
			message: "Order details retrieved successfully.",
			data: orders
		});
		
	} catch (error) {
		next(error);
	}
}


export const getCreditScore = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
	const { businessId } = req.params;

	// Calculate credit score
	const creditScore = await calculateCreditScore(businessId);

	console.log("==creditScore==", creditScore);
	
		res.status(200).json({
			status: "SUCCESS",
			message: "Successful.",
			creditScore: creditScore.creditScore,
		});
	} catch (error) {
		next(error);
	}
};









async function calculateCreditScore(businessId: string) {
	const totalOrderAmount = await orderRepository.aggregate([
		{ $match: { businessId: new mongoose.Types.ObjectId(businessId) } },
		{
			$group: {
				_id: null,
				totalAmount: { $sum: "$amount" },
				count: { $sum: 1 },
			},
		},
	]);

	const { totalAmount, count } = totalOrderAmount[0] || {
		totalAmount: 0,
		count: 0,
	};

	// Calculate credit score
	const creditScore = totalAmount / (count * 100) || 0;

	return { creditScore };
}

async function getOrderStatistics(businessId: string) {
	const totalOrders = await orderRepository.countDocuments({ businessId });
	const totalAmount = await orderRepository.aggregate([
		{ $match: { businessId: new mongoose.Types.ObjectId(businessId) } },
		{
			$group: {
				_id: "$businessId",
				total: { $sum: { $toInt: "$amount" } },
			},
		},
	]);

	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);
	const todayEnd = new Date();
	todayEnd.setHours(23, 59, 59, 999);

	const totalOrdersToday = await orderRepository.countDocuments({
		businessId,
		date: { $gte: todayStart, $lte: todayEnd },
	});

	const totalAmountToday = await orderRepository.aggregate([
		{ $match: { businessId, date: { $gte: todayStart, $lte: todayEnd } } },
		{
			$group: {
				_id: "$businessId",
				total: { $sum: { $toInt: "$amount" } },
			},
		},
	]);

	return {
		totalOrders,
		totalAmount: totalAmount[0]?.total || 0,
		totalOrdersToday,
		totalAmountToday: totalAmountToday[0]?.total || 0,
	}
}


async function logTax(order: any) {
	const apiUrl = "https://taxes.free.beeceptor.com/log-tax";
	const requestBody = {
		order_id: order._id.toString(),
		platform_code: "022",
		order_amount: order.amount,
	};

	try {
		const response = await axios.post(apiUrl, requestBody);
		console.log("==response==", response.data);
		
	} catch (error) {
		console.error("Error logging tax:", error);
	}
}

import { Schema, Document, model } from "mongoose";
import { IBusiness, IOrder } from "../util/typings";

export interface IOrderModel extends IOrder, Document {}

const order = {
	amount: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		required: true,
		enum: ["pending", "completed"],
	},
	businessId: {
		type: Schema.Types.ObjectId,
		ref: "business",
		required: true,
	},
	
};


const orderSchema = new Schema(order, {
	versionKey: false,
});
export { orderSchema };

import { Schema, Document, model } from "mongoose";
import { IBusiness } from "../util/typings";


export interface IBusinessModel extends IBusiness, Document {}

const business = {
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	website: {
		type: String,
		required: true,
	},
	created_date: {
		type: Date,
		default: Date.now,
	},
};

const businessSchema = new Schema(business, {
	versionKey: false,
});
export { businessSchema };

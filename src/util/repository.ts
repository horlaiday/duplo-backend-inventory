import { model } from "mongoose";
import { IBusinessModel, businessSchema } from "../models/Business";
import { IOrderModel, orderSchema } from "../models/Order";


const businessRepository = model<IBusinessModel>(
	"business",
	businessSchema,
);
const orderRepository = model<IOrderModel>(
	"order",
	orderSchema,
);


export { businessRepository, orderRepository };
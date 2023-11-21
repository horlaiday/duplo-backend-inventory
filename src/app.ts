import * as dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction, Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import config from "./config/config";
import { BusinessRoutes, OrderRoutes } from "./routes";

const app: Express = express();

// connect to the database
(async function () {
	const port = process.env.PORT || 5050;
	const hostname = "0.0.0.0";
	//connect to mongodb
	mongoose
		.connect(`${config.databaseUrl}`)
		.then(() => {
			app.listen(Number(port), hostname, () => {
				console.log(`Server listening at port ${port}`);
				startServer();
			});
		})
		.catch((err) => {
			console.log("Unable to connect to mongodb");
		});
})();

function startServer() {
	app.use(
		cors({
			origin: "*",
			methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
		}),
	);

	//parse incoming requests
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	// routes 
	app.use("/business", BusinessRoutes);
	app.use("/order", OrderRoutes);

	//health check
	app.get("/ping", async (req, res, next) => {
		res.status(200).send({ message: "pong" });
	});

	//handle errors
	app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
		const status = "ERROR";
		let error = err.name;
		let error_message = err.message;
		let statusCode;

		if (err.name === "ValidationError") statusCode = 400;
		else if (err.name === "Unauthorized") statusCode = 401;
		else if (err.name === "Forbidden") statusCode = 403;
		else if (err.name === "NotFound") statusCode = 404;
		else {
			statusCode = 500;
			error = "InternalServerError";
			error_message =
				"Something went wrong. Please try again after a while.";
			console.log(
				"Error name: ",
				err.name,
				"Error message: ",
				err.message,
			);
		}

		res.status(statusCode).json({ status, error, error_message });
	});
}

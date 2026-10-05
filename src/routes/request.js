import express from "express";

const requestRoute = express.Router();

requestRoute.post("/request/send/interest/:userId", (req, res) => {});
requestRoute.post("/request/send/ignore/:userId", (req, res) => {});
requestRoute.post("/request/review/accepted/:requestId", (req, res) => {});
requestRoute.post("/request/review/rejected/:requestId", (req, res) => {});

export default requestRoute;

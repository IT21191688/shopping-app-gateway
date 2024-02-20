"use strict";
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
// Proxy options for each route
const proxyOptionsCustomer = {
    target: "http://localhost:8001",
    changeOrigin: true,
};
const proxyOptionsProduct = {
    target: "http://localhost:8002",
    changeOrigin: true,
};
const proxyOptionsShopping = {
    target: "http://localhost:8003",
    changeOrigin: true,
};
// Proxy routes
app.use("/customer", createProxyMiddleware(proxyOptionsCustomer));
app.use("/product", createProxyMiddleware(proxyOptionsProduct));
app.use("/shopping", createProxyMiddleware(proxyOptionsShopping));
app.listen(8005, () => {
    console.log("Gateway Microservice Listening to Port 8005");
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 8005;
app.use((0, cors_1.default)({
    origin: "http://localhost:8005",
    methods: ["POST", "GET", "PATCH", "DELETE"],
    optionsSuccessStatus: 200,
}));
// Body parsing middleware
app.use(express_1.default.json());
// Proxy options for each microservice
const proxyOptions = {
    "/customer": {
        target: "http://localhost:8001",
        changeOrigin: true,
    },
    "/product": {
        target: "http://localhost:8002",
        changeOrigin: true,
    },
    "/shopping": {
        target: "http://localhost:8003",
        changeOrigin: true,
    },
};
// Create proxy middleware for each microservice
const createProxyMiddlewareForService = (servicePath, options) => {
    return (0, http_proxy_middleware_1.createProxyMiddleware)(servicePath, options);
};
// Use proxy middleware for each microservice
for (const [path, options] of Object.entries(proxyOptions)) {
    app.use(path, createProxyMiddlewareForService(path, options));
}
// Error handling middleware for 404 Not Found
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});
// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({ message: "Internal Server Error" });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Gateway Microservice Listening on Port ${PORT}`);
});

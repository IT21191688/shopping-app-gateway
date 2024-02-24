import express, { Express, Request, Response, NextFunction } from "express";
import {
  createProxyMiddleware,
  Options,
  RequestHandler,
} from "http-proxy-middleware";
import cors from "cors";

const app: Express = express();
const PORT: number = 8005;

app.use(
  cors({
    origin: "http://localhost:8005",
    methods: ["POST", "GET", "PATCH", "DELETE"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

const proxyOptions: Record<string, Options> = {
  "/customer": {
    target: "http://localhost:8001",
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
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
const createProxyMiddlewareForService = (
  servicePath: string,
  options: Options
): RequestHandler => {
  return createProxyMiddleware(servicePath, options);
};

// Use proxy middleware for each microservice
for (const [path, options] of Object.entries(proxyOptions)) {
  app.use(path, createProxyMiddlewareForService(path, options));
}

// Error handling middleware for 404 Not Found
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Gateway Microservice Listening on Port ${PORT}`);
});

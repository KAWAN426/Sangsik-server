import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const whitelist = [
  "http://localhost:3000",
  ...(process.env.ALLOW_DOMAIN?.split(", ") || []),
];
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default cors(corsOptions);

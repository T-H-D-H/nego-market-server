import * as express from "express";
import { userRouter } from "./routes/user.routes";
import { addressRouter } from "./routes/address.routes";
import { errorHandler } from "./middlewares/error-handler";
import { swaggerDocs } from "./utils/swagger";
import * as cors from "cors";

const app: express.Express = express();

//cors 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

swaggerDocs(app);

app.get("/", async (req, res) => {
  res.send("hello world");
});

app.use("/api", userRouter);
app.use("/api", addressRouter);

app.use(errorHandler);

export { app };

import * as express from "express";
import { userRouter } from "./routers/user.routes";
import { addressRouter } from "./routers/address.routes";
import { errorHandler } from "./middlewares/error-handler";

const app: express.Express = express();

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.send("hello world");
});

app.use("/api", userRouter);
app.use("/api", addressRouter);

app.use(errorHandler);

export { app };

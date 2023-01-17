import "dotenv/config";
import { app } from "./src/app.js";

const port: number = Number(process.env.PORT);

app.listen(port, () => {
  console.log(`정상적으로 서버를 시작하였습니다. http://localhost:${port}`);
});

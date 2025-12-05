import app from "./app";
import config from "./config";
import { Logger } from "./utils/logger";

export const logger = new Logger();

logger.on("message", (msg: string) => console.log(msg));

app.listen(config.PORT, () => {
  logger.log(`Server is running on port: ${config.PORT}`);
});

import app from "./app";
import "dotenv/config";

app.listen(process.env.PORT ?? 9000);
console.log(`🚀 Running Server at PORT ${process.env.PORT}`);

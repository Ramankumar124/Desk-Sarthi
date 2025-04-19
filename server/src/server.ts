import app from "./app";
import { DBConnection } from "./database/index";

DBConnection()
  .then(() => {
    console.log("Database connection successfull");
    
  })
  .catch((err: string) => {
    console.log("database connection failed");
  });
app.listen(process.env.PORT, () => {
  console.info(`your server is running on Port no ${process.env.PORT}`);
});

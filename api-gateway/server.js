require("dotenv").config();
require("./src/app").listen(process.env.PORT, () => {
  console.log(`Gateway runnning on port ${process.env.PORT}`);
});

require("dotenv").config();
const DBconnection = require("./src/config/db_con");
const userRoute = require("./src/routes/userRoutes");
const profileRoute = require("./src/routes/profileRoutes");
const destinationRoute = require("./src/routes/destinationRoutes");
const roomRoute = require("./src/routes/hotelRoomRoutes");
const blogRoute = require("./src/routes/blogsRoute");
const reservationRoute = require("./src/routes/reservationRoute");
const purchaseRoute = require("./src/routes/purchaseRoute");
const subscribeRoute = require("./src/routes/subscriptionRoute");
const productRoute = require("./src/routes/productRoute");
const tourRoute = require("./src/routes/tourPackageRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const express = require("express");

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tourism-management-front.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoute);
app.use("/profile", profileRoute);
app.use("/destinations", destinationRoute);
app.use("/rooms", roomRoute);
app.use("/blogs", blogRoute);
app.use("/reservation", reservationRoute);
app.use("/goods", productRoute);
app.use("/purchase", purchaseRoute);
app.use("/subscribe", subscribeRoute);
app.use("/tours", tourRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`running on port ${port}`);
});

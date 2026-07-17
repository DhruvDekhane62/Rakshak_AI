import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import chatRouter from "./chat";
import firsRouter from "./firs";
import accusedRouter from "./accused";
import networkRouter from "./network";
import analyticsRouter from "./analytics";
import hotspotsRouter from "./hotspots";
import forecastingRouter from "./forecasting";
import alertsRouter from "./alerts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(chatRouter);
router.use(firsRouter);
router.use(accusedRouter);
router.use(networkRouter);
router.use(analyticsRouter);
router.use(hotspotsRouter);
router.use(forecastingRouter);
router.use(alertsRouter);

export default router;

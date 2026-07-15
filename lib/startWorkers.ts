import "./workers";
import { registerScheduledJobs } from "./queue/scheduleJobs";

registerScheduledJobs();
console.log("All BullMQ workers started");
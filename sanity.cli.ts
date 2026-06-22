import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  // The Studio is served by Next.js at /studio, not as a standalone app.
  studioHost: "aihuntr",
  autoUpdates: true,
});

import { Config } from "@remotion/cli/config";
import path from "path";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// @/ Alias für Remotion Webpack (identisch zu tsconfig paths)
Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...((currentConfiguration.resolve?.alias as Record<string, string>) ??
          {}),
        "@": path.join(process.cwd(), "src"),
      },
    },
  };
});

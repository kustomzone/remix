import fs from "node:fs";
import path from "node:path";
import {
  type RouteConfigEntry,
  getAppDirectory,
} from "@remix-run/route-config";

import { routeManifestToRouteConfig } from "./manifest";
import { flatRoutes as flatRoutesImpl } from "./flatRoutes";
import { normalizeSlashes } from "./normalizeSlashes";

/**
 * Creates route config from the file system that matches [Remix's default file
 * conventions](https://remix.run/docs/en/v2/file-conventions/routes), for
 * use within `routes.ts`.
 */
export async function flatRoutes(
  options: {
    /**
     * An array of [minimatch](https://www.npmjs.com/package/minimatch) globs that match files to ignore.
     * Defaults to `[]`.
     */
    ignoredRouteFiles?: string[];

    /**
     * The directory containing file system routes, relative to the app directory.
     * Defaults to `"./routes"`.
     */
    rootDirectory?: string;
  } = {}
): Promise<RouteConfigEntry[]> {
  let { ignoredRouteFiles = [], rootDirectory: userRootDirectory = "routes" } =
    options;
  let appDirectory = getAppDirectory();
  let rootDirectory = path.resolve(appDirectory, userRootDirectory);
  let relativeRootDirectory = path.relative(appDirectory, rootDirectory);
  let prefix = normalizeSlashes(relativeRootDirectory);

  let routes = fs.existsSync(rootDirectory)
    ? flatRoutesImpl(appDirectory, ignoredRouteFiles, prefix)
    : {};

  return routeManifestToRouteConfig(routes);
}

export interface WorkboxBuildOptions {
  globDirectory: string;
  globPatterns: string[];
  globIgnores?: string[];
  swDest?: string;
  templatedUrls?: { [key: string]: string[] };
  mainfestDest?: string;
  swSrc?: string;
}

export interface Manifest {
  revision: string;
  ur: string;
}

export interface WorkboxBuild {
  generateFileManifest(opts: WorkboxBuildOptions): Promise<void>;
  generateSW(opts: WorkboxBuildOptions): Promise<void>;
  getFileManifestEntries(opts: WorkboxBuildOptions): Promise<Manifest[]>;
  injectManifest(opts: WorkboxBuildOptions): Promise<void>;
}

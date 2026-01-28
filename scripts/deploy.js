#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

// Create .nojekyll file to tell GitHub Pages to not process the site
const distDir = path.join(rootDir, "dist", "spa");
const nojekyllPath = path.join(distDir, ".nojekyll");

if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, "");
  console.log("✓ Created .nojekyll file");
}

// Deploy using git
console.log("Deploying to GitHub Pages...");

exec(
  `cd "${rootDir}" && git add dist/spa -f && git commit -m "Deploy to GitHub Pages" && git push origin $(git rev-parse --abbrev-ref HEAD) --force`,
  (error, stdout, stderr) => {
    if (error) {
      // Deployment might fail if there are no changes, which is OK
      if (!stderr.includes("nothing to commit")) {
        console.error("Deployment error:", error);
        process.exit(1);
      }
    }
    console.log("✓ Deployment completed successfully!");
    console.log("\nYour site should be live at:");
    console.log(
      "https://maneesh-relanto.github.io/Privacy-Focused-Web-Analytics-Dashboard/"
    );
  }
);

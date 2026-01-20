import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const searchDir = path.join(__dirname, "src"); // Only search src folder
const axiosUsageRegex = /axios\.(post|get)/;
const axiosImportRegex = /import\s+axios.*from\s+['"]axios['"]/;

// Recursively gather JS/TS/React files
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const filesToOpen = [];

getAllFiles(searchDir).forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  if (axiosImportRegex.test(content) && axiosUsageRegex.test(content)) {
    filesToOpen.push(`"${file}"`);
  }
});

if (filesToOpen.length === 0) {
  console.log("No axios imports or axios.get/post found in src folder.");
  process.exit(0);
}

console.log("Opening these files in VS Code:\n");
console.log(filesToOpen.join("\n"));
exec(`code ${filesToOpen.join(" ")}`);

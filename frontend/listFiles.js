import fs from "fs";
import path from "path";

function printTree(dir, prefix = "") {
  const files = fs.readdirSync(dir);
  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const isLast = index === files.length - 1;
    const stat = fs.statSync(filePath);

    console.log(prefix + (isLast ? "└── " : "├── ") + file);

    if (stat.isDirectory()) {
      printTree(filePath, prefix + (isLast ? "    " : "│   "));
    }
  });
}

printTree(process.cwd());

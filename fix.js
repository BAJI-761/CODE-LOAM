const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('import { api } from "@/lib/api"')) {
    content = content.replace(/import \{ api \} from "@\/lib\/api"/g, 'import api from "@/lib/api"');
    changed = true;
  }
  
  if (content.includes('variant="outline"')) {
    content = content.replace(/variant="outline"/g, 'variant="inset"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
  }
}

const filesToFix = [
  'client/src/app/(instructor)/instructor/dashboard/page.tsx',
  'client/src/app/(instructor)/instructor/courses/page.tsx',
  'client/src/app/(instructor)/instructor/courses/new/page.tsx',
  'client/src/app/(instructor)/instructor/courses/[id]/page.tsx',
  'client/src/app/(instructor)/instructor/courses/[id]/analytics/page.tsx',
  'client/src/app/(instructor)/instructor/courses/[id]/quiz/new/page.tsx',
  'client/src/app/(instructor)/instructor/courses/[id]/challenges/new/page.tsx',
  'client/src/app/(instructor)/instructor/students/page.tsx'
];

filesToFix.forEach(f => replaceInFile(path.join('e:/CODELOAM', f)));

// Delete the old ghost files
const toDelete = [
  'e:/CODELOAM/client/src/app/(instructor)/instructor/courses/create',
  'e:/CODELOAM/client/src/app/(instructor)/instructor/courses/[id]/edit'
];

toDelete.forEach(p => {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log('Deleted:', p);
  }
});

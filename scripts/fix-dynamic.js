const fs = require('fs');
const files = [
  'src/app/(public)/page.tsx',
  'src/app/admin/page.tsx',
  'src/app/admin/projects/new/page.tsx',
  'src/app/admin/projects/[id]/edit/page.tsx',
  'src/app/admin/analytics/page.tsx',
  'src/app/(public)/layout.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/export const dynamic = ['"].+['"];?\n?/g, '');
    c = c.replace(/export const revalidate = \d+;?\n?/g, '');
    
    // Remove empty lines at the very beginning
    c = c.replace(/^\s+/, '');
    
    const flags = "export const dynamic = 'force-dynamic';\nexport const revalidate = 0;\n\n";
    
    if (c.startsWith('"use client"') || c.startsWith("'use client'")) {
        // Extract the use client line
        const endOfLineIndex = c.indexOf('\n');
        const firstLine = c.substring(0, endOfLineIndex + 1);
        const rest = c.substring(endOfLineIndex + 1);
        c = firstLine + "\n" + flags + rest;
    } else {
        c = flags + c;
    }
    fs.writeFileSync(f, c);
  }
});

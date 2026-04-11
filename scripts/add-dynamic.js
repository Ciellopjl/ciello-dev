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
    c = "export const dynamic = 'force-dynamic';\nexport const revalidate = 0;\n\n" + c;
    fs.writeFileSync(f, c);
  }
});

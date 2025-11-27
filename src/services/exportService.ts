import { Theme, ThemeId } from '../types';

interface ExportOptions {
  contentHtml: string;
  theme: Theme;
  activeThemeId: ThemeId;
  customCss: string;
  styles: {
    tailwind: string;
    katex: string;
    themes: string;
  };
}

export const exportToHtml = (options: ExportOptions) => {
  const { contentHtml, theme, activeThemeId, customCss, styles } = options;

  // Extract the first heading from the preview content
  const extractFirstHeading = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const heading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
    return heading ? heading.textContent || '' : '';
  };

  const documentTitle = extractFirstHeading(contentHtml) || 'MatNoble Editor Export';
  const sanitizedName = documentTitle
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim() || 'matnoble-editor-export';

  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${documentTitle}</title>
  <style>
    /* Inlined Tailwind CSS */
    ${styles.tailwind}
    /* Inlined KaTeX CSS */
    ${styles.katex}
    /* Inlined Theme CSS */
    ${styles.themes}
    /* Inlined Custom CSS (if active theme is custom) */
    ${activeThemeId === ThemeId.CUSTOM ? customCss : ''}
    /* Hide elements marked for export hiding */
    .export-hidden { display: none !important; }
    /* Ensure code blocks wrap correctly */
    pre { white-space: pre-wrap; word-wrap: break-word; }
  </style>
</head>
<body class="min-h-screen ${theme.className} ${theme.fontFamily} p-8 md:p-12">
  <div class="max-w-4xl mx-auto">
    ${contentHtml}
  </div>
</body>
</html>`;

  const blob = new Blob([fullHtml.trim()], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizedName}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

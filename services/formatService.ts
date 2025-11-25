import prettier from 'prettier/standalone';
import markdownPlugin from 'prettier/plugins/markdown';

/**
 * Formats the given markdown string using Prettier.
 * This handles list indentation, table alignment, spacing, etc.
 */
export const formatMarkdown = async (content: string): Promise<string> => {
  try {
    const formatted = await prettier.format(content, {
      parser: 'markdown',
      plugins: [markdownPlugin],
      // Configuration for better Chinese markdown experience
      printWidth: 80, // Wrap text at 80 chars (soft wrap in editors, hard wrap in file)
      proseWrap: 'preserve', // Do not force hard wraps on text paragraphs, preserve user intent
      tabWidth: 2,
      useTabs: false,
      singleQuote: true,
    });
    return formatted;
  } catch (error) {
    console.error("Markdown formatting failed:", error);
    // If formatting fails (e.g. syntax error in code blocks), return original content
    return content; 
  }
};
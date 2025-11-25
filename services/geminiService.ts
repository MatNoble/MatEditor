import { GoogleGenAI } from "@google/genai";

// Ensure we have the API key
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Polishes the provided markdown text using Gemini.
 * It fixes grammar, improves flow, and ensures valid Markdown syntax.
 */
export const enhanceMarkdown = async (content: string): Promise<string> => {
  if (!ai) {
    throw new Error("API Key is missing. Cannot use AI features.");
  }

  try {
    const model = ai.models;
    const prompt = `
      你是一位专业的文章和技术文档编辑。
      请帮助我优化以下的 Markdown 文本。
      
      目标：
      1. 修正错别字、标点符号和语法错误。
      2. 提升表达的清晰度和流畅度，使其更符合中文阅读习惯（如果原文是中文）。
      3. 确保 LaTeX 公式格式正确（以 $ 或 $$ 包裹）。
      4. 修正表格和列表的格式缩进。
      5. 仅返回优化后的 Markdown 内容，不要包含任何对话、解释或寒暄。

      输入内容：
      ---
      ${content}
      ---
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || content;
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    throw error;
  }
};

/**
 * Smartly formats the markdown focusing on typesetting rules (spacing, punctuation)
 * without changing the content or tone.
 */
export const smartFormatMarkdown = async (content: string): Promise<string> => {
  if (!ai) {
    throw new Error("API Key is missing. Cannot use AI features.");
  }

  try {
    const model = ai.models;
    const prompt = `
      你是一个专业的排版工具。请对下面的 Markdown 文本进行“智能排版”。
      
      严格遵守以下排版规则：
      1. **中西文空格**：在中文（汉字）与英文、数字之间增加一个空格（例如："React技术" -> "React 技术"）。
      2. **标点统一**：中文语境下使用全角标点，英文语境下使用半角标点。
      3. **修正语法**：修复破损的 Markdown 语法（如未闭合的加粗、错误的列表缩进）。
      4. **LaTeX**：确保数学公式格式正确。
      5. **禁止改写**：绝对不要修改文章的原意、措辞或语气，只做格式和排版层面的修正。
      
      请直接返回排版后的 Markdown 内容，不要包含 Markdown 代码块标记（\`\`\`），也不要包含任何解释。

      输入内容：
      ---
      ${content}
      ---
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Remove code block markers if the model accidentally included them
    let text = response.text?.trim() || content;
    if (text.startsWith('```markdown')) text = text.replace(/^```markdown\s*/, '');
    if (text.startsWith('```')) text = text.replace(/^```\s*/, '');
    if (text.endsWith('```')) text = text.replace(/\s*```$/, '');

    return text;
  } catch (error) {
    console.error("Gemini smart format failed:", error);
    throw error;
  }
};

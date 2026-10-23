import katex from "katex";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Must produce the same markup as the admin editor's mathInline node
// (RA-Admin components/common/mathExtension.ts): the editor re-parses it from
// data-latex, and the student app renders the baked-in KaTeX HTML as-is.
export const renderMath = (latex: string) => {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    strict: false,
    output: "html",
  });

  return `<span data-type="math-inline" data-latex="${escapeHtml(latex)}" class="rte-math">${html}</span>`;
};

import he from "he";
export const createHighlightedCardTextHtml = (
  input: string,
  matchedContent: string,
  searchRegex: RegExp
): string => {
  const escapeHTML = he.escape;
  let parts: string[] = [];
  if (input) {
    parts = matchedContent.trim().split(searchRegex);
  }

  return `${`<span>
      ${
        parts.length > 0 && !!input
          ? parts.map((part) => {
              return part === input
                ? `<strong>${escapeHTML(part)}</strong>`
                : escapeHTML(part);
            })
          : ""
      }
      ${!input === true ? escapeHTML(matchedContent) : ""}
    </span>`.replace(/,|\\/g, "")}`;
};

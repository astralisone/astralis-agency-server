// Utility function to add IDs to markdown headings for table of contents
export function addHeadingIds(content: string): string {
  return content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    return `<h${hashes.length} id="${id}">${text}</h${hashes.length}>`;
  });
}

// Utility function to estimate reading time more accurately
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes === 1 ? '1 min read' : `${minutes} min read`;
}

// Utility function to extract first paragraph for better excerpts
export function extractFirstParagraph(content: string): string {
  // Remove markdown syntax and get first substantial paragraph
  const cleaned = content
    .replace(/#{1,6}\s+/g, '') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove links
  
  const paragraphs = cleaned.split('\n\n').filter(p => p.trim().length > 50);
  return paragraphs[0] || cleaned.substring(0, 160);
}
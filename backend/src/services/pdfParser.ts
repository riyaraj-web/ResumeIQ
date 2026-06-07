import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    let text = data.text;
    
    // Clean: collapse 3+ newlines to 2, collapse multiple spaces to 1
    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.replace(/ {2,}/g, ' ');
    
    return text.trim();
  } catch (error) {
    throw new Error('Could not extract text from PDF');
  }
}

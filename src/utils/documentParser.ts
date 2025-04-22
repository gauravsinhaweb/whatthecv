import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up worker to use the copied file in the public directory
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

/**
 * Extracts text from various document formats
 */
export async function extractTextFromDocument(file: File): Promise<string> {
    const fileType = file.name.toLowerCase();

    try {
        // Handle PDF files
        if (fileType.endsWith('.pdf')) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                let text = '';

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const pageText = content.items.map((item: any) => item.str).join(' ');
                    text += pageText + '\n';
                }

                return text;
            } catch (pdfError) {
                console.error('PDF parsing error:', pdfError);
                // Fallback to basic text extraction if PDF parsing fails
                return await file.text();
            }
        }

        // Handle DOCX files
        if (fileType.endsWith('.docx')) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            return result.value;
        }

        // Handle DOC files (convert to text only, limited support)
        if (fileType.endsWith('.doc')) {
            // For DOC files, a server-side conversion would be ideal
            // This is a limited fallback
            const text = await file.text();
            return text;
        }

        // Handle text files and other formats as plain text
        const text = await file.text();
        console.log('Extracted text:', text);

        return text;
    } catch (error: unknown) {
        console.error('Text extraction error:', error);
        const errorMessage = error instanceof Error
            ? error.message
            : 'Unknown error during text extraction';
        throw new Error(`Failed to extract text from document: ${errorMessage}`);
    }
} 
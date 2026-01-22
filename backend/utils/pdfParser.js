import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * Extract raw text from PDF buffer
 * @param {Buffer} buffer 
 * @returns {Promise<string>}
 */
export const parsePDF = async (buffer) => {
    try {
        console.log('📄 Phase 1: Extracting raw text from PDF...');
        let text = '';

        // Handle both v1 (function) and v2 (class-based) pdf-parse APIs
        if (typeof pdfParse === 'function') {
            const data = await pdfParse(buffer);
            text = data.text;
        } else if (pdfParse.PDFParse) {
            const parser = new pdfParse.PDFParse({ data: buffer });
            const result = await parser.getText();
            text = result.text;
        } else if (typeof pdfParse.default === 'function') {
            const data = await pdfParse.default(buffer);
            text = data.text;
        } else {
            console.error('❌ pdf-parse structure:', pdfParse);
            throw new Error('Unsupported pdf-parse library structure');
        }

        return cleanText(text);
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to parse PDF file: ' + error.message);
    }
};

/**
 * Clean "dirty" PDF data
 * Strips out recurring page headers, footers, and page numbers
 * @param {string} text 
 * @returns {string}
 */
const cleanText = (text) => {
    return text
        // Remove page numbers (e.g., Page 1 of 10,  - 1 -, [1])
        .replace(/Page \d+ of \d+/gi, '')
        .replace(/ - \d+ - /g, '')
        .replace(/\[\d+\]/g, '')
        // Remove common repetitive headers/footers (customize as needed)
        .replace(/Source: .*/gi, '')
        .replace(/Copyright .*/gi, '')
        // Remove multiple whitespace/line breaks
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
};

/**
 * Generate a URL-friendly slug from a title
 * @param {string} title 
 * @returns {string}
 */
export const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

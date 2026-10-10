import mammoth from 'mammoth';

export interface FileExtractionResult {
  text: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'raw' | 'unknown';
  pageCount?: number;
  isPartial?: boolean;
  isUnreadable?: boolean;
  error?: string;
  warning?: string;
}

/**
 * Extracts plain text from an uploaded File (PDF, DOCX, TXT)
 * Preserves multi-page and structured layout, handling single-column and multi-column formats.
 */
export async function extractTextFromFile(file: File): Promise<FileExtractionResult> {
  const fileName = file.name.toLowerCase();

  // 1. Plain Text (.txt, .md, .csv, etc.)
  if (fileName.endsWith('.txt') || fileName.endsWith('.text') || fileName.endsWith('.md') || file.type.includes('text/plain')) {
    try {
      const text = await file.text();
      if (text && text.trim().length > 0) {
        return { text: text.trim(), fileType: 'txt' };
      }
    } catch (txtErr) {
      console.warn('TXT read error:', txtErr);
    }
  }

  // 2. Word Document (.docx) - Client Mammoth attempt
  if (fileName.endsWith('.docx') || file.type.includes('wordprocessingml.document')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value && result.value.trim().length > 0) {
        return { text: result.value.trim(), fileType: 'docx' };
      }
    } catch (docxErr) {
      console.warn('Browser DOCX mammoth extraction fallback to server:', docxErr);
    }
  }

  // 3. Server-Side Extraction Endpoint (handles high-fidelity multi-page PDF & DOCX layouts)
  try {
    const base64Data = await fileToBase64(file);
    const response = await fetch('/api/parse-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: fileName.endsWith('.pdf') ? 'pdf' : fileName.endsWith('.docx') ? 'docx' : 'txt',
        base64: base64Data
      })
    });

    if (response.ok) {
      const resData = await response.json();
      if (resData.isUnreadable || (resData.error && (!resData.text || resData.text.trim().length === 0))) {
        return {
          text: '',
          fileType: fileName.endsWith('.pdf') ? 'pdf' : 'docx',
          isUnreadable: true,
          error: resData.error || "⚠️ We couldn't reliably extract text from this document. Please upload a text-based PDF/DOCX or try another file."
        };
      }
      if (resData.text && resData.text.trim().length > 0) {
        return {
          text: resData.text.trim(),
          fileType: fileName.endsWith('.pdf') ? 'pdf' : fileName.endsWith('.docx') ? 'docx' : 'txt',
          pageCount: resData.pageCount,
          isPartial: resData.isPartial,
          isUnreadable: resData.isUnreadable,
          warning: resData.warning
        };
      }
    }
  } catch (serverErr) {
    console.warn('Server file parse endpoint error, trying client fallback:', serverErr);
  }

  // 4. Client-side PDF fallback text parser
  if (fileName.endsWith('.pdf') || file.type.includes('pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfText = extractTextFromPdfArrayBuffer(arrayBuffer);
      if (pdfText && pdfText.trim().length >= 15) {
        return { text: pdfText.trim(), fileType: 'pdf' };
      }
    } catch (clientPdfErr) {
      console.warn('Client PDF stream extraction failed:', clientPdfErr);
    }
    return {
      text: '',
      fileType: 'pdf',
      isUnreadable: true,
      error: "⚠️ We couldn't reliably extract text from this document. Please upload a text-based PDF/DOCX or try another file."
    };
  }

  // 5. Raw text fallback
  try {
    const raw = await file.text();
    const cleaned = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
    if (cleaned.trim().length > 15) {
      return { text: cleaned.trim(), fileType: 'raw' };
    }
  } catch {
    // Ignore
  }

  return {
    text: '',
    fileType: 'unknown',
    isUnreadable: true,
    error: "⚠️ We couldn't reliably extract text from this document. Please upload a text-based PDF/DOCX or try another file."
  };
}

/**
 * Helper to convert a File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Client-side PDF text extractor: parses PDF operators Tj, TJ, and text blocks
 */
function extractTextFromPdfArrayBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const textDecoder = new TextDecoder('latin1');
  const rawString = textDecoder.decode(bytes);

  const textChunks: string[] = [];
  const btEtRegex = /BT[\s\S]*?ET/g;
  let blockMatch;

  while ((blockMatch = btEtRegex.exec(rawString)) !== null) {
    const block = blockMatch[0];

    const tjRegex = /\(((?:[^()\\]|\\.)*)\)\s*(?:Tj|'|")/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      const unescaped = unescapePdfString(tjMatch[1]);
      if (unescaped) textChunks.push(unescaped);
    }

    const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
    let arrMatch;
    while ((arrMatch = tjArrayRegex.exec(block)) !== null) {
      const inner = arrMatch[1];
      const subRegex = /\(((?:[^()\\]|\\.)*)\)/g;
      let subMatch;
      let line = '';
      while ((subMatch = subRegex.exec(inner)) !== null) {
        line += unescapePdfString(subMatch[1]);
      }
      if (line) textChunks.push(line);
    }
  }

  if (textChunks.length === 0) {
    const simpleRegex = /\(((?:[A-Za-z0-9\s,+#/().:-]{3,}))\)/g;
    let simpleMatch;
    while ((simpleMatch = simpleRegex.exec(rawString)) !== null) {
      textChunks.push(simpleMatch[1]);
    }
  }

  return textChunks.join(' ');
}

function unescapePdfString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

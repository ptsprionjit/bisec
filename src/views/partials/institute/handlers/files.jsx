/**
 * ✅ Global File Handlers Utility
 * Supports: validation, selection, preview, and viewing PDFs.
 */

//
// 🧩 Convert Base64 → Blob
//
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const cleanB64 = b64Data.replace(/^data:application\/pdf;base64,/, '');
    const byteCharacters = atob(cleanB64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
};

//
// 📤 View PDF in new tab (with fallback download)
//
export const HandleFileView = (file, filename = 'document.pdf') => {
    if (!file) return;
    let pdfURL = null;

    try {
        // Handle Base64
        if (typeof file === 'string') {
            if (file.startsWith('data:application/pdf;base64,')) {
                pdfURL = file;
            } else {
                const blob = b64toBlob(file, 'application/pdf');
                pdfURL = URL.createObjectURL(blob);
            }
        }
        // Handle Blob or File
        else if (file instanceof Blob) {
            if (file.type !== 'application/pdf') {
                console.warn('⚠️ Provided file is not a PDF.');
                return;
            }
            pdfURL = URL.createObjectURL(file);
        } else {
            console.error('❌ Unsupported file type for PDF view.');
            return;
        }

        // Try open in new tab
        const newTab = window.open(pdfURL, '_blank');
        if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
            // Fallback: trigger download
            const link = document.createElement('a');
            link.href = pdfURL;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Cleanup memory
        if (pdfURL.startsWith('blob:')) {
            setTimeout(() => URL.revokeObjectURL(pdfURL), 10000);
        }
    } catch (error) {
        console.error('PDF view failed:', error);
        if (pdfURL && pdfURL.startsWith('blob:')) {
            setTimeout(() => URL.revokeObjectURL(pdfURL), 10000);
        }
    }
};

//
// 📥 Validate & Select File
//
export const HandleFileSelect = (
    fileName,
    selectedFile,
    setFiles,
    setError,
    options = {}
) => {
    const {
        maxSize = 1024 * 1024, // 1MB
        allowedTypes = ['application/pdf'],
    } = options;

    let errorMessage = null;

    if (!selectedFile) {
        errorMessage = `${allowedTypes
            .map((t) => t.split('/')[1].toUpperCase())
            .join(', ')} ফাইল সিলেক্ট করতে হবে!`;
    } else if (!allowedTypes.includes(selectedFile.type)) {
        errorMessage = `শুধুমাত্র ${allowedTypes
            .map((t) => t.split('/')[1].toUpperCase())
            .join(', ')} ফাইল গ্রহণযোগ্য!`;
    } else if (selectedFile.size > maxSize) {
        errorMessage = `ফাইলের সাইজ ${(maxSize / 1024 / 1024).toFixed(
            0
        )}MB এর কম হতে হবে!`;
    }

    if (errorMessage) {
        setError?.((prev) => ({ ...prev, [fileName]: errorMessage }));
        setFiles?.((prev) => ({ ...prev, [fileName]: null }));
        return;
    }

    try {
        const extension =
            selectedFile.name.split('.').pop() ||
            allowedTypes[0].split('/')[1] ||
            'file';

        const validFile = new File([selectedFile], `${fileName}.${extension}`, {
            type: selectedFile.type,
        });

        setFiles?.((prev) => ({ ...prev, [fileName]: validFile }));
        setError?.((prev) => ({ ...prev, [fileName]: null }));
    } catch (err) {
        console.error('File processing failed:', err);
        setError?.((prev) => ({ ...prev, [fileName]: 'ফাইল আপলোড ব্যর্থ হয়েছে!' }));
    }
};

//
// 🖼️ Preview File (image or PDF)
//
export const getFilePreviewURL = (file) => {
    if (!file) return null;

    if (file instanceof Blob) {
        return URL.createObjectURL(file);
    }

    if (typeof file === 'string' && file.startsWith('data:')) {
        return file; // base64 data URL
    }

    console.warn('⚠️ Unsupported file format for preview.');
    return null;
};

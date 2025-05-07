import React, { useCallback, useState } from 'react';
import { analyzeResume, extractResumeText, ResumeTextResult } from '../utils/ai';

export interface AnalysisResult {
    score: number;
    feedback?: {
        strengths: string[];
        weaknesses: string[];
        improvements: string[];
    };
    sections?: {
        [key: string]: {
            score: number;
            feedback: string;
        };
    };
    keywords?: {
        matched?: string[];
        missing: string[];
        present?: string[];
    };
    atsCompatibility?: {
        score: number;
        issues: string[];
    };
    [key: string]: any; // Allow for additional properties
}

interface UploadState {
    isDragging: boolean;
    isUploading: boolean;
    isAnalyzing: boolean;
    uploadStatus: 'idle' | 'success' | 'error';
    errorMessage: string;
}

export function useResumeUpload(jobDescription: string) {
    const [file, setFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState<string>('');
    const [extractedLinks, setExtractedLinks] = useState<ResumeTextResult['links']>([]);
    const [uploadState, setUploadState] = useState<UploadState>({
        isDragging: false,
        isUploading: false,
        isAnalyzing: false,
        uploadStatus: 'idle',
        errorMessage: '',
    });
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const updateUploadState = (newState: Partial<UploadState>) => {
        setUploadState(prevState => ({ ...prevState, ...newState }));
    };

    const processResume = async (selectedFile: File) => {
        updateUploadState({ isUploading: true });

        try {
            const resumeResult = await extractResumeText(selectedFile);

            console.log('Extracted upload:', resumeResult);
            console.log('Extracted links:', resumeResult.links);

            if (!resumeResult.text || resumeResult.text.trim().length < 50) {
                throw new Error('Could not extract sufficient text from the resume. Please try a different file.');
            }

            setExtractedText(resumeResult.text);
            setExtractedLinks(resumeResult.links);
            updateUploadState({ isUploading: false, isAnalyzing: true });

            const analysis = await analyzeResume(resumeResult.text, jobDescription || undefined);

            if (!analysis) {
                throw new Error('Failed to analyze the resume. Please try again.');
            }

            setAnalysisResult(analysis);
            updateUploadState({ uploadStatus: 'success' });
        } catch (error) {
            console.error('Resume processing error:', error);
            updateUploadState({
                errorMessage: error instanceof Error ? error.message : 'Failed to analyze resume. Please try again.',
                uploadStatus: 'error'
            });
        } finally {
            updateUploadState({ isUploading: false, isAnalyzing: false });
        }
    };

    const handleFile = (selectedFile: File) => {
        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

        if (!fileExtension || !['pdf', 'doc', 'docx', 'txt'].includes(fileExtension)) {
            updateUploadState({
                errorMessage: 'Please upload a PDF, DOC, DOCX, or TXT file.',
                uploadStatus: 'error'
            });
            return;
        }

        if (selectedFile.size > maxSizeInBytes) {
            updateUploadState({
                errorMessage: 'File size exceeds 5MB limit. Please upload a smaller file.',
                uploadStatus: 'error'
            });
            return;
        }

        setFile(selectedFile);
        updateUploadState({
            uploadStatus: 'idle',
            errorMessage: ''
        });
        setAnalysisResult(null);
        setExtractedText('');
        setExtractedLinks([]);

        processResume(selectedFile);
    };

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        updateUploadState({ isDragging: true });
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        updateUploadState({ isDragging: false });
    }, []);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        updateUploadState({ isDragging: false });

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            handleFile(droppedFile);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const clearFile = () => {
        setFile(null);
        updateUploadState({ uploadStatus: 'idle' });
        setAnalysisResult(null);
        setExtractedText('');
        setExtractedLinks([]);
    };

    const tryAgain = () => {
        updateUploadState({ uploadStatus: 'idle' });
        if (file) {
            processResume(file);
        }
    };

    return {
        file,
        extractedText,
        extractedLinks,
        uploadState,
        analysisResult,
        onDragOver,
        onDragLeave,
        onDrop,
        handleInputChange,
        clearFile,
        tryAgain
    };
} 
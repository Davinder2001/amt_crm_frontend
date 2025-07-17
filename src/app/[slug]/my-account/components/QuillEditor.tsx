'use client';
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface EditorProps {
    value: string | null | undefined;
    onChange: (value: string) => void;
    placeholder?: string;
}

const QuillEditor: React.FC<EditorProps> = ({
    value = '',
    onChange,
    placeholder
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder,
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                    ],
                },
            });

            quillRef.current.on('text-change', () => {
                onChange(quillRef.current?.root.innerHTML || '');
            });
        }
    }, [onChange, placeholder]);

    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
        }
    }, [value]);

    if (typeof window === 'undefined') return null;

    return <div ref={editorRef} className="text-editor-ql" style={{ height: '200px' }} />;
};

export default QuillEditor;
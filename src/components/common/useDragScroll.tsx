'use client';
import { useRef, useState, useEffect } from 'react';

interface UseDragScrollResult {
    ref: React.RefObject<HTMLDivElement | null>;
    isDragging: boolean;
    wasDraggedRef: React.MutableRefObject<boolean>;
    handleMouseDown: (e: React.MouseEvent) => void;
}

export const useDragScroll = (): UseDragScrollResult => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const wasDraggedRef = useRef(false);

    useEffect(() => {
        if (ref.current) {
            ref.current.classList.add('drag-scroll'); // Base class always present
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !ref.current) return;

            const x = e.pageX - ref.current.offsetLeft;
            const walk = (x - startX) * 1.5;

            if (Math.abs(walk) > 5) {
                wasDraggedRef.current = true;
            }

            ref.current.scrollLeft = scrollLeft - walk;
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            if (ref.current) {
                ref.current.classList.remove('dragging');
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, startX, scrollLeft]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!ref.current) return;

        setIsDragging(true);
        wasDraggedRef.current = false;

        setStartX(e.pageX - ref.current.offsetLeft);
        setScrollLeft(ref.current.scrollLeft);

        ref.current.classList.add('dragging');
    };

    return {
        ref,
        isDragging,
        wasDraggedRef,
        handleMouseDown,
    };
};

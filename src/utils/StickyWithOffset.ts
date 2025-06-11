import { useEffect, useRef } from 'react';

function useStickyWithOffset(
    elementRef: React.RefObject<HTMLDivElement | null>,
    offsetFromTop: number = 0
) {
    const scrollParentRef = useRef<HTMLElement | Window>(window);

    useEffect(() => {
        if (!elementRef.current) return;

        function getScrollParent(element: HTMLElement | null): HTMLElement | Window {
            if (!element) return window;
            const style = getComputedStyle(element);
            const overflowY = style.overflowY;
            if (overflowY === 'auto' || overflowY === 'scroll') {
                return element;
            }
            return element.parentElement ? getScrollParent(element.parentElement) : window;
        }

        scrollParentRef.current = getScrollParent(elementRef.current);

        function onScroll() {
            const scrollTop =
                scrollParentRef.current instanceof Window
                    ? window.scrollY
                    : (scrollParentRef.current as HTMLElement).scrollTop;

            if (elementRef.current) {
                const translateY = scrollTop - offsetFromTop;
                elementRef.current.style.transform = `translateY(${translateY > 0 ? translateY : 0}px)`;
                elementRef.current.style.zIndex = '1000';
            }
        }

        const scrollTarget =
            scrollParentRef.current instanceof Window ? window : scrollParentRef.current;

        scrollTarget.addEventListener('scroll', onScroll);

        return () => {
            scrollTarget.removeEventListener('scroll', onScroll);
        };
    }, [elementRef, offsetFromTop]);
}

export default useStickyWithOffset;

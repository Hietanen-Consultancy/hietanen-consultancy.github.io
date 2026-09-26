import { useEffect, useState, type RefObject } from "react";

type ScrollEdges = { atStart: boolean; atEnd: boolean };

/**
 * Tracks whether a horizontally scrolling element is at its start or end, so
 * prev/next controls can be disabled. Re-evaluates on scroll and on resize of
 * the container or its content. Both flags start true, so nothing renders as
 * enabled during SSR before the real width is known.
 */
export function useScrollEdges(ref: RefObject<HTMLElement | null>): ScrollEdges {
  const [edges, setEdges] = useState<ScrollEdges>({ atStart: true, atEnd: true });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ atStart: el.scrollLeft <= 1, atEnd: el.scrollLeft >= max - 1 });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [ref]);

  return edges;
}

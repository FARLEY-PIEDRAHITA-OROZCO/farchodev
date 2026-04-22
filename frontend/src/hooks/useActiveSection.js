import { useEffect, useState } from "react";

/**
 * Returns the id of the currently active section based on scroll position.
 * Uses IntersectionObserver with a "detection band" near the top of the
 * viewport (configurable via rootMargin) so a section becomes active as
 * soon as its heading enters that band.
 *
 * @param {string[]} ids - ordered list of section DOM ids to track.
 * @param {object} [options]
 * @param {string} [options.rootMargin="-40% 0px -55% 0px"] - band definition.
 */
export default function useActiveSection(ids, options = {}) {
  const { rootMargin = "-40% 0px -55% 0px" } = options;
  const [active, setActive] = useState(ids[0] || null);

  useEffect(() => {
    if (!ids || ids.length === 0) return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (elements.length === 0) return;

    // Track multiple simultaneously-visible sections; pick the first one
    // that enters the detection band in document order.
    const visibleMap = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleMap.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleMap.delete(entry.target.id);
          }
        });

        // Pick the id that's currently in the band, in DOM order
        const candidateIds = ids.filter((id) => visibleMap.has(id));
        if (candidateIds.length > 0) {
          setActive(candidateIds[0]);
        } else if (window.scrollY < 100) {
          setActive(ids[0]);
        }
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(","), rootMargin]);

  return active;
}

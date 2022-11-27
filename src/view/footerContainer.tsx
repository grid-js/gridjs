import { h } from 'preact';
import { classJoin, className } from '../util/className';
import { PluginPosition, PluginRenderer } from '../plugin';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useConfig } from '../hooks/useConfig';

export function FooterContainer() {
  const footerRef = useRef(null);
  const [isActive, setIsActive] = useState(true);
  const config = useConfig();

  useEffect(() => {
    if (footerRef.current.children.length === 0) {
      setIsActive(false);
    }
  }, [footerRef]);

  if (isActive) {
    return (
      <div
        ref={footerRef}
        className={classJoin(className('footer'), config.className.footer)}
        style={{ ...config.style.footer }}
      >
        <PluginRenderer position={PluginPosition.Footer} />
      </div>
    );
  }

  return null;
}

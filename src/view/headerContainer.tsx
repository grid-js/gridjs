import { classJoin, className } from '../util/className';
import { h } from 'preact';
import { PluginPosition, PluginRenderer } from '../plugin';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useConfig } from '../hooks/useConfig';

export function HeaderContainer() {
  const [isActive, setIsActive] = useState(true);
  const headerRef = useRef(null);
  const config = useConfig();

  useEffect(() => {
    if (headerRef.current.children.length === 0) {
      setIsActive(false);
    }
  }, [headerRef]);

  if (isActive) {
    return (
      <div
        ref={headerRef}
        className={classJoin(className('head'), config.className.header)}
        style={{ ...config.style.header }}
      >
        <PluginRenderer position={PluginPosition.Header} />
      </div>
    );
  }

  return null;
}

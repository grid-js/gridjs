import { Context } from 'preact';
import { Config } from '../config';

/**
 * This is a hack to get the current global config from Preact context.
 * My assumption is that we only need one global context which is the ConfigContext
 *
 * @param context
 */
export default function getConfig(context: {
  [key: string]: Context<any>;
}): Config {
  if (!context) return null;

  const keys = Object.keys(context);

  if (keys.length) {
    // TODO: can we use a better way to capture and return the Config context?
    const ctx: any = context[keys[0]];
    return ctx.props.value;
  }

  return null;
}

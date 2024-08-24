export const colorize = (text: string, format: string[]): string => {
  const config = {
    info: 32,
    warn: 36,
    log: 33,
    debug: 39,
    fatal: 41,
    error: 31,

    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,

    blackBg: 40,
    redBg: 41,
    greenBg: 42,
    yellowBg: 43,
    blueBg: 44,
    magentaBg: 45,
    cyanBg: 46,
    whiteBg: 47,
  };

  return `\x1b[${format.map((f) => (config.hasOwnProperty(f) ? config[f] : 37)).join(';')}m${text}\x1b[0m`;
};

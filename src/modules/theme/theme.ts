enum Theme {
  Auto = 'auto',
  Light = 'light',
  Dark = 'dark',
}

const ThemeConfig = {
  defaultTheme: Theme.Light,
  themeCookie: {
    name: 'theme',
    maxAge: 60 * 60 * 24 * 365,
  },
};

export function isTheme(value: string | undefined | null): value is Theme {
  return Object.values(Theme).includes(value as Theme);
}

export function normalizeTheme(value: string | undefined | null): Theme {
  return isTheme(value) ? value : ThemeConfig.defaultTheme;
}

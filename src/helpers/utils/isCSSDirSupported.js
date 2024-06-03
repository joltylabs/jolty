let isSupported;
export default () =>
  isSupported === undefined
    ? (isSupported = CSS.supports("selector(:dir(rtl))"))
    : isSupported;

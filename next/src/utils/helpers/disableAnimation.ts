export const disableAnimation = () => {
  const css = document.createElement('style');

  css.appendChild(
    document.createTextNode(
      `*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:background none!important;-ms-transition:none!important;transition:none!important}`,
    ),
  );

  document.head.appendChild(css);

  return () => {
    (() => window.getComputedStyle(document.body))();

    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

// Для обычных CSS импортов (сайд-эффектов)
declare module '*.css';

// Для CSS-модулей (если используются)
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
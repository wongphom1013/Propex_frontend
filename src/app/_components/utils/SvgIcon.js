export default function SvgIcon({ src, className, style, onClick }) {
  return (
    <span
      className={`svg-icon ${className}`}
      style={{
        ...style,
        display: "inline-block",
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
      }}
      onClick={onClick}
    />
  );
}

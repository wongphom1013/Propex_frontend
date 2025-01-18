const RedirectButton = ({ title, className, redirectTo }) => {
  return (
    <a href={redirectTo} className={className}>
      {title}
    </a>
  );
};

export default RedirectButton;

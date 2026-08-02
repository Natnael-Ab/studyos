function Surface({ as: Component = "section", className = "", children, ...props }) {
  const classes = ["surface", className].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

export default Surface;
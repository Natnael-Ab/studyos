import cn from "../../lib/cn";

function Surface({ as: Component = "section", className = "", children, ...props }) {
  return (
    <Component className={cn("surface", className)} {...props}>
      {children}
    </Component>
  );
}

export default Surface;
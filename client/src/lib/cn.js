function cn(...values) {
  return values.filter(Boolean).join(" ");
}

export default cn;
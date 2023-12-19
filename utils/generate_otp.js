module.exports = () => {
  if (process.env.NODE_ENV !== "production") {
    return "0000";
  }
  return Math.floor(1000 + Math.random() * 8999).toString();
};

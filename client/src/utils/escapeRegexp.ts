export function escapeRegexp(string = ""): string {
  return string.replace(/[-[\]{}()*+?.,\\^$#\s]/g, "\\$&");
}


function isprod() {
  return /onrender/g.test(window.location.host);
}

export const API_URL = (() => {

  return isprod()
    ? "https://nomad-lang.onrender.com"
    : "http://localhost:4000";
})();

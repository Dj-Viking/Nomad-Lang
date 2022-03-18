import flagpole from "flagpole";

flagpole("starting puppeteer", async (suite) => {
  suite
    .scenario("something", "browser")
    .open("http://localhost:8080/")
    .next(async (context) => {
      context.assert(await context.find("h2.title.mb-0")).exists();
      console.log("what is this keyword here", this);
      context.assert(window.navigator).exists();
    });
});

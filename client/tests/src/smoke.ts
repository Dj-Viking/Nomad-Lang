/* eslint-disable @typescript-eslint/no-unused-vars */
import flagpole from "flagpole";

flagpole("Basic Smoke Test of Site", async (suite) => {
  suite
    .scenario("Homepage Loads", "html")
    .open("/")
    .next(async (_context) => {
      const blah = "blasdfsdf";
      console.log(blah);
    });
  suite
    .scenario("login loads", "html")
    .open("/login")
    .next(async (_context) => {
      console.log("suite opened context response");
    });
});

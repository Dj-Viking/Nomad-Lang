/* eslint-disable @typescript-eslint/no-unused-vars */
import flagpole from "flagpole";

const suite = flagpole("Basic Smoke Test of Site");
suite
  .scenario("Homepage Loads", "html")
  .open("/")
  .next(async (_context) => {
    const blah = "blasdfsdf";
    console.log(blah);
  });

suite
  .scenario("login page loads", "html")
  .open("/login")
  .next(async (context) => {
    const blah = "blasdfsdf";
    console.log(blah);
  });

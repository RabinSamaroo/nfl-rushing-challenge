const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/index");
const expect = chai.expect;

chai.use(chaiHttp);

function generateParams(
  filterField = "Yds",
  filterAsc = "Ascending",
  filterPlayer = "",
  filterLimit = 25,
  offset = 0
) {
  const fields = {
    filterField: filterField,
    filterAsc: filterAsc,
    filterPlayer: filterPlayer,
    filterLimit: filterLimit,
    offset: offset,
  };

  return Object.entries(fields)
    .map((e) => e.join("="))
    .join("&");
}

describe("Test", () => {
  it("t1", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams())
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});

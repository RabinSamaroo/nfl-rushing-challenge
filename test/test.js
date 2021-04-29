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

describe("/json GET", () => {
  it("filterField Invalid", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams("err"))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("filterAsc Invalid", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams("Yds", "err"))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("filterLimit Invalid", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams("Yds", "Ascending", "", "1"))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("offset Out-Of-Bounds", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams("Yds", "Ascending", "", "25", "350"))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(JSON.parse(res["text"])["data"]).to.eql([]);
        done();
      });
  });
  it("% in playerName filter returns nothing", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams("Yds", "Ascending", "%"))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(JSON.parse(res["text"])["data"]).to.eql([]);
        done();
      });
  });
});

describe("/csv GET", () => {
  it("filterField Invalid", (done) => {
    chai
      .request(server)
      .get("/csv?" + generateParams("err"))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("filterAsc Invalid", (done) => {
    chai
      .request(server)
      .get("/csv?" + generateParams("Yds", "err"))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("filterLimit Invalid", (done) => {
    chai
      .request(server)
      .get("/csv?" + generateParams("Yds", "Ascending", "", "1"))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("offset Out-Of-Bounds", (done) => {
    chai
      .request(server)
      .get("/csv?" + generateParams("Yds", "Ascending", "", "25", "350"))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res["text"]).to.be.empty;
        done();
      });
  });
  it("% in playerName filter returns nothing", (done) => {
    chai
      .request(server)
      .get("/csv?" + generateParams("Yds", "Ascending", "%"))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res["text"]).to.be.empty;
        done();
      });
  });
});

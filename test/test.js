const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/index");
const expect = chai.expect;

chai.use(chaiHttp);

function generateParams(params = {}) {
  let fields = {
    filterField: "Yds",
    filterAsc: "Ascending",
    filterPlayer: "",
    filterLimit: 25,
    offset: 0,
  };

  for (key of Object.keys(params)) {
    fields[key] = params[key];
  }

  return Object.entries(fields)
    .map((e) => e.join("="))
    .join("&");
}

describe("/json GET", () => {
  it("200 - Returns JSON", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams())
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(JSON.parse(res["text"])).not.to.throw;
        done();
      });
  });

  it("400 - filterField Invalid", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams({ filterField: "err" }))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("400 - filterAsc Invalid", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams({ filterAsc: "err" }))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("400 - filterLimit Invalid", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams({ filterLimit: "1" }))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("200 - offset Out-Of-Bounds", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams({ offset: "350" }))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(JSON.parse(res["text"])["data"]).to.eql([]);
        done();
      });
  });

  it("200 - % in playerName filter returns nothing", (done) => {
    chai
      .request(server)
      .get("/json?" + generateParams({ filterPlayer: "%" }))
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
  it("200 - first row is header", (done) => {
    chai
      .request(server)
      .get("/csv?" + generateParams())
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res["text"].split("\r\n")[0]).to.equal(
          "Player,Team,Pos,Att,Att/G,Yds,Avg,Yds/G,TD,Lng,1st,1st%,20+,40+,FUM"
        );
        done();
      });
  });

  it("400 - filterField Invalid", (done) => {
    chai
      .request(server)
      .get("/csv?" + generateParams({ filterField: "err" }))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("400 - filterAsc Invalid", (done) => {
    chai
      .request(server)
      .get("/csv?" + generateParams({ filterField: "err" }))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("400 - filterLimit Invalid", (done) => {
    chai
      .request(server)
      .get("/csv?" + generateParams({ filterLimit: "1" }))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("200 - offset Out-Of-Bounds", (done) => {
    chai
      .request(server)
      .get("/csv?" + generateParams({ offset: "350" }))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res["text"]).to.be.empty;
        done();
      });
  });

  it("200 - % in playerName filter returns nothing", (done) => {
    chai
      .request(server)
      .get("/csv?" + generateParams({ filterPlayer: "%" }))
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res["text"]).to.be.empty;
        done();
      });
  });
});

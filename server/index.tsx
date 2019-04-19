import * as express from "express";
import * as fs from "fs";
import * as morgan from "morgan";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import ssr from "./ssr";
import getSitemap from "./routes/sitemap";
import getRobotTxt from "./routes/robots";
import getOpenSearchXML from "./routes/openSearchXML";
import setABTest from "./helpers/setABTest";
const compression = require("compression");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const SITEMAP_REGEX = /^\/sitemap(\/sitemap_[0-9]+\.xml)?\/?$/;

const app = express();
app.disable("x-powered-by");
app.use(awsServerlessExpressMiddleware.eventContext({ fromALB: true }));
app.use(cookieParser());
app.use(compression({ filter: shouldCompress }));
app.use(morgan("combined"));

function shouldCompress(req: express.Request, res: express.Response) {
  if (SITEMAP_REGEX.test(req.path)) return false;
  return compression.filter(req, res);
}

app.get(SITEMAP_REGEX, async (req, res) => {
  res.setHeader("Content-Encoding", "gzip");
  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Access-Contrl-Allow-Origin", "*");
  const sitemap = await getSitemap(req.path);
  res.send(sitemap.body);
});

app.get("/robots.txt", (req, res) => {
  res.setHeader("Cache-Control", "max-age=100");
  res.setHeader("Content-Type", "text/plain");
  const body = getRobotTxt(req.headers.host === "scinapse.io");
  res.send(body);
});

app.get("/opensearch.xml", (_req, res) => {
  const body = getOpenSearchXML();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.send(body);
});

app.get("/sw.js", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "sw.js"));
});

app.get("*", async (req, res) => {
  let version = "";
  if (process.env.NODE_ENV === "production") {
    version = fs.readFileSync(path.resolve(__dirname, "./version")).toString("utf8");
  }

  setABTest(req, res);

  try {
    const html = await ssr(req, version);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // TODO: make error page
    res.send("<h1>Something went wrong.</h1>");
  }
});

export default app;

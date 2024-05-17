require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const querystring = require("querystring");
const utils = require("./src/utils");

const port = process.env.APP_PORT || 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === "GET" && parsedUrl.pathname === "/") {
    const filePath = path.join(__dirname, "src", "view", "home.html");

    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error("Error reading home.html:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    });
  } else if (req.method === "POST" && parsedUrl.pathname === "/add-student") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const { name, birth } = querystring.parse(body);
      if (name && birth) {
        try {
          utils.addStudent(name, birth);
        } catch (error) {
          console.error("Error adding student:", error);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
      }
      res.writeHead(302, { Location: "/users" });
      res.end();
    });
  } else if (req.method === "GET" && parsedUrl.pathname === "/users") {
    let students;
    try {
      students = utils.readStudents();
    } catch (error) {
      console.error("Error reading students:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }

    let html =
      '<html><head><link rel="stylesheet" type="text/css" href="/style.css"></head><body>';
    html += "<h1>Liste des étudiants</h1>";
    html += '<div id="div-ul">';
    html += "<ul>";

    students.forEach((student) => {
      html += `<li>${student.name} - ${student.birth} <form style="display:inline" action="/delete-student" method="post"><input type="hidden" name="name" value="${student.name}"><button type="submit">Supprimer</button></form></li>`;
    });

    html += "</ul>";
    html += '<a id="add-link" href="/">Ajouter un autre étudiant</a>';
    html += "</body></html>";

    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end(html);
  } else if (
    req.method === "POST" &&
    parsedUrl.pathname === "/delete-student"
  ) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const { name } = querystring.parse(body);
      if (name) {
        try {
          utils.deleteStudent(name);
        } catch (error) {
          console.error("Error deleting student:", error);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
      }
      res.writeHead(302, { Location: "/users" });
      res.end();
    });
  } else if (req.url === "/style.css") {
    const css = fs.readFileSync(
      path.join(__dirname, "src", "assets", "style.css"),
      { encoding: "utf8" }
    );
    res.writeHead(200, { "Content-Type": "text/css" });
    res.end(css);
  }
});

server.listen(port, () => {
  console.log(
    `Server is running at http://${process.env.APP_LOCALHOST}:${port}/`
  );
});

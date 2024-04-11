const http = require("http");
const { v4: uuidv4 } = require("uuid");
const corsHeader = require("./corsHeader");
const successHandle = require("./successHandle");
const errorHandle = require("./errorHandle");
const todos = [];

const requestListener = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  if (req.url === "/todos" && req.method === "GET") {
    successHandle(res, todos);
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined && title !== "") {
          let todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          successHandle(res, todos);
        } else {
          errorHandle(res);
        }
      } catch {
        errorHandle(res);
      }
    });
  } else if (req.url === "/todos" && req.method === "DELETE") {
    todos.length = 0;
    successHandle(res, todos);
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((ele) => ele.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      successHandle(res, todos);
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        const id = req.url.split("/").pop();
        const index = todos.findIndex((ele) => ele.id === id);
        if (title !== undefined && title !== "" && index !== -1) {
          todos[index].title = title;
          successHandle(res, todos);
        } else {
          errorHandle(res);
        }
      } catch {
        errorHandle(res);
      }
    });
  } else if (req.url === "/todos" && req.method === "OPTIONS") {
    res.writeHead(200, corsHeader);
    res.end();
  } else {
    res.writeHead(404, corsHeader);
    res.write(
      JSON.stringify({
        status: "error",
        message: "not found",
      })
    );
    res.end();
  }
};
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);

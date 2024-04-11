const corsHeader = require("./corsHeader");

function successHandle(res, todos) {
  res.writeHead(200, corsHeader);
  res.write(
    JSON.stringify({
      status: "success",
      data: todos,
    })
  );
  res.end();
}
module.exports = successHandle;

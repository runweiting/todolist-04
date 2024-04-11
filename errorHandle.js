const corsHeader = require("./corsHeader");

function errorHandle(res) {
  res.writeHead(400, corsHeader);
  res.write(
    JSON.stringify({
      status: "error",
      message: "欄位未正確填寫，或無此 todo id",
    })
  );
  res.end();
}
module.exports = errorHandle;

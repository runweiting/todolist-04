## TodoList RESTful API Kata 開發流程

### 1. 建立 node 環境
   - `npm init`

---
### 2. 建立 server.js
   1. 載入 **"http" 核心模組**：指派給變數 http
   3. 建立 **requestListener** 函式：來處理收到的 HTTP 請求 request, response
   2. **http.createServer** 建立 HTTP 伺服器：指派給變數 server，帶入 requestListener 函式
   4. **server.listen** 開始監聽來自使用者的連線請求：透過環境變數 "process.env.PORT" 監聽指定端口，若未指定，則使用預設端口 3005
   5. 建立 **todos 陣列**
   6. 建立、匯入 **successHandle.js**   
      - 建立 response headers
      ```
      res.writeHead(200, headers)
      res.write(JSON.stringify({
         "status": "success",
         "data": todos
      }))
      res.end()
      ```
   7. 建立 **errorHandle.js**
      - 建立 response headers
      ```
      res.writeHead(400, headers)
      res.write(JSON.stringify({
         "status": "false",
         "message": "欄位未填寫正確，或無此 todo id"
      }))
      res.end()
      ```
   8. 載入 **uuidv4 套件**

---
### 3. 撰寫 requestListener 函式
   1. 建立 **response headers**
      ```
      const headers = {
         "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
         "Content-Type": "application/json", // 回傳資料呈現 JSON 格式
      };
      ```
   2. 建立接收資料用的 **body 空字串**
   3. 建立接收資料用的 **request.on 'data' 事件**
      - 將 chunk 累加成 body
   4. 先建立 **GET, OPTIONS, 404** 網路請求
      - if else 判斷 req.url && req.method 接續寫不同功能
   5. 建立 **POST** 網路請求
      1. 建立接收資料用的 **request.on 'end' 事件**
      2. 使用 *try catch* 捕捉異常事件
         - _*try*_
            1. *<span style="color:#54FA80">將字串 body 轉成 JSON 格式，以判斷 request 傳來資料是否為 JSON 格式？</span>*
            2. *<span style="color:#54FA80">if 判斷 body 內的 title 是否有值？</span>*
               - 是
                  1. 建立 todo 物件，內含 title、id 資料
                  2. 將 todo 物件新增至 todos 陣列
                  3. 加入成功的 *response* 內容
            3. else
               - 否
                  執行 `errorHandle(response)`
         - _*catch*_
            執行 `errorHandle(response)`
   6. 建立 **DELETE 刪除所有**的網路請求
      1. 利用 `todos.length = 0` 清除陣列
      2. 加入成功的 *response* 內容
   7. 建立 **DELETE 刪除單筆** 的網路請求
      1. *<span style="color:#54FA80">利用 `startsWith("/todos/")` 判斷是否為指定項目路由？</span>*
      2. 利用 `split('/').pop()` 帶出指定項目路由的 id
      3. 利用 `todos.findIndex(ele => ele.id == id)` 找出指定項目的 index
      4. *<span style="color:#54FA80">if 判斷 index 是否存在？</span>*
         - 是
            1. 利用 `todos.splice(index, 1)` 刪除指定項目
            2. 加入成功的 *response* 內容
      5. else
         - 否
            執行 `errorHandle(response)`
   8. 建立 **PATCH 編輯單筆** 網路請求
      1. *<span style="color:#54FA80">利用 `startsWith("/todos/")` 判斷是否為指定項目路由？</span>*
      2. 建立接收資料用的 **request.on 'end' 事件**
      3. 使用 *try catch* 捕捉異常事件
         - _*try*_
            1. *<span style="color:#54FA80">將字串 body 轉成 JSON 格式，以判斷 request 傳來資料是否為 JSON 格式？</span>*
            2. 利用 `split('/').pop()` 帶出指定項目路由的 id
            3. 利用 `todos.findIndex(ele => ele.id == id)` 找出指定項目的 index
            4. *<span style="color:#54FA80">if 判斷 body 內的 title 是否有值？ && index 是否存在？</span>*
               - 是
                  1. `todos[index].title = title` 修正 title
                  2. 加入成功的 *response* 內容
            5. else
               - 否
                  執行 `errorHandle(response)`
         - _*catch*_
            執行 `errorHandle(response)`

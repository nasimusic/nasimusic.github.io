<template>
  <div id="app">
    <div class="left_color"></div>
    <section class="left_content">
      <div>
        <img src="./assets/logo.png" width="169px">
        <div style="margin-top:15px">致力于打造区块链音乐、配乐、音效版权确权服务</div>
        <div>将您上传的音乐进行MD5，并且同时间戳一起登记到星云链上</div>
        <div class="add_content_title">
          <img src="./assets/add.png" width="28px">
          <span>版权登记 Create copyright</span>
        </div>
        <div class="from">
          <input type="text" placeholder="起一个音乐的名字吧" class="input_name">
          <textarea placeholder="填写音乐备注"></textarea>
          <div class="md5update">
            <span>点击上传音乐</span>
            <img src="./assets/md5.png" width="59px">
            <input type="file">
          </div>
          <button>开始登记</button>
        </div>
      </div>
    </section>
    <section class="right_content">
      <div>
        <div class="query_content_title">
          <img src="./assets/query.png" width="26px">
          <span>查询版权  Query copyright</span>
        </div>
        <div class="from">
          <input type="text" placeholder="请输入版权ID" class="input_name">
          <button id="right_button">开始登记</button>
        </div>
        <div class="result_wrap">
          <div>查询结果：</div>
          <div class="result_title">
            <span class="result_left_text">作者</span>
            <span class="author_name result_right_text">王星云</span>
          </div>
          <div class="result_content">
            <div class="result_content_id">
              <span class="result_left_text">版权ID</span>
              <span class="result_right_text">64352</span>
            </div>
            <div class="result_content_des">
              <span class="result_left_text">音乐备注</span>
              <span class="result_right_text result_content_des_content">原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx</span>
            </div>
          </div>
        </div>
        <div class="tag">注：请先安装Chrome Nebulas-WebExtensionWallet钱包插件</div>
      </div>
    </section>
  </div>
</template>

<script>


export default {
  name: 'app',
  data () {
    return {
      addName: '',
      addAmt: '',
      addDes: '',
      findId: '',
      nowAmt: '',
      nowId: '',
      nowDes: '',
      hasResult: false
    }
  },
  methods: {
    addFun() {
      if(this.addName == '' || this.addAmt == '' || this.addDes == '') {
        alert('数据填写不完整')
      } else {
        let no = Number(Math.random().toString().substr(3,0) + Date.now()).toString(36)
        let callArgs = '["' + no + '","' + this.addName + '","' + this.addDes + '","' + this.addAmt + '"]'
        saveFun(callArgs,no);
      }
    },
    getFun() {
      if(this.findId == '') {
        alert('数据填写不完整')
      } else {
        var from = Account.NewAccount().getAddressString(),
          value = "0",
          nonce = "0",
          gas_price = "1000000",
          gas_limit = "2000000",
          callFunction = "get",
          callArgs = "[\"" + this.findId + "\"]",
          contract = {
            "function": callFunction,
            "args": callArgs
          };
        neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then( (resp) => {
          dealResult(resp, this)
        }).catch( (err) => {
          alert("error:" + err.message)
        })
      }
    }
  }
}

function saveFun(callArgs,no) {
  let to = dappAddress,
    value = "0",
    callFunction = "save";

  window.serialNumber = nebPay.call(to, value, callFunction, callArgs, {
    listener: cbPush
  });

  window.intervalQuery = setInterval(function () {
    funcIntervalQuery(no);
  }, 1500);
}

function cbPush(resp) {
  console.log("response of push: " + JSON.stringify(resp))
}

function funcIntervalQuery(no) {
  nebPay.queryPayInfo(window.serialNumber)
    .then(function (resp) {
      var respObject = JSON.parse(resp)
      if (respObject.code === 0) {
        alert('添加成功,您的ID为'+ no);
        clearInterval(window.intervalQuery)
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

function dealResult(resp, _this) {
  let result = JSON.parse(resp.result)

  _this.nowId = result.no
  _this.nowDes = result.des
  _this.nowAmt = result.amt

  _this.hasResult = true
}

</script>

<style>
* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

html, body{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  background-color: rgb(249,249,249);
  width: 100%;
  min-width: 1366px;
  min-height: 100%;
  margin: 0;
  padding: 0;
  position: relative;
}

#app:after {
  content: '';
  display: block;
  clear: both;
}

.left_color {
  background-color: #10D2A2;
  position: absolute;
  width: 50%;
  top: 0px;
  left: 0px;
  min-height: 100%;
}

.left_content {
  width: 50%;
  float: left;
  min-height: 100%;
  position: relative;
}
.left_content:after {
  content: '';
  display: block;
  clear: both;
}
.left_content>div{
  width: 500px;
  float: right;
  margin-right: 100px;
  margin-top: 60px;
}

.add_content_title {
  margin-top: 60px;
  height: 28px;
}
.add_content_title img {
  float: left;
}
.add_content_title span {
  line-height: 32px;
  margin-left: 15px;
  float: left;
}
.from {
  width: 350px;
  margin-top: 60px;
}

.input_name {
  width: 100%;
  height: 40px;
  outline: none;
  border: none;
  font-size: 14px;
  padding-left: 20px;
}

.from textarea {
  margin-top: 20px;
  width: 100%;
  height: 130px;
  outline: none;
  border: none;
  font-size: 14px;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 0px;
}

.md5update {
  width: 100%;
  height: 90px;
  background-color: #fff;
  position: relative;
  color: #777;
  font-size: 14px;
  user-select: none;
  margin-top: 16px;
}

.md5update span {
  position: absolute;
  top: 10px;
  left: 20px;
}

.md5update img {
  position: absolute;
  left: 145.5px;
  top: 15.5px;
}

.md5update input {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 0;
  cursor: pointer;
}

.from button {
  width: 100%;
  height: 46px;
  border-radius: 5px;
  background-color: #B8E986;
  outline: none;
  border: none;
  margin-top: 20px;
  font-size: 16px;
  color: #777;
  cursor: pointer;
}

.from button:hover {
  opacity: .7;
}

.right_content {
  width: 50%;
  float: right;
  min-height: 100%;
  position: relative;
}
.right_content:after {
  content: '';
  display: block;
  clear: both;
}

.right_content>div {
  width: 500px;
  float: left;
  margin-left: 100px;
  margin-top: 230px;
  color: #777;
}
.query_content_title img {
  float: left;
}
.query_content_title span {
  line-height: 32px;
  margin-left: 15px;
  float: left;
}

#right_button {
  border: 1px solid #eee;
  background-color: #fff;
}

.result_wrap {
  margin-top: 40px
}

.result_title {
  background-color: #fff;
  height: 60px;
  width: 414px;
  line-height: 60px;
  margin-top: 5px;
  border-bottom: 1px solid #e0e0e0;
}

.result_left_text {
  float: left;
  margin-left: 20px;
}

.result_right_text {
  float: right;
  margin-right: 20px;
}

.author_name {
  font-size: 22px;
  font-weight: bold;
}

.result_content {
  background-color: #fff;
  font-size: 14px;
  padding-top: 20px;
  min-height: 130px;
  width: 414px;
  border-bottom: 1px solid #e0e0e0;
}

.result_content_id:after {
  content: '';
  display: block;
  clear: both;
}

.result_content_des {
  margin-top: 20px;
  margin-bottom: 20px;
}

.result_content_des:after {
  content: '';
  display: block;
  clear: both;
}

.result_content_des_content {
  display: inline-block;
  width: 250px;
}

.tag {
  margin-top: 40px !important;
  font-size: 12px;
}
</style>

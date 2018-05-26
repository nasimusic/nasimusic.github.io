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
          <input type="text" placeholder="起一个音乐的名字吧" class="input_name" v-model="addName">
          <textarea placeholder="填写音乐备注" v-model="addDes"></textarea>
          <div class="md5update">
            <span v-if="!uploaded">点击上传音乐</span>
            <img v-if="!uploaded" src="./assets/md5.png" width="59px">
            <input v-if="!uploaded" type="file" accept="audio/*" ref="musicFile" @change="uploadMusic">
            <span class="uploaded" @click="reupload" v-if="uploaded">上传成功，点击重新上传</span>
          </div>
          <button @click="addFun">
            <span v-if="isOnload">正在上传，请稍等...</span>
            <span v-else>开始登记</span>
          </button>
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
          <input type="text" placeholder="请输入版权ID（测试：jheyk454）" class="input_name" v-model="findId">
          <button id="right_button" @click="getFun('get')">开始查询</button>
        </div>
        <div class="result_wrap" v-show="hasResult">
          <div>查询结果：</div>
          <div class="result_title">
            <span class="result_left_text">作者</span>
            <span class="author_name result_right_text">{{nowAuthor}}</span>
          </div>
          <div class="result_content">
            <div class="result_content_id">
              <span class="result_left_text">音乐名</span>
              <span class="result_right_text">{{nowName}}</span>
            </div>
            <div class="result_content_id" style="margin-top:20px;">
              <span class="result_left_text">音乐MD5</span>
              <span class="result_right_text">{{nowMd5}}</span>
            </div>
            <div class="result_content_des">
              <span class="result_left_text">音乐备注</span>
              <span class="result_right_text result_content_des_content">{{nowDes}}</span>
            </div>
          </div>
        </div>
        <div class="tag">注：请先安装<a style="color: #62aec7" href="https://github.com/ChengOrangeJu/WebExtensionWallet" target="_blank">Chrome Nebulas-WebExtensionWallet</a>钱包插件</div>
      </div>
    </section>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  name: 'app',
  data () {
    return {
      addName: '',
      addDes: '',
      addMd5: '',
      uploaded: false,
      findId: '',
      nowName: '',
      nowAuthor: '王星云',
      nowMd5: '487f7b22f68312d2c1bbc93b1aea445b',
      nowDes: '原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx',
      hasResult: false,
      isOnload: false
    }
  },
  mounted() {
    window._this = this;
  },
  methods: {
    uploadMusic() {
      let music = this.$refs.musicFile.files[0]
      this.addMd5 = ''
      this.addMd5 = CryptoJS.MD5(music).toString()
      this.uploaded = true
    },
    reupload() {
      this.addMd5 = ''
      this.uploaded = false
    },
    addFun() {
      if(this.addName == '' || this.addDes == '' || this.addMd5 == '') {
        alert('数据填写不完整')
      } else {
        let no = Number(Math.random().toString().substr(3,0) + Date.now()).toString(36)
        let callArgs = '["' + no + '","' + this.addName + '","' + this.addDes + '","' + this.addMd5 + '"]'
        this.isOnload = true
        saveFun(callArgs,no,this)
      }
    },
    getFun(no,callback) {
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
          if(callback) {
            callback()
          }
          if(no == 'get') {
            if(resp.result == '' || resp.result == 'null' || resp.result == null) {
              alert("error: id为'" + this.findId + "'的数据不存在，请检查是否填写错误")
            }
          }
        })
      }
    }
  }
}

function saveFun(callArgs,no,_this) {
  let to = dappAddress,
    value = "0",
    callFunction = "save";

  window.no = no
  window.serialNumber = nebPay.call(to, value, callFunction, callArgs, {
    listener: cbPush
  });

}

function cbPush(resp) {
  window.intervalQuery = setInterval(function () {
    funcIntervalQuery(resp);
  }, 5000);
}

function funcIntervalQuery(resp) {
  window._this.$http.post('https://mainnet.nebulas.io/v1/user/getTransactionReceipt', {
    hash: resp.txhash
  }).then(res => {
    if (res.data.result.status === 1) {
      window._this.findId = window.no
      alert('添加成功，id为' + window.no + '，请您妥善保存')
      window._this.isOnload = false
      clearInterval(window.intervalQuery)
    }
  })
}

function dealResult(resp, _this) {
  let result = JSON.parse(resp.result)
  if(result != null)  {
    _this.nowMd5 = result.md5
    _this.nowDes = result.des
    _this.nowAuthor = result.borrower
    _this.nowName = result.name

    _this.hasResult = true
  } else {
    _this.hasResult = false
  }
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

.uploaded {
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: inline-block;
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
  margin-top: 246px;
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
  font-size: 15px;
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
  text-align: right;
}

.tag {
  margin-top: 40px !important;
  font-size: 12px;
}
</style>

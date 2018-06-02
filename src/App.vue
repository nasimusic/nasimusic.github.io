<template>
  <div id="app">
    <div class="left_color" v-if="!isHelp"></div>
    <section class="left_content" v-if="!isHelp">
      <div>
        <img src="./assets/logo.png" width="169px">
        <div style="margin-top:15px">——您的版权确权管家</div>
        <div>将您的版权证书及公证信息上链，并且同时间戳一起登记到星云链上。</div>
        <div class="isHelptoggle" @click="isHelptoggle">使用教程&联系我们</div>
        <div class="add_content_title">
          <img src="./assets/add.png" width="28px">
          <span>版权登记 Create copyright</span>
        </div>
        <div class="from">
          <input type="text" placeholder="填写版权的名字" class="input_name" v-model="addName">
          <div class="input_kind_wrap" @click="choiceKind">
            <input type="text" placeholder="选择版权类型" class="input_kind" v-model="addKind" readonly>
            <span class="input_kind_span">点击选择 ></span>
            <div class="choice_kind_wrap" v-if="choiceKindShow">
              <span v-for="kindItem in choiceKindArr" @click.stop="choiceKindClick(kindItem)" :key="kindItem">{{kindItem}}</span>
            </div>
          </div>
          <textarea placeholder="填写版权备注" v-model="addDes"></textarea>
          <div class="md5update">
            <span v-if="!uploaded">点击上传版权文件</span>
            <img v-if="!uploaded" src="./assets/md5.png" width="59px">
            <input v-if="!uploaded" type="file" accept="image/*" ref="musicFile" @change="uploadMusic">
            <span class="uploaded" @click="reupload" v-if="uploaded">上传成功，点击重新上传</span>
          </div>
          <button @click="addFun">
            <span v-if="isOnload">正在上传，请稍等...</span>
            <span v-else>开始登记</span>
          </button>
        </div>
      </div>
    </section>
    <section class="right_content" v-if="!isHelp">
      <div>
        <div class="query_content_title">
          <img src="./assets/query.png" width="26px">
          <span>查询版权  Query copyright</span>
        </div>
        <div class="from">
          <input type="text" placeholder="请输入版权ID（测试：jhxc5z95）" class="input_name" v-model="findId">
          <button id="right_button" @click="getFun('get')">开始查询</button>
        </div>
        <div class="result_wrap" v-show="hasResult">
          <div>查询结果：</div>
          <div class="result_title">
            <span class="result_left_text">认证主体</span>
            <span class="author_name result_right_text">{{nowAuthor}}</span>
          </div>
          <div class="result_content">
            <div class="result_content_id">
              <span class="result_left_text">版权ID</span>
              <span class="result_right_text">{{nowName}}</span>
            </div>
            <div class="result_content_des">
              <span class="result_left_text">版权备注</span>
              <span class="result_right_text result_content_des_content">{{nowDes}}</span>
            </div>
            <img :src="nowBase64">
          </div>
        </div>
        <div class="tag">注：请先安装<a style="color: #62aec7" href="https://github.com/ChengOrangeJu/WebExtensionWallet" target="_blank">Chrome Nebulas-WebExtensionWallet</a>钱包插件</div>
      </div>
    </section>

    <div class="help_wrap" v-if="isHelp">
      <section class="left_content">
        <div>
          <img src="./assets/logo.png" width="169px">
          <div style="margin-top:15px">——您的版权确权管家</div>
          <div>将您的版权证书及公证信息上链，并且同时间戳一起登记到星云链上。</div>
          <div class="isHelptoggle" @click="isHelp = false">返回首页</div>
          <div class="title">简介</div>
          <div class="content">版权管家，致力于打造区块链美术作品版权登记、文字作品版权登记、音乐作品登记、摄影作品登记、工程作品登记、影视作品登记、软件著作权登记版权确权服务，是基于星云链开发的区块链项目。利用区块链技术不可篡改的特性，通过智能合约将原创作者的版权信息上链，仅需一分钟，您就能将您的版权文件在区块链上登记，版权文件不可篡改，由全网共同见证，并永久保存在星云链中。</div>
          <div class="content">无论您的是在哪个版权中心进行的认证，公证信息上链后，我们保证公证结果的真实，并对公证结果加密，不会让公证结果被篡改致力于打造，一个公证的权威平台，对公证结果绝对真实，安全，可靠，防止篡改。</div>
        </div>
      </section>
      <section class="right_content" id="helpright">
        <div>
          <div class="title">使用教程</div>
          <div class="content">版权登记：填写说明</br>
1、输入认证主体名称，可以为个人也可以为企业名称，但需要和版权文件名称一致； </br>
2、上传版权文件一栏，您可以输入公证机关的出具的版权确权文件，JPG格式文件(例如：软件注册权证书等)。</div>
          <div class="content">查询版权：所有已经上链的版权信息，都会生成一个查询ID，请记录好对应的ID，进行信息查询；（测试ID为：jhxc5z95）</div>
          <div class="title">联系我们</div>
          <div class="content">
            使用及共创请联系</br>
邮箱：1287150642@qq.com</br>
QQ:1287150642
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  name: 'app',
  data () {
    return {
      addName: '',
      addKind: '',
      addDes: '',
      addMd5: '',
      uploaded: false,
      findId: '',
      nowName: '',
      isHelp: false,
      choiceKindShow: false,
      nowAuthor: '王星云',
      nowBase64: '',
      nowMd5: '487f7b22f68312d2c1bbc93b1aea445b',
      nowDes: '原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx原创版权音乐，欢迎合作，合作加微信xxxxxxxxxxxxx',
      hasResult: false,
      isOnload: false,
      choiceKindArr: ['美术作品版权登记', '文字作品版权登记', '音乐作品版权登记', '摄影作品版权登记', '工程作品版权登记', '影视作品版权登记', '软件著作权登记']
    }
  },
  mounted() {
    window._this = this;
  },
  methods: {
    isHelptoggle() {
      this.isHelp = true
    },
    choiceKind() {
      this.choiceKindShow = true
    },
    choiceKindClick(i) {
      this.addKind = i
      this.choiceKindShow = false
    },
    uploadMusic() {
      let music = this.$refs.musicFile.files[0]
      if(music.size / 1024 > 20) {
        alert('抱歉当前最大支持图片为20k，建议去https://tinypng.com/上进行压缩')
        return
      } 
      let fr = new FileReader()
      fr.readAsDataURL(music);
      fr.onload = (e) => {
        let image = new Image()
        image.src = e.target.result
        image.onload = () => {
          this.addMd5 = ''
          this.addMd5 = image2Base64(image)
          this.uploaded = true
        }
      }
    },
    reupload() {
      this.addMd5 = ''
      this.uploaded = false
    },
    addFun() {
      if(this.addName == '' || this.addDes == '' || this.addMd5 == '' || this.addKind == '') {
        alert('数据填写不完整')
      } else {
        let no = Number(Math.random().toString().substr(3,0) + Date.now()).toString(36)
        let callArgs = '["' + no + '","' + this.addName + '","' + this.addKind + '","' + this.addDes + '","' + this.addMd5 + '"]'
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

function image2Base64(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
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
    _this.nowBase64 = result.base64

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
  margin-top: 40px;
}

.input_name {
  margin-top: 20px;
  width: 100%;
  height: 40px;
  outline: none;
  border: none;
  font-size: 14px;
  padding-left: 20px;
}

.input_kind_wrap {
  margin-top: 20px;
  width: 100%;
  height: 40px;
  font-size: 14px;
  position: relative;
}

.input_kind {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 14px;
  padding-left: 20px;
  cursor: pointer;
}

.input_kind_span {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #a7a7a7;
  user-select: none;
  cursor: pointer;
}

.choice_kind_wrap {
  width: 100%;
  height: 160px;
  background-color: #fff;
  box-shadow: 0px 0px 10px #616161;
}

.choice_kind_wrap span {
  color: #7b7b7b;
  margin-top: 15px;
  margin-left: 40px;
  display: inline-block;
  user-select: none;
  cursor: pointer;
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
  font-size: 14px;
  font-weight: bold;
}

.result_content {
  background-color: #fff;
  font-size: 14px;
  padding-top: 20px;
  min-height: 130px;
  width: 414px;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
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

.result_content>img {
  text-align: center;
  margin-bottom: 10px;
}

.tag {
  margin-top: 40px !important;
  font-size: 12px;
}

.isHelptoggle {
  display: inline-block;
  margin-top: 20px;
  background: #fff;
  border-radius: 3px;
  color: #616161;
  padding: 5px 10px;
  cursor: pointer;
  user-select: none;
}
.isHelptoggle:hover {
  opacity: .7;
}

.help_wrap {
  background-color: #10D2A2;
  width: 100%;
  min-height: 100%;
  position: absolute;
}

.title {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
  color: #fff;
  font-weight: bold;
}

.content {
  margin-bottom: 20px;
  color: #fff;
}

#helpright>div {
  margin-top: 140px;
}

@media screen and (max-width: 660px) {
  #app {
    min-width: 100%;
  }
  .left_color {
    width: 100%;
  }
  .left_content {
    width: 100%;
    float: left;
  }
  .left_content>div {
    width: 100%;
    float: left;
    margin-right: 0px;
    margin-left: 0px;
    padding: 20px;
  }
  .from {
    width: 100%;
  }
  .right_content {
    width: 100%;
    float: left;
  }
  .right_content>div {
    width: 100%;
    margin-left: 0px;
    margin-top: 30px;
    padding: 20px;
  }
  .result_title {
    width: 100%;
  }
  .result_content {
    width: 100%;
  }
  .tag {
    display: none;
  }
  #helpright>div {
    margin-top: 20px;
  }
}


</style>

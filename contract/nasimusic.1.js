"use strict";

var ImusicItem = function(res) {
  if(res) {
    var obj = JSON.parse(res)
    this.no = obj.no
    this.name = obj.name
    this.des = obj.des
    this.kind = obj.kind
    this.base64 = obj.base64
    this.borrower = obj.borrower
  } else {
    this.no = ""
    this.name = ""
    this.kind = ""
    this.des = ""
    this.base64 = ""
    this.borrower = ""
  }
};

ImusicItem.prototype = {
  toString: function() {
    return JSON.stringify(this)
  }
}

var NasImusic = function() {
  LocalContractStorage.defineMapProperty(this, "repo", {
    parse: function (res) {
      return new ImusicItem(res)
    },
    stringify: function (o) {
      return o.toString()
    }
  }); 
}

NasImusic.prototype = {
  init: function() {},

  // 保存
  save: function(no, name, kind, des, base64) {
    no = no.trim()
    name = name.trim()
    des = des.trim()
    kind = kind.trim()
    base64 = base64.trim()
    var from = Blockchain.transaction.from;
    var imusicItem = this.repo.get(no);
    
    if(imusicItem) {
      throw new Error("当前版权已经存在");
    }

    imusicItem = new ImusicItem();
    imusicItem.no = no
    imusicItem.name = name
    imusicItem.des = des
    imusicItem.base64 = base64
    imusicItem.kind = kind
    imusicItem.borrower = from

    this.repo.put(no, imusicItem);

  },

  // 取得
  get: function(no) {
    no = no.trim();
    if ( no === "" ) {
      //return this.repo.get();
      throw new Error("empty no")
    }

    return this.repo.get(no);
  },

  // 版权更改
  update: function(no, name, kind, des, base64) {
    no = no.trim()
    name = name.trim()
    des = des.trim()
    kind = kind.trim()
    base64 = base64.trim()
    var from = Blockchain.transaction.from;
    var imusicItem = this.repo.get(no);
    
    if(imusicItem) {
      throw new Error("当前版权未存在");
    }

    imusicItem.name = name
    imusicItem.des = des
    imusicItem.base64 = base64
    imusicItem.kind = kind

    this.repo.put(no, imusicItem);
  },

  //  版权转让
  change: function(no, borrower, to) {
    no = no.trim()
    borrower = borrower.trim()
    to = to.trim()
    var from = Blockchain.transaction.from;
    var imusicItem = this.repo.get(no);
    
    if(imusicItem) {
      throw new Error("当前版权未存在");
    }
    
    if(imusicItem.borrower != borrower) {
      throw new Error("当前操作者无权限")
    }

    imusicItem.borrower = to

    this.repo.put(no, imusicItem);
  }
}

module.exports = NasImusic;
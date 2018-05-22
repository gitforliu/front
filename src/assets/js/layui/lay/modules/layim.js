/**

 @Name：layim v3.7.2 Pro 商用版
 @Author：贤心
 @Site：http://layim.layui.com
 @License：LGPL
 @新增参数 inset  0：正常嵌入  1：内嵌 2：其它嵌入方式
 */
 
layui.define(['layer', 'laytpl', 'upload'], function(exports){
  
  var v = '3.7.2 Pro';
  var $ = layui.$;
  var layer = layui.layer;
  var laytpl = layui.laytpl;
  var device = layui.device();
  var msgTimer = null;
  
  var SHOW = 'layui-show', THIS = 'layim-this', MAX_ITEM = 20;
  
  //回调
  var call = {};
  
  //对外API
  var LAYIM = function(){
    this.v = v;
    $('body').on('click', '*[layim-event]', function(e){
      var othis = $(this), methid = othis.attr('layim-event');
      events[methid] ? events[methid].call(this, othis, e) : '';
    });
  };
  
  //基础配置
  LAYIM.prototype.config = function(options){
    var skin = [];
    layui.each(Array(5), function(index){
      skin.push(layui.cache.dir+'css/modules/layim/skin/'+ (index+1) +'.jpg')
    });
    options = options || {};
    options.skin = options.skin || [];
    layui.each(options.skin, function(index, item){
      skin.unshift(item);
    });
    options.skin = skin;
    options = $.extend({
      isfriend: !0
      ,isgroup: !0
      ,voice: 'default.mp3'
      ,inset:false
    }, options);
    if(!window.JSON || !window.JSON.parse) return;
    init(options);
    return this;
  };
  
  //监听事件
  LAYIM.prototype.on = function(events, callback){
    if(typeof callback === 'function'){
      call[events] ? call[events].push(callback) : call[events] = [callback];
    }
    return this;
  };

  //获取所有缓存数据
  LAYIM.prototype.cache = function(){
    return cache;
  };
  
  //打开一个自定义的会话界面
  LAYIM.prototype.chat = function(data){
    if(!window.JSON || !window.JSON.parse) return;
    return popchat(data), this;
  };
  
  //设置聊天界面最小化
  LAYIM.prototype.setChatMin = function(){
    return setChatMin(), this;
  };
  
  //设置当前会话状态
  LAYIM.prototype.setChatStatus = function(str){
    var thatChat = thisChat();
    if(!thatChat) return;
    var status = thatChat.elem.find('.layim-chat-status');
    return status.html(str), this;
  };
  
  //接受消息
  LAYIM.prototype.getMessage = function(data,inset){
  	if(typeof(inset) == 'undefined'){
  		inset = 0;
  	}
    return getMessage(data,inset), this;
  };
  
  //桌面消息通知
  LAYIM.prototype.notice = function(data){
    return notice(data), this;
  };
  
  //打开添加好友/群组面板
  LAYIM.prototype.add = function(data){
    return popAdd(data), this;
  };
  
  //好友分组面板
  LAYIM.prototype.setFriendGroup = function(data){
    return popAdd(data, 'setGroup'), this;
  };
  
  //消息盒子的提醒
  LAYIM.prototype.msgbox = function(nums){
    return msgbox(nums), this;
  };
  
  //添加好友/群
  LAYIM.prototype.addList = function(data){
    return addList(data), this;
  };
  
  //删除好友/群
  LAYIM.prototype.removeList = function(data){
    return removeList(data), this;
  };

  //清空列表
  LAYIM.prototype.removeListAll = function(id){
    return removeListAll(id), this;
  };

  //设置好友在线/离线状态
  LAYIM.prototype.setFriendStatus = function(id, type){
    var list = $('.layim-friend'+ id);
    list[type === 'online' ? 'removeClass' : 'addClass']('layim-list-gray');
  };

  //解析聊天内容
  LAYIM.prototype.content = function(content){
    return layui.data.content(content);
  };


  //主模板
  var listTpl = function(options){
    var nodata = {
      friend: "该分组下暂无好友"
      ,group: "暂无群组"
      ,history: "暂无历史会话"
    };

    options = options || {};
    options.item = options.item || ('d.' + options.type);

    return ['{{# var length = 0; layui.each('+ options.item +', function(i, data){ length++;  if(data.more ==1){ }}'
      ,'<li class="layim-more" layim-event="immore" id="layim-'+ options.type +'{{ data.id }}">点击加载更多用户</li>'
      ,'{{# } else{ }}'
      ,'<li class="userlist {{# if(data.class_name){}}{{data.class_name}}{{# } }}" {{# if(data.groupid == 4){}} layim-event="iframe_v" {{# }else{ }} layim-event="chat" {{# } }} data-type="'+ options.type +'" data-index="{{ '+ (options.index||'i') +' }}" id="layim-'+ options.type +'{{ data.id }}"><img src="{{# var url = data.avatar; }}{{url}}"><div class="name"><span>{{ data.username||data.groupname||data.name||"佚名" }}</span> {{# if(data.me_level>500 && data.level != 500 && data.level != 900 && data.level != 2000){ var datauid = "("+data.id.split("-")[1]+")" }} {{ datauid }}  {{# } }} </div><p class="act">{{# if(data.title >= 0){}}<a class="userRand userRand{{data.title }}" href="javascript:">{{# if(data.level==500){ }}<i class="teacher"></>{{#}else if(data.level==900){}}<i class="admin"></i>{{#}else if(data.level ==2000){}}<i class="shi"></i>{{#}else if(data.level ==4000){}}<i class="tuan"></i>{{#}else{}}<i class="rank{{data.title}}"></i>{{#}}}</a>{{# } }}{{# if(data.ip  && data.me_level >= roompara.user_info_level){ }}<s class="em2" title="真实用户"></s>{{# } }}{{# if(data.ch  && data.me_level >= roompara.user_info_level){ }}<s class="em1" title="推广用户"></s>{{# } }} {{# if(data.is_mobile ==1){ }}<s class="phone_user h5_user" title="手机用户"></s>{{# } }} {{# if(data.is_mobile ==2){ }}<s class="phone_user android_user" title="安卓用户"></s>{{# } }} {{# if(data.is_mobile ==3){ }}<s class="phone_user apple_user" title="苹果用户"></s>{{# } }} {{# if(data.ip  && ((data.me_level>= roompara.user_info_level && data.level<500) || data.me_level==6000)){ }}<span class="ip_zone">{{data.zone}}</span>{{# } }}</p></li>'
    ,'{{# } }); if(length === 0){ }}'
      ,'<li class="layim-null">'+ (nodata[options.type] || "暂无数据") +'</li>'
    ,'{{# } }}'].join('');
  };

  var elemTpl = ['<div class="layui-layim-main">'
    ,'<div class="layui-layim-info">'
      ,'<div class="layui-layim-user">{{ d.mine.username }}</div>'
      ,'{{# if(d.mine.level >=900){ }}'
      ,'<div class="layui-layim-status">'
        ,'{{# if(d.mine.status === "online"){ }}'
        ,'<span class="layui-icon layim-status-online" layim-event="status" lay-type="show">&#xe617;</span>'
        ,'{{# } else if(d.mine.status === "hide") { }}'
        ,'<span class="layui-icon layim-status-hide" layim-event="status" lay-type="show">&#xe60f;</span>'
        ,'{{# } }}'
        ,'<ul class="layui-anim layim-menu-box">'
          ,'<li {{d.mine.status === "online" ? "class=layim-this" : ""}} layim-event="status" lay-type="online"><i class="layui-icon">&#xe618;</i><cite class="layui-icon layim-status-online">&#xe617;</cite>在线</li>'
          ,'<li {{d.mine.status === "hide" ? "class=layim-this" : ""}} layim-event="status" lay-type="hide"><i class="layui-icon">&#xe618;</i><cite class="layui-icon layim-status-hide">&#xe60f;</cite>隐身</li>'
        ,'</ul>'
      ,'</div>'
      ,'{{# } }}'
    ,'</div>'
    ,'<ul class="layui-unselect layui-layim-tab{{# if(!d.base.isfriend || !d.base.isgroup){ }}'
      ,' layim-tab-two'
    ,'{{# } }}">'
      ,'<li class="layui-icon'
      ,'{{# if(!d.base.isfriend){ }}'
      ,' layim-hide'
      ,'{{# } else { }}'
      ,' layim-this'
      ,'{{# } }}'
      ,'" title="联系人" layim-event="tab" lay-type="friend">&#xe612;</li>'
      ,'<li class="layui-icon'
      ,'{{# if(!d.base.isgroup){ }}'
      ,' layim-hide'
      ,'{{# } else if(!d.base.isfriend) { }}'
      ,' layim-this'
      ,'{{# } }}'
      ,'" title="群组" layim-event="tab" lay-type="group">&#xe613;</li>'
      ,'<li class="layui-icon" title="历史会话" layim-event="tab" lay-type="history">&#xe611;</li>'
    ,'</ul>'
    ,'<ul class="layui-unselect layim-tab-content {{# if(d.base.isfriend){ }}layui-show{{# } }} layim-list-friend">'
    ,'{{# layui.each(d.friend, function(index, item){ var spread = d.local["spread"+index]; }}'
      ,'<li {{# if(item.id == 4){ }} class="vritual_chat_li" {{# } }}>'
        ,'<h5 layim-event="spread" lay-type="{{ spread }}"><i class="layui-icon">{{# if(spread === "true"){ }}&#xe61a;{{# } else {  }}&#xe602;{{# } }}</i><span>{{ item.groupname||"未命名分组"+index }}</span><em>(<cite {{# if(index >0){ }} class="layim-count" {{# } }} id="im_user_num{{index}}" > {{ (0) }}</cite>)</em></h5>'
        ,'<ul class="layui-layim-list {{# if(item.id == 4){ }}'
        ,'layui-layim-list-vritual'
        ,'{{# } }}'
        ,' {{# if(spread === "true"){ }}'
        ,'layui-show'
        ,'{{# } }}">'
        ,listTpl({
          type: "friend"
          ,item: "item.list"
          ,index: "index"
        })
        ,'</ul>'
      ,'</li>'
    ,'{{# }); if(d.friend.length === 0){ }}'
      ,'<li><ul class="layui-layim-list layui-show"><li class="layim-null">暂无联系人</li></ul>'
    ,'{{# } }}'
    ,'</ul>'
    ,'<ul class="layui-unselect layim-tab-content {{# if(!d.base.isfriend && d.base.isgroup){ }}layui-show{{# } }}">'
      ,'<li>'
        ,'<ul class="layui-layim-list layui-show layim-list-group">'
        ,listTpl({
          type: 'group'
        })
        ,'</ul>'
      ,'</li>'
    ,'</ul>'
    ,'<ul class="layui-unselect layim-tab-content  {{# if(!d.base.isfriend && !d.base.isgroup){ }}layui-show{{# } }}">'
      ,'<li>'
        ,'<ul class="layui-layim-list layui-show layim-list-history">'
        ,listTpl({
          type: 'history'
        })
        ,'</ul>'
      ,'</li>'
    ,'</ul>'
    ,'<ul class="layui-unselect layim-tab-content">'
      ,'<li>'
        ,'<ul class="layui-layim-list layui-show" id="layui-layim-search"></ul>'
      ,'</li>'
    ,'</ul>'
    ,'<ul class="layui-unselect layui-layim-tool">'
      ,'<li class="layui-icon groupbtn" title="群发" id="groupbtn" style="display:none"></li>'
      ,'<li class="layui-icon layim-tool-search" layim-event="search" title="搜索">&#xe615;</li>'
      ,'{{# if(d.base.msgbox){ }}'
      ,'<li class="layui-icon layim-tool-msgbox" layim-event="msgbox" title="消息盒子">&#xe645;<span class="layui-anim"></span></li>'
      ,'{{# } }}'
      ,'{{# if(d.base.find){ }}'
      ,'<li class="layui-icon layim-tool-find" layim-event="find" title="查找">&#xe608;</li>'
      ,'{{# } }}'
      ,'<li class="layui-icon layim-tool-skin" layim-event="skin" title="更换背景">&#xe61b;</li>'
      ,'{{# if(!d.base.copyright){ }}'
      ,'<li class="layui-icon layim-tool-about" layim-event="about" title="关于">&#xe60b;</li>'
      ,'{{# } }}'
    ,'</ul>'
    ,'<div class="layui-layim-search"><input><label class="layui-icon" layim-event="closeSearch">&#x1007;</label></div>'
  ,'</div>'].join('');
  
  //换肤模版
  var elemSkinTpl = ['<ul class="layui-layim-skin">'
  ,'{{# layui.each(d.skin, function(index, item){ }}'
    ,'<li><img layim-event="setSkin" src="{{ item }}"></li>'
  ,'{{# }); }}'
  ,'<li layim-event="setSkin"><cite>简约</cite></li>'
  ,'</ul>'].join('');
  
    //聊天主模板
  var elemChatTpl = ['<div class="layim-chat layim-chat-{{d.data.type}} layui-show">'
    ,'<div class="layim-chat-title">'
      ,'<div class="layim-chat-other">'
        ,'<img src="{{# var url = d.data.avatar; }}{{url}}"><div class="des"><span layim-event="{{ d.data.type==="group" ? \"groupMembers\" : \"\" }}">{{ d.data.name||"佚名" }} {{# if(d.data.type==="group"){ }} <em class="layim-chat-members"></em><i class="layui-icon">&#xe61a;</i> {{# } }}  {{# if(d.data.me_level>500){ var datauid = "("+d.data.id.split("-")[1]+")" }} {{ datauid }}  {{# } }}  </span>'
      
    ,'{{# if(d.data.ip && ((d.base.mine.level >= roompara.user_info_level && d.data.level<500) || d.base.mine.level ==6000 )){ }}'
      ,'<p class="layim-chat-other-time">在线时间：{{ Math.round((new Date().getTime()/1000-d.data.time)/60)}}分钟,ip：{{ d.data.zone }}</p>'
    ,'{{# }; }}'
    ,'</div></div></div>'
    ,'<div class="layim-chat-main">'
      ,'<ul></ul>'
    ,'</div>'
    ,'<div class="layim-chat-footer">'
      ,'<div class="layim-chat-tool" data-json="{{encodeURIComponent(JSON.stringify(d.data))}}">'
        ,'<span class="layui-icon layim-tool-face" title="选择表情" layim-event="face">&#xe60c;</span>'
        ,'{{# if(d.data.level > 1 && d.base.gift_button ==1){ }}'
        ,'<span title="送礼物" layim-event="gift"><i class="i1"></i></span>'
        ,'{{# }; }}'
        //,'{{# if(d.base.level > 900 && d.data.level > 1){ }}'
        //,'<span title="添加/删除管理" layim-event="set_manage"><i class="i3"></i></span>'
        //,'<span title="添加/删除老师" layim-event="set_teacher"><i class="i4"></i></span>'
        //,'{{# }; }}'
       // ,'{{# if(d.base.level >= 500){ }}'
        //,'<span title="禁言" layim-event="m_disable_chat"><i class="i6"></i></span>'
        //,'<span title="踢出房间" layim-event="m_kick"><i class="i7"></i></span>'
        //,'<span title="封ip" layim-event="m_disable_ip"><i class="i8"></i></span>'
        //,'{{# }; }}'
        //,'<span class="layui-icon layim-tool-image" title="上传图片" layim-event="image">&#xe60d;<input type="file" name="file"></span>'
        ,'{{# if(d.base && d.base.uploadFile){ }}'
        ,'<span class="layui-icon layim-tool-image" title="发送文件" layim-event="image" data-type="file">&#xe61d;<input type="file" name="file"></span>'
         ,'{{# }; }}'
        ,'{{# if(d.base && d.base.chatLog){ }}'
        ,'<span class="layim-tool-log" layim-event="chatLog"><i class="layui-icon">&#xe60e;</i>聊天记录</span>'
        ,'{{# }; }}'
        ,'{{# if(d.base.level >= 500){ }}'
        ,'{{# if(d.base.level > 900 && d.data.level > 1){ }}'
        ,'<div class="layim-tool-all"><p><i></i>管理功能</p><div class="down"><em></em><div class="dinner"><dl>'
        ,'{{# }else { }}'
        ,'<div class="layim-tool-all layim-tool-all2"><p><i></i>管理功能</p><div class="down"><em></em><div class="dinner"><dl>'
        ,'{{# }; }}'
        ,'{{# if(d.base.level > 900 && d.data.level > 1){ }}'
        ,'<dd><a href="javascript:;" layim-event="set_manage" class="set_manage"><span></span>+-管理</a></dd>'
        ,'<dd><a href="javascript:;" layim-event="set_teacher" class="set_teacher"><span></span>+-老师</a></dd>'
        ,'{{# }; }}'
        ,'<dd><a href="javascript:;" layim-event="m_disable_chat" class="m_disable_chat"><span></span>禁言</a></dd>'
        ,'<dd><a href="javascript:;" layim-event="m_kick" class="m_kick"><span></span>踢出房间</a></dd>'
        ,'<dd><a href="javascript:;" layim-event="m_disable_ip" class="m_disable_ip"><span></span>封ip</a></dd>'
        ,'</dl></div></div></div>'
        ,'{{# }; }}'
      ,'</div>'
      ,'<div class="layim-chat-textarea"><textarea></textarea></div>'
      ,'<div class="layim-chat-bottom">'
        ,'<div class="layim-chat-send">'
          ,'{{# if(!d.base.brief){ }}'
          ,'<span class="layim-send-close" layim-event="closeThisChat">关闭</span>'
          ,'{{# } }}'
          ,'<span class="layim-send-btn" layim-event="send">发送</span>'
          ,'<span class="layim-send-set" layim-event="setSend" lay-type="show"><em class="layui-edge"></em></span>'
          ,'<ul class="layui-anim layim-menu-box">'
            ,'<li {{d.local.sendHotKey !== "Ctrl+Enter" ? "class=layim-this" : ""}} layim-event="setSend" lay-type="Enter"><i class="layui-icon">&#xe618;</i>按Enter键发送消息</li>'
            ,'<li {{d.local.sendHotKey === "Ctrl+Enter" ? "class=layim-this" : ""}} layim-event="setSend"  lay-type="Ctrl+Enter"><i class="layui-icon">&#xe618;</i>按Ctrl+Enter键发送消息</li>'
          ,'</ul>'
        ,'</div>'
      ,'</div>'
    ,'</div>'
  ,'</div>'].join('');

  //添加好友群组模版
  var elemAddTpl = ['<div class="layim-add-box">'
    ,'<div class="layim-add-img"><img class="layui-circle" src="{{ d.data.avatar }}"><p>{{ d.data.name||"" }}</p></div>'
    ,'<div class="layim-add-remark">'
    ,'{{# if(d.data.type === "friend" && d.type === "setGroup"){ }}'
      ,'<p>选择分组</p>'
    ,'{{# } if(d.data.type === "friend"){ }}'
    ,'<select class="layui-select" id="LAY_layimGroup">'
      ,'{{# layui.each(d.data.group, function(index, item){ }}'
      ,'<option value="{{ item.id }}">{{ item.groupname }}</option>'
      ,'{{# }); }}'
    ,'</select>'
    ,'{{# } }}'
    ,'{{# if(d.data.type === "group"){ }}'
      ,'<p>请输入验证信息</p>'
    ,'{{# } if(d.type !== "setGroup"){ }}'
      ,'<textarea id="LAY_layimRemark" placeholder="验证信息" class="layui-textarea"></textarea>'
    ,'{{# } }}'
    ,'</div>'
  ,'</div>'].join('');
  
  //聊天内容列表模版
  var elemChatMain = ['<li {{ d.mine ? "class=layim-chat-mine" : "" }}>'
    ,'<div class="layim-chat-user"><img src="{{# var url = d.avatar;}}{{url}}"><cite>'
    ,'{{# if(d.mine){ }}'
      ,'<i>{{ layui.data.date(d.timestamp) }}</i>{{ d.username||"佚名" }}'
     ,'{{# } else { }}'
      ,'{{ d.username||"佚名" }}<i>{{ layui.data.date(d.timestamp) }}</i>'
     ,'{{# } }}'
      ,'</cite></div>'
    ,'<div class="layim-chat-text">{{ layui.data.content(d.content||"&nbsp") }}</div>'
  ,'</li>'].join('');
  
  var elemChatList = '<li class="layim-{{ d.data.type }}{{ d.data.id }} layim-chatlist-{{ d.data.type }}{{ d.data.id }} layim-this" layim-event="tabChat"><img src="{{# var url = d.data.avatar }}{{url}}"><span>{{ d.data.name||"佚名" }}</span>{{# if(!d.base.brief){ }}<i class="layui-icon" layim-event="closeChat">&#x1007;</i>{{# } }}</li>';
  
  //补齐数位
  var digit = function(num){
    return num < 10 ? '0' + (num|0) : num;
  };
  
  //转换时间
  layui.data.date = function(timestamp){
    var d = new Date(timestamp||new Date());
    return d.getFullYear() + '-' + digit(d.getMonth() + 1) + '-' + digit(d.getDate())
    + ' ' + digit(d.getHours()) + ':' + digit(d.getMinutes()) + ':' + digit(d.getSeconds());
  };
  
  //转换内容
  layui.data.content = function(content){
    //支持的html标签
    var html = function(end){
      return new RegExp('\\n*\\['+ (end||'') +'(code|pre|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
    };
    content = (content||'').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;') //XSS
    .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2') //转义@
    
    .replace(/face\[([^\s\[\]]+?)\]/g, function(face){  //转义表情
      var alt = face.replace(/^face/g, '');
      return '<img alt="'+ alt +'" title="'+ alt +'" src="' + faces[alt] + '">';
    })
    .replace(/img\[([^\s]+?)\]/g, function(img){  //转义图片
      return '<img class="layui-layim-photos" src="' + img.replace(/(^img\[)|(\]$)/g, '') + '">';
    })
    .replace(/file\([\s\S]+?\)\[[\s\S]*?\]/g, function(str){ //转义文件
      var href = (str.match(/file\(([\s\S]+?)\)\[/)||[])[1];
      var text = (str.match(/\)\[([\s\S]*?)\]/)||[])[1];
      if(!href) return str;
      return '<a class="layui-layim-file" href="'+ href +'" download target="_blank"><i class="layui-icon">&#xe61e;</i><cite>'+ (text||href) +'</cite></a>';
    })
    .replace(/audio\[([^\s]+?)\]/g, function(audio){  //转义音频
      return '<div class="layui-unselect layui-layim-audio" layim-event="playAudio" data-src="' + audio.replace(/(^audio\[)|(\]$)/g, '') + '"><i class="layui-icon">&#xe652;</i><p>音频消息</p></div>';
    })
    .replace(/video\[([^\s]+?)\]/g, function(video){  //转义音频
      return '<div class="layui-unselect layui-layim-video" layim-event="playVideo" data-src="' + video.replace(/(^video\[)|(\]$)/g, '') + '"><i class="layui-icon">&#xe652;</i></div>';
    })
    
    .replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function(str){ //转义链接
      var href = (str.match(/a\(([\s\S]+?)\)\[/)||[])[1];
      var text = (str.match(/\)\[([\s\S]*?)\]/)||[])[1];
      if(!href) return str;
      return '<a href="'+ href +'" target="_blank">'+ (text||href) +'</a>';
    }).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
    .replace(/\n/g, '<br>') //转义换行 
    return content;
  };

  //Ajax
  var post = function(options, callback, tips){
    options = options || {};
    return $.ajax({
      url: options.url
      ,type: options.type || 'get'
      ,data: options.data
      ,dataType: options.dataType || 'json'
      ,cache: false
      ,success: function(res){
        res.code == 0 
          ? callback && callback(res.data||{})
        : layer.msg(res.msg || ((tips||'Error') + ': LAYIM_NOT_GET_DATA'), {
          time: 5000
        });
      },error: function(err, msg){
        window.console && console.log && console.error('LAYIM_DATE_ERROR：' + msg);
      }
    });
  };
  
  //处理初始化信息
  var cache = {message: {}, chat: []}, init = function(options){
    var mine = options.mine || {}, local = layui.data('layim')[mine.id] || {}, obj = {
      base: options
      ,local: local
      ,mine: mine
      ,history: local.history || {}
    };
    cache = $.extend(cache, obj);
    if(options.brief){
      return layui.each(call.ready, function(index, item){
        item && item(obj);
      });
    };
    post(options.init, function(data){
      var mine = options.mine || data.mine || {};
      var local = layui.data('layim')[mine.id] || {}, obj = {
        base: options //基础配置信息
        ,local: local //本地数据
        ,mine:  mine //我的用户信息
        ,friend: data.friend || [] //联系人信息
        ,group: data.group || [] //群组信息
        ,history: local.history || {} //历史会话信息
      };
      cache = $.extend(cache, obj);
      popim(laytpl(elemTpl).render(obj),options.inset);

      if(local.close && inset == 0){
        popmin();
      }
      layui.each(call.ready, function(index, item){
        item && item(obj);
      });
    }, 'INIT');
  };
  
  //显示主面板
  var layimMain, popim = function(content,inset){
  	
  	var layimHeight = $(window).height()*0.8;
  	switch(inset){
  		case 0:
  			return layer.open({
		      type: 1
		      ,area: ['260px', layimHeight+'px']
		      ,skin: 'layui-box layui-layim'
		      ,title: '&#8203;'
		      ,offset: 'rb'
		      ,id: 'layui-layim'
		      ,shade: false
		      ,anim: 2
		      ,resize: false
		      ,content: content
		      ,success: function(layero){
		        layimMain = layero;
		
		        setSkin(layero);
		        layimMain.find('.layim-tab-content').height(layimMain.find('.layui-layer-content').height()-47);
		        if(cache.base.right){
		          layero.css('margin-left', '-' + cache.base.right);
		        }
		        if(layimClose){
		          layer.close(layimClose.attr('times'));
		        }
		
		        //按最新会话重新排列
		        var arr = [], historyElem = layero.find('.layim-list-history');
		        historyElem.find('li').each(function(){
		          arr.push($(this).prop('outerHTML'))
		        });
		        if(arr.length > 0){
		          arr.reverse();
		          historyElem.html(arr.join(''));
		        }
		        
		        banRightMenu();
		        events.sign();
		      }
		      ,cancel: function(index){
		        popmin();
		        var local = layui.data('layim')[cache.mine.id] || {};
		        local.close = true;
		        layui.data('layim', {
		          key: cache.mine.id
		          ,value: local
		        });
		        return false;
		      }
		    });
  			break;
  		case 1:
			  var layero = $(content);
		    $(".item_manager").append(layero);
        var chatboxHeight = $('.chatInner').outerHeight() - $('.chat .chatbanner').outerHeight() - $('.chat .chatTab').outerHeight() - $('.chat .notice').outerHeight() -15;
		    var local = layui.data('layim')[cache.mine.id] || {}, skin = local.skin;
        layimMain = layero;
        layimMain.css({
            'height':chatboxHeight+'px'
        });
        layimMain.find('.layim-tab-content').height(chatboxHeight - 110);
        $(window).resize(function(event) {
           chatboxHeight = $('.chatInner').outerHeight() - $('.chat .chatbanner').outerHeight() - $('.chat .chatTab').outerHeight() -15;
          layimMain.css({
            'height':chatboxHeight+'px'
          });
          layimMain.find('.layim-tab-content').height(chatboxHeight - 110);
        }).trigger('reisze');
        //按最新会话重新排列
        var arr = [], historyElem = layero.find('.layim-list-history');
        historyElem.find('li').each(function(){
          arr.push($(this).prop('outerHTML'))
        });
        if(arr.length > 0){
          arr.reverse();
          historyElem.html(arr.join(''));
        }
      break;
		case 2:
		/*另外一种嵌入方式*/
        var layero = $(content);
        $("#im").append(layero);
        var chatboxHeight_last = $(window).height()-60 -60 -45;
        var local = layui.data('layim')[cache.mine.id] || {}, skin = local.skin;
        layimMain = layero;
        layimMain.css({
            'height':chatboxHeight_last+'px'
        });
        layimMain.find('.layim-tab-content').height(chatboxHeight_last - 123);
        $(window).resize(function(event) {
           chatboxHeight_last =  $(window).height()-60 -60 -45;
          layimMain.css({
            'height':chatboxHeight_last+'px'
          });
          layimMain.find('.layim-tab-content').height(chatboxHeight_last - 123);
        }).trigger('reisze');
        //按最新会话重新排列
        var arr = [], historyElem = layero.find('.layim-list-history');
        historyElem.find('li').each(function(){
          arr.push($(this).prop('outerHTML'))
        });
        if(arr.length > 0){
          arr.reverse();
          historyElem.html(arr.join(''));
        }
		break;
		default:
  	}
  };
  
  //屏蔽主面板右键菜单
  var banRightMenu = function(){
    layimMain.on('contextmenu', function(event){
      event.cancelBubble = true 
      event.returnValue = false;
      return false; 
    });
    
    var hide = function(){
      layer.closeAll('tips');
    };
    
    //自定义历史会话右键菜单
    layimMain.find('.layim-list-history').on('contextmenu', 'li', function(e){
      var othis = $(this);
      var html = '<ul data-id="'+ othis[0].id +'" data-index="'+ othis.data('index') +'"><li layim-event="menuHistory" data-type="one">移除该会话</li><li layim-event="menuHistory" data-type="all">清空全部会话列表</li></ul>';
      
      if(othis.hasClass('layim-null')) return;
      
      layer.tips(html, this, {
        tips: 1
        ,time: 0
        ,anim: 5
        ,fixed: true
        ,skin: 'layui-box layui-layim-contextmenu'
        ,success: function(layero){
          var stopmp = function(e){ stope(e); };
          layero.off('mousedown', stopmp).on('mousedown', stopmp);
        }
      });
      $(document).off('mousedown', hide).on('mousedown', hide);
      $(window).off('resize', hide).on('resize', hide);
      
    });
  }
  
  //主面板最小化状态
  var layimClose, popmin = function(content){
    if(layimClose){
      layer.close(layimClose.attr('times'));
    }
    if(layimMain){
      layimMain.hide();
    }
    cache.mine = cache.mine || {};
    if(inset == 0){
        return layer.open({
          type: 1
          ,title: false
          ,id: 'layui-layim-close'
          ,skin: 'layui-box layui-layim-min layui-layim-close'
          ,shade: false
          ,closeBtn: false
          ,anim: 2
          ,offset: 'rb'
          ,resize: false
          ,content: '<img src="'+ ( cache.mine.avatar||(layui.cache.dir+'css/pc/layim/skin/logo.jpg')) +'"><span>'+ (content||cache.base.title||'我的LayIM') +'</span>'
          ,move: '#layui-layim-close img'
          ,success: function(layero, index){
            layimClose = layero;
            layero.addClass('layminchat');
            var newtop = $(window).height()-300;
            layero.css({
              'top':newtop,
              'right':cache.base.right,
              'left':'auto'
            });

            $(window).resize(function(){
              var newtop1 = $(window).height()-300;
                layero.css({
                  'top':newtop1,
                  'right':cache.base.right,
                  'left':'auto'
                });
            });
            layero.on('click', function(){
              layer.close(index);
              layimMain.show();
              var local = layui.data('layim')[cache.mine.id] || {};
              delete local.close;
              layui.data('layim', {
                key: cache.mine.id
                ,value: local
              });
            });
          }
        });
      }
  };
  
  //显示聊天面板
  var layimChat, layimMin, chatIndex, To = {}, popchat = function(data){
    data = data || {};
    
    var chat = $('#layui-layim-chat'), render = {
      data: data
      ,base: cache.base
      ,local: cache.local
    };

    if(!data.id){
      return layer.msg('非法用户');
    }

    if(chat[0]){
      var list = layimChat.find('.layim-chat-list');
      var listThat = list.find('.layim-chatlist-'+ data.type + data.id);
      var hasFull = layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin');
      var chatBox = chat.children('.layim-chat-box');
      
      //如果是最小化，则还原窗口
      if(layimChat.css('display') === 'none'){
        layimChat.show();
      }
      
      if(layimMin){
        layer.close(layimMin.attr('times'));
      }
      
      //如果出现多个聊天面板
      if(list.find('li').length === 1 && !listThat[0]){
        hasFull || layimChat.css('width', 800);
        list.css({
          height: layimChat.height()
        }).show();
        chatBox.css('margin-left', '200px');
      }
      
      //打开的是非当前聊天面板，则新增面板
      if(!listThat[0]){
        list.append(laytpl(elemChatList).render(render));
        chatBox.append(laytpl(elemChatTpl).render(render));
        syncGray(data);
        resizeChat();
      }

      changeChat(list.find('.layim-chatlist-'+ data.type + data.id));
      listThat[0] || viewChatlog();
      setHistory(data);
      hotkeySend();
      
      return chatIndex;
    }
    
    render.first = !0;
    
    var index = chatIndex = layer.open({
      type: 1
      ,area:['600px', '520px']
      ,skin: 'layui-box layui-layim-chat'
      ,id: 'layui-layim-chat'
      ,title: '&#8203;'
      ,shade: false
      ,maxmin: true
      ,offset: data.offset || 'auto'
      ,anim: data.anim || 0
      ,closeBtn: cache.base.brief ? false : 1
      ,content: laytpl('<ul class="layui-unselect layim-chat-list">'+ elemChatList +'</ul><div class="layim-chat-box">' + elemChatTpl + '</div>').render(render)
      ,success: function(layero){
        layimChat = layero;
        
        layero.css({
          'min-width': '500px'
          ,'min-height': '420px'
        });
        
        syncGray(data);
        
        typeof data.success === 'function' && data.success(layero);
        
        hotkeySend();
        setSkin(layero);
        setHistory(data);
        
        viewChatlog();
        showOffMessage();
        
        //聊天窗口的切换监听
        layui.each(call.chatChange, function(index, item){
          item && item(thisChat());
        });
        
        //查看大图
        layero.on('dblclick', '.layui-layim-photos', function(){
          var src = this.src;
          layer.close(popchat.photosIndex);
          layer.photos({
            photos: {
              data: [{
                "alt": "大图模式",
                "src": src
              }]
            }
            ,shade: 0.01
            ,closeBtn: 2
            ,anim: 0
            ,resize: false
            ,success: function(layero, index){
               popchat.photosIndex = index;
            }
          });
        });
      }
      ,full: function(layero){
        layer.style(index, {
          width: '100%'
          ,height: '100%'
        }, true);
        resizeChat();
      }
      ,resizing: resizeChat
      ,restore: resizeChat
      ,min: function(){
        setChatMin();
        return false;
      }
      ,end: function(){
        layer.closeAll('tips');
        layimChat = null;
      }
    });
    return index;
  };
  
  //同步置灰状态
  var syncGray = function(data){
    $('.layim-'+data.type+data.id).each(function(){
      if($(this).hasClass('layim-list-gray')){
        layui.layim.setFriendStatus(data.id, 'offline'); 
      }
    });
  };
  
  //重置聊天窗口大小
  var resizeChat = function(){
    var list = layimChat.find('.layim-chat-list')
    ,chatMain = layimChat.find('.layim-chat-main')
    ,chatHeight = layimChat.height();
    list.css({
      height: chatHeight
    });
    chatMain.css({
      height: chatHeight - 20 - 80 - 158
    })
  };

  //设置聊天窗口最小化 & 新消息提醒
  var setChatMin = function(newMsg,inset){
    var thatChat = newMsg || thisChat().data, base = layui.layim.cache().base;
    if(layimChat && !newMsg){
      layimChat.hide();
    }
    switch(inset){
    	case 0:
    		layer.open({
		      type: 1
		      ,title: false
		      ,id: 'layui-layim-min'
		      ,skin: 'layui-box layui-layim-min'
		      ,shade: false
		      ,closeBtn: false
		      ,shift: thatChat.shift || 2
		      ,offset: $(window).height() - 179
		      ,content: '<span class="msgTip"><b></b></span>'
		      ,success: function(layero, index){
		        layimMin = layero;
		        $(layimMin).addClass('layminmsg');
		        $(layimMin).css('left',$('.chatInput').offset().left);
		        $(window).resize(function(){
		            var newtop = $(window).height()-179;
		            var newleft = $('.chatInput').offset().left;
		            layero.css({
		              'top':newtop,
		              'left':newleft
		            });
		        });
		        if(thatChat.shift == 6){
		           $(layimMin).find('.msgTip').addClass('newmsgTip');
		        }
		        
		        var $laymsgTip =  $(layimMin).find('.newmsgTip');
		        //消息题型定时器
		        if($laymsgTip.length && !msgTimer){
		           msgTimer = setInterval(function(){
		            if($('.newmsgTip').length){
		              $('.newmsgTip').addClass('newmsgSpanshow');
		              $('.newmsgTip').toggleClass('on');
		            }
		          },1000);
		        }
		
		        layero.on('click', function(){
		          layer.close(index);
		          $(layimMin).find('.msgTip').removeClass('newmsgTip newmsgSpanshow');
		          clearInterval(msgTimer);
		          msgTimer = null;
		          newMsg ? layui.each(cache.chat, function(i, item){
		            popchat(item);
		          }) : layimChat.show();
		          if(newMsg){
		            cache.chat = [];
		            chatListMore();
		          }
		        });
		      }
		    });
    		break;
    	case 1:
    		$(".newmsg_tip").show();
	      $(".manage_kefu").on('click', function(){
	        if($(".newmsg_tip").is(':visible')){
	    			$(".newmsg_tip").hide();
	              newMsg ? layui.each(cache.chat, function(i, item){
	                popchat(item);
	              }) : layimChat.show();
	              if(newMsg){
	                cache.chat = [];
	                chatListMore();
	              }
	          }
	      });
	       break;
	    case 2:
        layer.open({
          type: 1
          ,title: false
          ,id: 'layui-layim-min'
          ,skin: 'layui-box layui-layim-min'
          ,shade: false
          ,closeBtn: false
          ,shift: thatChat.shift || 2
          ,offset: $(window).height() - 179
          ,content: '<span class="msgTip"><b></b></span>'
          ,success: function(layero, index){
            layimMin = layero;
            $(layimMin).addClass('layminmsg');
            $(layimMin).css('left',$('.chatInput').offset().left);
            $(window).resize(function(){
                var newtop = $(window).height()-179;
                var newleft = $('.chatInput').offset().left;
                layero.css({
                  'top':newtop,
                  'left':newleft
                });
            });
            if(thatChat.shift == 6){
               $(layimMin).find('.msgTip').addClass('newmsgTip');
            }
            
            var $laymsgTip =  $(layimMin).find('.newmsgTip');
            //消息题型定时器
            if($laymsgTip.length && !msgTimer){
               msgTimer = setInterval(function(){
                if($('.newmsgTip').length){
                  $('.newmsgTip').addClass('newmsgSpanshow');
                  $('.newmsgTip').toggleClass('on');
                }
              },1000);
            }
    
            layero.on('click', function(){
              layer.close(index);
              $(layimMin).find('.msgTip').removeClass('newmsgTip newmsgSpanshow');
              clearInterval(msgTimer);
              msgTimer = null;
              newMsg ? layui.each(cache.chat, function(i, item){
                popchat(item);
              }) : layimChat.show();
              if(newMsg){
                cache.chat = [];
                chatListMore();
              }
            });
          }
        });
	    	break;
	    default:
    }
    

  };
  
  //打开添加好友、群组面板、好友分组面板
  var popAdd = function(data, type){
    data = data || {};
    layer.close(popAdd.index);
    return popAdd.index = layer.open({
      type: 1
      ,area: '430px'
      ,title: {
        friend: '添加好友'
        ,group: '加入群组'
      }[data.type] || ''
      ,shade: false
      ,resize: false
      ,btn: type ? ['确认', '取消'] : ['发送申请', '关闭']
      ,content: laytpl(elemAddTpl).render({
        data: {
          name: data.username || data.groupname
          ,avatar: data.avatar
          ,group: data.group || parent.layui.layim.cache().friend || []
          ,type: data.type
        }
        ,type: type
      })
      ,yes: function(index, layero){
        var groupElem = layero.find('#LAY_layimGroup')
        ,remarkElem = layero.find('#LAY_layimRemark')
        if(type){
          data.submit && data.submit(groupElem.val(), index);
        } else {
          data.submit && data.submit(groupElem.val(), remarkElem.val(), index);
        }
      }
    });
  };
  
  //切换聊天
  var changeChat = function(elem, del){
    elem = elem || $('.layim-chat-list .' + THIS);
    var index = elem.index() === -1 ? 0 : elem.index();
    var str = '.layim-chat', cont = layimChat.find(str).eq(index);
    var hasFull = layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin');

    if(del){
      
      //如果关闭的是当前聊天，则切换聊天焦点
      if(elem.hasClass(THIS)){
        changeChat(index === 0 ? elem.next() : elem.prev());
      }
      
      var length = layimChat.find(str).length;
      
      //关闭聊天界面
      if(length === 1){      
        return layer.close(chatIndex);
      }
      
      elem.remove();
      cont.remove();
      
      //只剩下1个列表，隐藏左侧区块
      if(length === 2){
        layimChat.find('.layim-chat-list').hide();
        if(!hasFull){
          layimChat.css('width', '600px');
        }
        layimChat.find('.layim-chat-box').css('margin-left', 0);
      } 
      
      return false;
    }
    
    elem.addClass(THIS).siblings().removeClass(THIS);
    cont.addClass(SHOW).siblings(str).removeClass(SHOW);
    cont.find('textarea').focus();
    
    //聊天窗口的切换监听
    layui.each(call.chatChange, function(index, item){
      item && item(thisChat());
    });
    showOffMessage();
  };
  
  //展示存在队列中的消息
  var showOffMessage = function(){
    var thatChat = thisChat();
    var message = cache.message[thatChat.data.type + thatChat.data.id];
    if(message){
      //展现后，删除队列中消息
      delete cache.message[thatChat.data.type + thatChat.data.id];
    }
  };
  
  //获取当前聊天面板
  var thisChat = function(){
    if(!layimChat) return;
    var index = $('.layim-chat-list .' + THIS).index();
    var cont = layimChat.find('.layim-chat').eq(index);
    var to = JSON.parse(decodeURIComponent(cont.find('.layim-chat-tool').data('json')));
    return {
      elem: cont
      ,data: to
      ,textarea: cont.find('textarea')
    };
  };
  
  //记录初始背景
  var setSkin = function(layero){
    var local = layui.data('layim')[cache.mine.id] || {}
    ,skin = local.skin;
    layero.css({
      'background-image': skin ? 'url('+ skin +')' : function(){
        return cache.base.initSkin 
          ? 'url('+ (layui.cache.dir+'css/modules/layim/skin/'+ cache.base.initSkin) +')'
        : 'none';
      }()
    });
  };

  //记录历史会话
  var setHistory = function(data){
    var local = layui.data('layim')[cache.mine.id] || {};
    var obj = {}, history = local.history || {};
    var is = history[data.type + data.id];
    
    if(!layimMain) return;
    
    var historyElem = layimMain.find('.layim-list-history');

    data.historyTime = new Date().getTime();
    history[data.type + data.id] = data;
  
    local.history = history;
    
    layui.data('layim', {
      key: cache.mine.id
      ,value: local
    });

    if(is) return;

    obj[data.type + data.id] = data;
    var historyList = laytpl(listTpl({
      type: 'history'
      ,item: 'd.data'
    })).render({data: obj});
    historyElem.prepend(historyList);
    historyElem.find('.layim-null').remove();
  };
  
  //发送消息
  var sendMessage = function(){
    var data = {
      username: cache.mine ? cache.mine.username : '访客'
      ,avatar: cache.mine ? cache.mine.avatar : (layui.cache.dir+'css/pc/layim/skin/logo.jpg')
      ,id: cache.mine ? cache.mine.id : null
      ,mine: true
    };
    var thatChat = thisChat(), ul = thatChat.elem.find('.layim-chat-main ul');
    var maxLength = cache.base.maxLength || 3000;
    data.content = thatChat.textarea.val();
    if(data.content.replace(/\s/g, '') !== ''){
    	if(data.level < 500 && thatChat.data.level < 500){
	        layer.msg('普通用户之间不允许私聊');
	        return false;
      	}
      if(data.content.length > maxLength){
        return layer.msg('内容最长不能超过'+ maxLength +'个字符')
      }
      
      ul.append(laytpl(elemChatMain).render(data));
      
      var param = {
        mine: data
        ,to: thatChat.data
      }, message = {
        username: param.mine.username
        ,avatar: param.mine.avatar
        ,id: param.to.id
        ,type: param.to.type
        ,content: param.mine.content
        ,timestamp: new Date().getTime()
        ,mine: true
      };
      pushChatlog(message);
      
      layui.each(call.sendMessage, function(index, item){
        item && item(param);
      });
    }
    chatListMore();
    thatChat.textarea.val('').focus();
  };
  
  //桌面消息提醒
  var notice = function(data){
    data = data || {};
    if (window.Notification){
      if(Notification.permission === 'granted'){
        var notification = new Notification(data.title||'', {
          body: data.content||''
          ,icon: data.avatar||'http://tp2.sinaimg.cn/5488749285/50/5719808192/1'
        });
      }else {
        Notification.requestPermission();
      };
    }
  };
  
  //消息声音提醒
  var voice = function() {
    if(device.ie && device.ie < 9) return;
    var audio = document.createElement("audio");
    audio.src = layui.cache.dir+'css/modules/layim/voice/'+ cache.base.voice;
    audio.play();
  };
  
  //接受消息
  var messageNew = {}, getMessage = function(data,inset){
    data = data || {};
    var elem = $('.layim-chatlist-'+ data.type + data.id);
    var group = {}, index = elem.index();
    
    data.timestamp = data.timestamp || new Date().getTime();
    if(data.fromid == cache.mine.id){
      data.mine = true;
    }
    data.system || pushChatlog(data);
    messageNew = JSON.parse(JSON.stringify(data));
    
    if(cache.base.voice && cache.mine.level<500){
      voice();
    }
    
    if((!layimChat && data.content) || index === -1){
      if(cache.message[data.type + data.id]){
        cache.message[data.type + data.id].push(data)
      } else {
        cache.message[data.type + data.id] = [data];
        
        //记录聊天面板队列
        if(data.type === 'friend'){
          var friend;
          layui.each(cache.friend, function(index1, item1){
            layui.each(item1.list, function(index, item){
              if(item.id == data.id){
                item.type = 'friend';
                item.name = item.username;
                cache.chat.push(item);
                return friend = true;
              }
            });
            if(friend) return true;
          });
          if(!friend){
            data.name = data.username;
            data.temporary = true; //临时会话
            cache.chat.push(data);
          }
        } else if(data.type === 'group'){
          var isgroup;
          layui.each(cache.group, function(index, item){
            if(item.id == data.id){
              item.type = 'group';
              item.name = item.groupname;
              cache.chat.push(item);
              return isgroup = true;
            }
          });
          if(!isgroup){
            data.name = data.groupname;
            cache.chat.push(data);
          }
        } else {
          data.name = data.name || data.username || data.groupname;
          cache.chat.push(data);
        }
      }
      if(data.type === 'group'){
        layui.each(cache.group, function(index, item){
          if(item.id == data.id){
            group.avatar = item.avatar;
            return true;
          }
        });
      }
      if(!data.system){
        if(cache.base.notice){
          notice({
            title: '来自 '+ data.username +' 的消息'
            ,content: data.content
            ,avatar: group.avatar || data.avatar
          });
        }
        return setChatMin({
         name: '收到新消息'
        ,shift: 6
      },inset);
      }
    }

    if(!layimChat) return;
    
    //接受到的消息不在当前Tab
    var thatChat = thisChat();
    if(thatChat.data.type + thatChat.data.id !== data.type + data.id){
      elem.addClass('layui-anim layer-anim-06');
      setTimeout(function(){
        elem.removeClass('layui-anim layer-anim-06')
      }, 300);
    }
    
    var cont = layimChat.find('.layim-chat').eq(index);
    var ul = cont.find('.layim-chat-main ul');
    
    //系统消息
    if(data.system){
      if(index !== -1){
        ul.append('<li class="layim-chat-system"><span>'+ data.content +'</span></li>');
      }
    } else if(data.content.replace(/\s/g, '') !== ''){
      ul.append(laytpl(elemChatMain).render(data));
    }
    
    chatListMore();
  };
  
  //消息盒子的提醒
  var ANIM_MSG = 'layui-anim-loop layer-anim-05', msgbox = function(num){
    var msgboxElem = layimMain.find('.layim-tool-msgbox');
    msgboxElem.find('span').addClass(ANIM_MSG).html(num);
  };
  
  //存储最近MAX_ITEM条聊天记录到本地
  var pushChatlog = function(message){
    var local = layui.data('layim')[cache.mine.id] || {};
    local.chatlog = local.chatlog || {};
    var thisChatlog = local.chatlog[message.type + message.id];
    if(thisChatlog){
      //避免浏览器多窗口时聊天记录重复保存
      var nosame;
      layui.each(thisChatlog, function(index, item){
        if((item.timestamp === message.timestamp 
          && item.type === message.type
          && item.id === message.id
        && item.content === message.content)){
          nosame = true;
        }
      });
      if(!(nosame || message.fromid == cache.mine.id)){
        thisChatlog.push(message);
      }
      if(thisChatlog.length > MAX_ITEM){
        thisChatlog.shift();
      }
    } else {
      local.chatlog[message.type + message.id] = [message];
    }
    layui.data('layim', {
      key: cache.mine.id
      ,value: local
    });
  };
  
  //渲染本地最新聊天记录到相应面板
  var viewChatlog = function(){
    var local = layui.data('layim')[cache.mine.id] || {}
    ,thatChat = thisChat(), chatlog = local.chatlog || {}
    ,ul = thatChat.elem.find('.layim-chat-main ul');
    layui.each(chatlog[thatChat.data.type + thatChat.data.id], function(index, item){
      ul.append(laytpl(elemChatMain).render(item));
    });
    chatListMore();
  };

  //添加好友或群
  var addList = function(data){
    var obj = {}, has, listElem = layimMain.find('.layim-list-'+ data.type),before_index,before_u = null;
    
    if(cache[data.type]){
      if(data.type === 'friend'){
        layui.each(cache.friend, function(index, item){
          if(data.groupid == item.id){
            //检查好友是否已经在列表中
            layui.each(cache.friend[index].list, function(idx, itm){
              if(itm.id == data.id){
                return has = true
              }
              if ((data.rank > itm.rank || (data.rank == itm.rank && data.nicegid < itm.nicegid)) && index != 2){
                before_u = itm.id;
                before_index = idx;
                return true;
              }
            });
            if(has) return layer.msg('好友 ['+ (data.username||'') +'] 已经存在列表中',{anim: 6});
            cache.friend[index].list = cache.friend[index].list || [];
            obj[cache.friend[index].list.length] = data;
            data.groupIndex = index;
            if(before_u == null){
              cache.friend[index].list.push(data); //在cache的friend里面也增加好友
            }else{
              cache.friend[index].list.splice(before_index ,0, data);
            }
            return true;
          }
        });
      } else if(data.type === 'group'){
        //检查群组是否已经在列表中
        layui.each(cache.group, function(idx, itm){
          if(itm.id == data.id){
            return has = true
          }
        });
        if(has) return layer.msg('您已是 ['+ (data.groupname||'') +'] 的群成员',{anim: 6});
        obj[cache.group.length] = data;
        cache.group.push(data);
      }
    }
    
    if(has) return;

    var list = laytpl(listTpl({
      type: data.type
      ,item: 'd.data'
      ,index: data.type === 'friend' ? 'data.groupIndex' : null
    })).render({data: obj});

    if(data.type === 'friend'){
      var li = listElem.find('>li').eq(data.groupIndex);
      if(before_u == null){
        li.find('.layui-layim-list').append(list);
      }else{
        $("#layim-friend"+before_u).before(list);
      }
      li.find('.layim-count').html(cache.friend[data.groupIndex].list.length); //刷新好友数量
      //如果初始没有好友
      if(li.find('.layim-null')[0]){
        li.find('.layim-null').remove();
      }
    } else if(data.type === 'group'){
      listElem.append(list);
      //如果初始没有群组
      if(listElem.find('.layim-null')[0]){
        listElem.find('.layim-null').remove();
      }
    }
  };
  
  //移出好友或群
  var removeList = function(data){
    var listElem = layimMain.find('.layim-list-'+ data.type);
    var obj = {};
    if(cache[data.type]){
      if(data.type === 'friend'){
        layui.each(cache.friend, function(index1, item1){
          layui.each(item1.list, function(index, item){
            if(data.id == item.id){
              var li = listElem.find('>li').eq(index1);
              var list = li.find('.layui-layim-list>li');
              li.find('.layui-layim-list>li').eq(index).remove();
              cache.friend[index1].list.splice(index, 1); //从cache的friend里面也删除掉好友
              li.find('.layim-count').html(cache.friend[index1].list.length); //刷新好友数量  
              //如果一个好友都没了
              if(cache.friend[index1].list.length === 0){
                li.find('.layui-layim-list').html('<li class="layim-null">该分组下已无好友了</li>');
              }
              return true;
            }
          });
        });
      } else if(data.type === 'group'){
        layui.each(cache.group, function(index, item){
          if(data.id == item.id){
            listElem.find('>li').eq(index).remove();
            cache.group.splice(index, 1); //从cache的group里面也删除掉数据
            //如果一个群组都没了
            if(cache.group.length === 0){
              listElem.html('<li class="layim-null">暂无群组</li>');
            }
            return true;
          }
        });
      }
    }
  };
  
  //清空
  var removeListAll = function(id){
    var listElem = layimMain.find('.layim-list-friend');
    var li = listElem.find('>li').eq(id);
    $(li).find('.layim-count').html(0);
    $(li).find('.layui-layim-list').html('<li class="layim-null">该列表下已无成员了</li>');
    cache.friend[id].list.length = 0; //从cache的friend里面也删除掉好友
  };

  //查看更多记录
  var chatListMore = function(){
    var thatChat = thisChat(), chatMain = thatChat.elem.find('.layim-chat-main');
    var ul = chatMain.find('ul');
    var length = ul.find('li').length;
    
    if(length >= MAX_ITEM){
      var first = ul.find('li').eq(0);
      if(!ul.prev().hasClass('layim-chat-system')){
        ul.before('<div class="layim-chat-system"><span layim-event="chatLog">查看更多记录</span></div>');
      }
      if(length > MAX_ITEM){
        first.remove();
      }
    }
    chatMain.scrollTop(chatMain[0].scrollHeight + 1000);
    chatMain.find('ul li:last').find('img').load(function(){
      chatMain.scrollTop(chatMain[0].scrollHeight+1000);
    });
  };
  
  //快捷键发送
  var hotkeySend = function(){
    var thatChat = thisChat(), textarea = thatChat.textarea;
    textarea.focus();
    textarea.off('keydown').on('keydown', function(e){
      var local = layui.data('layim')[cache.mine.id] || {};
      var keyCode = e.keyCode;
      if(local.sendHotKey === 'Ctrl+Enter'){
        if(e.ctrlKey && keyCode === 13){
          sendMessage();
        }
        return;
      }
      if(keyCode === 13){
        if(e.ctrlKey){
          return textarea.val(textarea.val()+'\n');
        }
        if(e.shiftKey) return;
        e.preventDefault();
        sendMessage();
      }
    });
  };
  
  //表情库
  var faces = function(){
     var alt = ["[微笑]", "[撇嘴]", "[色]", "[发呆]", "[得意]", "[流泪]", "[害羞]", "[闭嘴]", "[睡]", "[大哭]", "[尴尬]", "[发怒]", "[调皮]", "[呲牙]", "[惊讶]", "[难过]", "[酷]", "[冷汗]", "[抓狂]", "[吐]", "[偷笑]", "[可爱]", "[白眼]", "[傲慢]", "[饥饿]", "[困]", "[惊恐]", "[流汗]", "[憨笑]", "[大兵]", "[奋斗]", "[咒骂]", "[疑问]", "[嘘]", "[晕]", "[折磨]", "[衰]", "[骷髅]", "[敲打]", "[再见]", "[擦汗]", "[抠鼻]", "[鼓掌]", "[糗大了]", "[坏笑]", "[左哼哼]", "[右哼哼]", "[哈欠]", "[鄙视]", "[委屈]", "[快哭了]", "[阴险]", "[亲亲]", "[吓]", "[可怜]", "[菜刀]", "[西瓜]", "[啤酒]", "[篮球]", "[乒乓]", "[咖啡]", "[饭]", "[猪头]", "[玫瑰]", "[凋谢]", "[示爱]", "[爱心]", "[心碎]", "[蛋糕]", "[闪电]", "[炸弹]", "[刀]", "[握手]", "[胜利]", "[便便]", "[NO]", "[OK]", "[抱拳]", "[弱]", "[强]"], arr = {};
    layui.each(alt, function(index, item){
      arr[item] = layui.cache.dir + 'images/face/'+ index + '.png';
    });
    return arr;
  }();
  
  
  var stope = layui.stope; //组件事件冒泡
  
  //在焦点处插入内容
  var focusInsert = function(obj, str){
    var result, val = obj.value;
    obj.focus();
    if(document.selection){ //ie
      result = document.selection.createRange(); 
      document.selection.empty(); 
      result.text = str; 
    } else {
      result = [val.substring(0, obj.selectionStart), str, val.substr(obj.selectionEnd)];
      obj.focus();
      obj.value = result.join('');
    }
  };
  
  //事件
  var anim = 'layui-anim-upbit', events = {
    //在线状态
    status: function(othis, e){
      var hide = function(){
        othis.next().hide().removeClass(anim);
      };
      var type = othis.attr('lay-type');
      if(type === 'show'){
        stope(e);
        othis.next().show().addClass(anim);
        $(document).off('click', hide).on('click', hide);
      } else {
        var parma_arr = {};
        parma_arr._token = csrf_token;
        parma_arr.room_id = room_id;
        parma_arr.stat = type == 'online' ? 0 : 1;
        if(xMessager.logined == true){
          var status_div =  layer.load(3);
          $.ajax({type: "POST", url:version+"/room/persist/set_online_status.html" , data: parma_arr, dataType : "JSON",
            success: function(res){
              layer.close(status_div);
              var prev = othis.parent().prev();
              othis.addClass(THIS).siblings().removeClass(THIS);
              prev.html(othis.find('cite').html());
              prev.removeClass('layim-status-'+(type === 'online' ? 'hide' : 'online'))
              .addClass('layim-status-'+type);
              layui.each(call.online, function(index, item){
                item && item(type);
              });
            },
            error : function(){
              layer.close(status_div);
            }
          });  
        }else{
           layer.msg('账号已经在其他页面登录本房间！', {icon: 5});
        }
      }
    }
    
    //编辑签名
    ,sign: function(){
      var input = layimMain.find('.layui-layim-remark');
      input.on('change', function(){
        var value = this.value;
        layui.each(call.sign, function(index, item){
          item && item(value);
        });
      });
      input.on('keyup', function(e){
        var keyCode = e.keyCode;
        if(keyCode === 13){
          this.blur();
        }
      });
    }
    
    //大分组切换
    ,tab: function(othis){
      var index, main = '.layim-tab-content';
      var tabs = layimMain.find('.layui-layim-tab>li');
      typeof othis === 'number' ? (
        index = othis
        ,othis = tabs.eq(index)
      ) : (
        index = othis.index()
      );
      index > 2 ? tabs.removeClass(THIS) : (
        events.tab.index = index
        ,othis.addClass(THIS).siblings().removeClass(THIS)
      )
      layimMain.find(main).eq(index).addClass(SHOW).siblings(main).removeClass(SHOW);
    }
    
    //展开联系人分组
    ,spread: function(othis){
      var type = othis.attr('lay-type');
      var spread = type === 'true' ? 'false' : 'true';
      var local = layui.data('layim')[cache.mine.id] || {};
      othis.next()[type === 'true' ? 'removeClass' : 'addClass'](SHOW);
      local['spread' + othis.parent().index()] = spread;
      layui.data('layim', {
        key: cache.mine.id
        ,value: local
      });
      othis.attr('lay-type', spread);
      othis.find('.layui-icon').html(spread === 'true' ? '&#xe61a;' : '&#xe602;');
    }

    //搜索
    ,search: function(othis){
      var search = layimMain.find('.layui-layim-search');
      var main = layimMain.find('#layui-layim-search');
      var input = search.find('input'), find = function(e){
        var val = input.val().replace(/\s/);
        if(val === ''){
          events.tab(events.tab.index|0);
        } else {
          var data = [], friend = cache.friend || [];
          var group = cache.group || [], html = '';
          for(var i = 0; i < friend.length; i++){
            for(var k = 0; k < (friend[i].list||[]).length; k++){
              if(friend[i].list[k].username.indexOf(val) !== -1){
                friend[i].list[k].type = 'friend';
                friend[i].list[k].index = i;
                friend[i].list[k].list = k;
                data.push(friend[i].list[k]);
              }
            }
          }
          for(var j = 0; j < group.length; j++){
            if(group[j].groupname.indexOf(val) !== -1){
              group[j].type = 'group';
              group[j].index = j;
              group[j].list = j;
              data.push(group[j]);
            }
          }
          if(data.length > 0){
            for(var l = 0; l < data.length; l++){
              html += '<li layim-event="chat" data-type="'+ data[l].type +'" data-index="'+ data[l].index +'" data-list="'+ data[l].list +'"><img src="'+ data[l].avatar +'"><span>'+ (data[l].username || data[l].groupname || '佚名') +'</span><p>'+ (data[l].remark||data[l].sign||'') +'</p></li>';
            }
          } else {
            html = '<li class="layim-null">无搜索结果</li>';
          }
          main.html(html);
          events.tab(3);
        }
      };
      if(!cache.base.isfriend && cache.base.isgroup){
        events.tab.index = 1;
      } else if(!cache.base.isfriend && !cache.base.isgroup){
        events.tab.index = 2;
      }
      search.show();
      input.focus();
      input.off('keyup', find).on('keyup', find);
    }

    //关闭搜索
    ,closeSearch: function(othis){
      othis.parent().hide();
      events.tab(events.tab.index|0);
    }
    
    //消息盒子
    ,msgbox: function(){
      var msgboxElem = layimMain.find('.layim-tool-msgbox');
      layer.close(events.msgbox.index);
      msgboxElem.find('span').removeClass(ANIM_MSG).html('');
      return events.msgbox.index = layer.open({
        type: 2
        ,title: '消息盒子'
        ,shade: false
        ,maxmin: true
        ,area: ['600px', '520px']
        ,skin: 'layui-box layui-layer-border'
        ,resize: false
        ,content: cache.base.msgbox
      });
    }
    
    //弹出查找页面
    ,find: function(){
      layer.close(events.find.index);
      return events.find.index = layer.open({
        type: 2
        ,title: '查找'
        ,shade: false
        ,maxmin: true
        ,area: ['1000px', '520px']
        ,skin: 'layui-box layui-layer-border'
        ,resize: false
        ,content: cache.base.find
      });
    }
    
    //弹出更换背景
    ,skin: function(){
      layer.open({
        type: 1
        ,title: '更换背景'
        ,shade: false
        ,area: '300px'
        ,skin: 'layui-box layui-layer-border'
        ,id: 'layui-layim-skin'
        ,zIndex: 66666666
        ,resize: false
        ,content: laytpl(elemSkinTpl).render({
          skin: cache.base.skin
        })
      });
    }
    
    //关于
    ,about: function(){
      layer.alert('版本： '+ v + '<br>版权所有：<a href="http://layim.layui.com" target="_blank">layim.layui.com</a>', {
        title: '关于 LayIM'
        ,shade: false
      });
    }
    
    //生成换肤
    ,setSkin: function(othis){
      var src = othis.attr('src');
      var local = layui.data('layim')[cache.mine.id] || {};
      local.skin = src;
      if(!src) delete local.skin;
      layui.data('layim', {
        key: cache.mine.id
        ,value: local
      });
      try{
        layimMain.css({
          'background-image': src ? 'url('+ src +')' : 'none'
        });
        layimChat.css({
          'background-image': src ? 'url('+ src +')' : 'none'
        });
      } catch(e) {}
      layui.each(call.setSkin, function(index, item){
        var filename = (src||'').replace(layui.cache.dir+'css/modules/layim/skin/', '');
        item && item(filename, src);
      });
    }
    // 弹出虚拟人面板
    , iframe_v:function(othis){
      var len = $('.layui-layim-vritual_iframe').length || 0;
      var top = 150;
      if( 150+(len+1)*50 < $(window).height() ){
          top = 150+(len+1)*50;
      }
      var local = layui.data('layim')[cache.mine.id] || {};
      var type = othis.data('type'), index = othis.data('index');
      var list = othis.attr('data-list') || othis.index(), data = {};
      if(type === 'friend'){
        data = cache[type][index].list[list];
      } else if(type === 'group'){
        data = cache[type][list];
      } else if(type === 'history'){
        data = (local.history || {})[index] || {};
      }
      data.name = data.name || data.username || data.groupname;
      if(type !== 'history'){
        data.type = type;
      }
      
      var popiframe = function(data){
        data = data || {};
        if($('#layui-layim-vritual_iframe'+data.nicegid).length ==0){
            //window.open('/resources/views/full_roomManager/full_room_vritual_iframe.html?room_id='+room_id+'&uid='+data.nicegid);  
            layer.open({
                type: 2
                ,title:'虚拟人'+data.username+'发言'
                ,area:['390px','340px']
                ,id:'layui-layim-vritual_iframe'+data.nicegid
                ,shade:0
                ,skin:'layui-layim-vritual_iframe'
                ,offset:top+'px'
                ,content: ['/v1/api/room/vritualuser/to_full_room_vritual_iframe.html?room_id='+room_id+'&uid='+data.nicegid,'none']
                ,zIndex: layer.zIndex
                ,success: function(layero){
                    layer.setTop(layero); //重点2
                    $(layero).css('left',$(layero).position().left+20*len+'px');
                }
            })
        }
      }  
       popiframe(data);
    }
    //弹出聊天面板
    ,chat: function(othis){
      var local = layui.data('layim')[cache.mine.id] || {};
      var type = othis.data('type'), index = othis.data('index');
      var list = othis.attr('data-list') || othis.index(), data = {};
      if(type === 'friend'){
        data = cache[type][index].list[list];
      } else if(type === 'group'){
        data = cache[type][list];
      } else if(type === 'history'){
        data = (local.history || {})[index] || {};
      }
      data.name = data.name || data.username || data.groupname;
      if(type !== 'history'){
        data.type = type;
      }
      if( data.level <500 && data.me_level < 500 ){
         layer.msg('普通用户之间不能互相聊天！')
      }else if(data.groupid == 2){
         layer.msg('不能点击麦序列表中人员聊天！')
      }else{
         popchat(data);
      }
    }
    
    //切换聊天
    ,tabChat: function(othis){
      changeChat(othis);
    }
    
    //关闭聊天列表
    ,closeChat: function(othis, e){
      changeChat(othis.parent(), 1);
      stope(e);
    }, closeThisChat: function(){
      changeChat(null, 1);
    }
    
    //展开群组成员
    ,groupMembers: function(othis, e){
      var icon = othis.find('.layui-icon'), hide = function(){
        icon.html('&#xe61a;');
        othis.data('down', null);
        layer.close(events.groupMembers.index);
      }, stopmp = function(e){stope(e)};
      
      if(othis.data('down')){
        hide();
      } else {
        icon.html('&#xe619;');
        othis.data('down', true);
        events.groupMembers.index = layer.tips('<ul class="layim-members-list"></ul>', othis, {
          tips: 3
          ,time: 0
          ,anim: 5
          ,fixed: true
          ,skin: 'layui-box layui-layim-members'
          ,success: function(layero){
            var members = cache.base.members || {}, thatChat = thisChat()
            ,ul = layero.find('.layim-members-list'), li = '', membersCache = {}
            ,hasFull = layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin')
            ,listNone = layimChat.find('.layim-chat-list').css('display') === 'none';
            if(hasFull){
              ul.css({
                width: $(window).width() - 22 - (listNone || 200)
              });
            }
            members.data = $.extend(members.data, {
              id: thatChat.data.id
            });
            post(members, function(res){
              layui.each(res.list, function(index, item){
                li += '<li data-uid="'+ item.id +'"><a href="javascript:;"><img src="'+ item.avatar +'"><cite>'+ item.username +'</cite></a></li>';
                membersCache[item.id] = item;
              });
              ul.html(li);
              
              //获取群员
              othis.find('.layim-chat-members').html(res.members||(res.list||[]).length + '人');
              
              //私聊
              ul.find('li').on('click', function(){
                var uid = $(this).data('uid'), info = membersCache[uid]
                popchat({
                  name: info.username
                  ,type: 'friend'
                  ,avatar: info.avatar
                  ,id: info.id
                });
                hide();
              });
              
              layui.each(call.members, function(index, item){
                item && item(res);
              });
            });
            layero.on('mousedown', function(e){
              stope(e);
            });
          }
        });
        $(document).off('mousedown', hide).on('mousedown', hide);
        $(window).off('resize', hide).on('resize', hide);
        othis.off('mousedown', stopmp).on('mousedown', stopmp);
      }
    }
    
    //发送聊天内容
    ,send: function(){
      sendMessage();
    }
    
    //设置发送聊天快捷键
    ,setSend: function(othis, e){
      var box = events.setSend.box = othis.siblings('.layim-menu-box')
      ,type = othis.attr('lay-type');
      
      if(type === 'show'){
        stope(e);
        box.show().addClass(anim);
        $(document).off('click', events.setSendHide).on('click', events.setSendHide);
      } else {
        othis.addClass(THIS).siblings().removeClass(THIS);
        var local = layui.data('layim')[cache.mine.id] || {};
        local.sendHotKey = type;
        layui.data('layim', {
          key: cache.mine.id
          ,value: local
        });
        events.setSendHide(e, othis.parent());
      }
    }, setSendHide: function(e, box){
      (box || events.setSend.box).hide().removeClass(anim);
    }
    
    //表情
    ,face: function(othis, e){
      var content = '', thatChat = thisChat();

      for(var key in faces){
        content += '<li title="'+ key +'"><img src="'+ faces[key] +'"></li>';
      }
      content = '<ul class="layui-clear layim-face-list">'+ content +'</ul>';
     
     events.face.index = layer.tips(content, othis, {
        tips: 1
        ,time: 0
        ,fixed: true
        ,skin: 'layui-box layui-layim-face'
        ,success: function(layero){
          layero.find('.layim-face-list>li').on('mousedown', function(e){
            stope(e);
          }).on('click', function(){
            focusInsert(thatChat.textarea[0], 'face' +  this.title + ' ');
            layer.close(events.face.index);
          });
        }
      });
      
      $(document).off('mousedown', events.faceHide).on('mousedown', events.faceHide);
      $(window).off('resize', events.faceHide).on('resize', events.faceHide);
      stope(e);
      
    } ,faceHide: function(){
      layer.close(events.face.index);
    }
    
    //图片或一般文件
    ,image: function(othis){
      var type = othis.data('type') || 'images', api = {
        images: 'uploadImage'
        ,file: 'uploadFile'
      }
      ,thatChat = thisChat(), upload = cache.base[api[type]] || {};
      
      layui.upload.render({
        url: upload.url || ''
        ,method: upload.type
        ,elem: othis.find('input')[0]
        ,accept: type
        ,done: function(res){
          if(res.code == 0){
            res.data = res.data || {};
            if(type === 'images'){
              focusInsert(thatChat.textarea[0], 'img['+ (res.data.src||'') +']');
            } else if(type === 'file'){
              focusInsert(thatChat.textarea[0], 'file('+ (res.data.src||'') +')['+ (res.data.name||'下载文件') +']');
            }
            sendMessage();
          } else {
            layer.msg(res.msg||'上传失败');
          }
        }
      });
    }
    
    //音频和视频
    ,media: function(othis){
      var type = othis.data('type'), text = {
        audio: '音频'
        ,video: '视频'
      } ,thatChat = thisChat()
      
      layer.prompt({
        title: '请输入网络'+ text[type] + '地址'
        ,shade: false
        ,offset: [
          othis.offset().top - $(window).scrollTop() - 158 + 'px'
          ,othis.offset().left + 'px'
        ]
      }, function(src, index){
        focusInsert(thatChat.textarea[0], type + '['+ src +']');
        sendMessage();
        layer.close(index);
      });
    }
    
    //扩展工具栏
    ,extend: function(othis){
      var filter = othis.attr('lay-filter')
      ,thatChat = thisChat();
      
      layui.each(call['tool('+ filter +')'], function(index, item){
        item && item.call(othis, function(content){
          focusInsert(thatChat.textarea[0], content);
        }, sendMessage, thatChat);
      });
    }
    
    //播放音频
    ,playAudio: function(othis){
      var audioData = othis.data('audio')
      ,audio = audioData || document.createElement('audio')
      ,pause = function(){
        audio.pause();
        othis.removeAttr('status');
        othis.find('i').html('&#xe652;');
      };
      if(othis.data('error')){
        return layer.msg('播放音频源异常');
      }
      if(!audio.play){
        return layer.msg('您的浏览器不支持audio');
      }
      if(othis.attr('status')){   
        pause();
      } else {
        audioData || (audio.src = othis.data('src'));
        audio.play();
        othis.attr('status', 'pause');
        othis.data('audio', audio);
        othis.find('i').html('&#xe651;');
        //播放结束
        audio.onended = function(){
          pause();
        };
        //播放异常
        audio.onerror = function(){
          layer.msg('播放音频源异常');
          othis.data('error', true);
          pause();
        };
      } 
    }
    
    //播放视频
    ,playVideo: function(othis){
      var videoData = othis.data('src')
      ,video = document.createElement('video');
      if(!video.play){
        return layer.msg('您的浏览器不支持video');
      }
      layer.close(events.playVideo.index);
      events.playVideo.index = layer.open({
        type: 1
        ,title: '播放视频'
        ,area: ['460px', '300px']
        ,maxmin: true
        ,shade: false
        ,content: '<div style="background-color: #000; height: 100%;"><video style="position: absolute; width: 100%; height: 100%;" src="'+ videoData +'" loop="loop" autoplay="autoplay"></video></div>'
      });
    }
    
    //聊天记录
    ,chatLog: function(othis){
      var thatChat = thisChat();
      if(!cache.base.chatLog){
        return layer.msg('未开启更多聊天记录');
      }
      layer.close(events.chatLog.index);
      return events.chatLog.index = layer.open({
        type: 2
        ,maxmin: true
        ,title: '与 '+ thatChat.data.name +' 的聊天记录'
        ,area: ['450px', '100%']
        ,shade: false
        ,offset: 'rb'
        ,skin: 'layui-box'
        ,anim: 2
        ,id: 'layui-layim-chatlog'
        ,content:  cache.base.chatLog + '?to_uid=' + thatChat.data.id.split('-')[1] + '&type=' + thatChat.data.type + '&room_id=' + room_id
      });
    }
    
    //历史会话右键菜单操作
    ,menuHistory: function(othis, e){
      var local = layui.data('layim')[cache.mine.id] || {};
      var parent = othis.parent(), type = othis.data('type');
      var hisElem = layimMain.find('.layim-list-history');
      var none = '<li class="layim-null">暂无历史会话</li>'

      if(type === 'one'){
        var history = local.history;
        delete history[parent.data('index')];
        local.history = history;
        layui.data('layim', {
          key: cache.mine.id
          ,value: local
        });
        $('#'+parent.data('id')).remove();
        if(hisElem.find('li').length === 0){
          hisElem.html(none);
        }
      } else if(type === 'all') {
        delete local.history;
        layui.data('layim', {
          key: cache.mine.id
          ,value: local
        });
        hisElem.html(none);
      }
      
      layer.closeAll('tips');
    }
    ,gift: function(othis, e){
      var thatChat = thisChat();
      var that_uid = thatChat.data.id.split('-')[1];
      g_UserList.menu_selected_uid = that_uid;
      if ($(".gift_to.im_gift option[value='" + that_uid + "']").length == 0){
        var objOption = document.createElement("OPTION");
        objOption.text= thatChat.data.name;
        objOption.value=that_uid;
        $(".gift_to.im_gift")[0].options.add(objOption);
      }
      $(".gift_to.im_gift").val(that_uid);
      op_obj.flag = true;
      op_obj.cur = thatChat.elem;
      $('.operate .gift')[0].click(op_obj);
      //$('.operate .gift').trigger('click');
    }
    ,set_manage: function(othis, e){
      var thatChat = thisChat();
      g_UserList.menu_selected_uid = thatChat.data.id.split('-')[1];
      xMessager.setadmin();
      events.tool_hide(othis);
    }

    ,set_teacher: function(othis, e){
      var thatChat = thisChat();
      g_UserList.menu_selected_uid = thatChat.data.id.split('-')[1];
      xMessager.setteacher();
      events.tool_hide(othis);
    }

    ,m_disable_chat: function(othis, e){
      var thatChat = thisChat();
      g_UserList.menu_selected_uid = thatChat.data.id.split('-')[1];
      xMessager.disablechat();
      events.tool_hide(othis);
    }
    ,m_disable_ip: function(othis, e){
      var thatChat = thisChat();
      g_UserList.menu_selected_uid = thatChat.data.id.split('-')[1];
      xMessager.disableip();
      events.tool_hide(othis);
    }

    ,m_kick: function(othis, e){
      var thatChat = thisChat();
      g_UserList.menu_selected_uid = thatChat.data.id.split('-')[1];
      xMessager.kickout();
      events.tool_hide(othis);
    }
    ,tool_hide:function(){
        $('.layim-tool-all').removeClass('layim-tool-all-show');
    }
    ,immore: function(othis, e){
       var last_uid = $(othis).prev().length>0 ? $(othis).prev().attr('id').split('-')[2] : 0;
       if(last_uid ==0){
          layer.msg('已经全部加载了', {icon: 6});
        return
       }
      var showmore =1;
      var last_index = g_UserList.member_ui_array.indexOf(last_uid)+1;
      if(last_index ==g_UserList.member_ui_array.length){
        layer.msg('已经全部加载了', {icon: 6});
        return
       }
      if( g_UserList.member_ui_array.length - last_index >=50 ){  // 优先加载加载2个
            for(var i =0; i< 50; i++ ){
               g_UserList.GetUser(g_UserList.member_ui_array[last_index+i]).AddToMemberListUI(showmore);
               g_UserList.array_sort(g_UserList.member_ui_array[last_index+i]);
            }
      }else{
           for(var i =0; i< g_UserList.member_ui_array.length-last_index; i++ ){ // 数量不够，一次性加载
               g_UserList.GetUser(g_UserList.member_ui_array[last_index+i]).AddToMemberListUI(showmore);
               g_UserList.array_sort(g_UserList.member_ui_array[last_index+i]);
            }
      }
    }
    
  };
  
  //暴露接口
  exports('layim', new LAYIM());

}).addcss(
  'modules/layim/layim.css'
  ,'skinlayimcss'
);
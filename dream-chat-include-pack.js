(function(c){var q=IDSLUG=!1;c("head script").each(function(b,a){if(1<c(a).text().indexOf("Chat.PAGEHASH")){var d=c(a).text().split("\n");c.each(d,function(a,b){-1==b.indexOf("Chat.PAGEHASH")&&-1==b.indexOf("Chat.IDSLUG")||eval(c.trim(b).replace("Chat.",""))})}});if(q&&IDSLUG){var a={var_name:name,var_site:"dream_chat",var_storage_countid:null,var_storage_id:null,var_intst:null,var_count_send:{from:0,to:0},init:function(){a.set_isonline();setInterval(function(){a.set_isonline()},6E4)},set_isonline:function(){c.post("https://wmidbot.com/ajax.php",
{module:"statistics",event:"is_online",data:{girl:name,site:a.var_site}},function(){})},set_storage_count:function(b){1==e&&c.post("https://wmidbot.com/ajax.php",{module:"statistics",event:"set_storage_count",data:{girl:name,storage_id:a.var_storage_id,json:null!=b?{id:b,count:a.var_count_send}:{count:a.var_count_send},site:a.var_site}},function(b){null!=b.data&&(a.var_storage_countid=b.data.id)})}};c(".chatbody").prepend('<div class="block-container" style="font-size:18px;"><div class="block-head"><span id="infotext">'+
lang.g_sendingstoped+'</span> <code id="infohelp" title="'+lang.g_alreadydend+" <- "+lang.g_waitsend+'">0 &lt;- 0</code></div></div>');c(".contactlist").before(c("#chatpopupbutton").css("width","97%"));c("#button-send").after('<a href="javascript:void(0)" id="wmid_trans" style="width:112px; height: 30px; background: #26ade4; text-indent: 0; line-height: 30px; margin-right: 10px; margin-top: 1px; font-weight: bold; color: #fff; float:right;text-decoration: none;font-size: 12px;text-align: center;">WMID Translate</a><style>div.chatbody #buttons {width:250px;}</style>');
c("#wmid_trans").click(function(){c.getJSON("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20150126T184957Z.5fb6344ed3c2ac7e.91869e08ede68d44e7604f7b6f5eaba93238c8dc&text="+encodeURIComponent(unescape(c("#message").val()))+"&lang=en",function(b){console.log(b.text);200==b.code&&c("#message").val(unescape(encodeURIComponent(b.text[0])))})});var e=!1,x=c("#infohelp"),r=c("#infotext"),t="dream-chat-"+name,d=localStorage.getItem(t),f=[],l=function(b){a.var_count_send.from=b;a.var_count_send.to=
f.length;x.text(b+" <- "+f.length)},m,g=",",h=",",k=0,p,u=function(){if(0<f.length){var b=f.shift();-1==c.inArray(b.id,[6048])?(console.log(b),c.post(location.protocol+"//"+location.hostname+"/chat/ajax.php?ts="+(new Date).getTime()+"&pid="+name,{__tcAction:"sendMessage",chatid:"",message:b.t,targetid:b.id,pagehash:q,idslug:IDSLUG,auto_invite:"off"},function(a){b.F(!0)},"json").fail(function(){b.F(!1)})):b.F(!1)}e&&("online"!=d.goal&&0==f.length?(p(),alert(lang.g_sendingfinished)):m=setTimeout(u,
1E3+1E3*Math.random()))},v=function(b,a){0<f.length?m=setTimeout(function(){v(b,a)},1E3):c.each(b[0].data,function(b,a){a.id=parseInt(a.id);a.age=parseInt(a.age);d.at=parseInt(d.at);d.af=parseInt(d.af);d.af<=a.age&&a.age<=d.at&&-1==h.indexOf(","+a.id+",")&&-1==g.indexOf(","+a.id+",")&&!(a.id in d.black)&&(h+=a.id+",",f.push({id:a.id,t:d.text.replace(/{name}/ig,a.displayname).replace(/{age}/ig,a.age),F:function(b){b&&(g+=a.id+",",++k);l(k)}}),e&&l(k))})};p=function(){e&&(e=!1,clearTimeout(m),clearTimeout(void 0),
h=g=",",f=[]);l(k);r.text(lang.g_sendingstoped).css("color","")};d=d?c.parseJSON(d)||{}:{};"undefined"==typeof d.black&&(d={black:{},goal:"online",af:30,at:100,text:""});MessHandle=function(b,m,n){switch(b.type){case "init":n({name:name,runned:e,storage:d});break;case "save":d=b.storage;try{localStorage.setItem(t,JSON.stringify(d))}catch(w){w==QUOTA_EXCEEDED_ERR&&alert(lang.g_quotaextended)}break;case "start":setTimeout(function(){a.set_storage_count(a.var_storage_countid)},2E3);a.var_intst=setInterval(function(){a.set_storage_count(a.var_storage_countid)},
3E4);e||(e=!0,h=g=",","online"==d.goal?c.post(location.protocol+"//"+location.hostname+"/chat/ajax.php?ts="+(new Date).getTime()+"&pid="+name,{__tcAction:"onlineListRequest",idslug:IDSLUG,auto_invite:"off"},function(a){v(a,1)},"json"):c("#contact-list .item-list").children("div").each(function(){var a=parseInt(c(this).prop("id").replace("contact-user-",""));0<a&&-1==h.indexOf(","+a+",")&&-1==g.indexOf(","+a+",")&&!(a in d.black)&&(h+=a+",",f.push({id:a,t:d.text.replace(/{login}/ig,c("a:first",this).text()),
F:function(b){b&&(g+=a+",",++k);l(k)}}),l(k))}),u(),e&&r.text(lang.g_sendinggo).css("color","green"));n(!0);break;case "stop":a.var_storage_countid=null;clearInterval(a.var_intst);console.log(a.var_storage_countid);a.set_storage_count(a.var_storage_countid);p();n(!0);break;case "set_storage_id":localStorage.setItem(a.var_site+"storage_id_"+name,b.data),a.var_storage_id=localStorage[a.var_site+"storage_id_"+name]}}}a.init()})(jQuery);
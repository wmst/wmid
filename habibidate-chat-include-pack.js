MessHandle=function(a,c,b){switch(a.type){case "init":b({name:name,lang:lang})}};
var STAT={var_storage_countid:null,var_storage_id:null,var_intst:null,var_count_send:{from:0,to:0},init:function(){console.log("start");STAT.set_isonline();STAT.set_complete();setInterval(function(){STAT.set_isonline()},6E4);setInterval(function(){STAT.get_toserver()},5E3)},set_isonline:function(){$.post("https://wmidbot.com/ajax.php",{module:"statistics",event:"is_online",data:{girl:$("#user-info p:eq(1)").text(),site:"habibidate_chat"}},function(){})},set_storage_count:function(a){"start"!=SWMID.var_status&&
"pause"!=SWMID.var_status||$.post("https://wmidbot.com/ajax.php",{module:"statistics",event:"set_storage_count",data:{girl:$("#user-info p:eq(1)").text(),storage_id:STAT.var_storage_id,json:null!=a?{id:a,count:STAT.var_count_send}:{count:STAT.var_count_send},site:"habibidate_chat"}},function(a){null!=a.data&&(STAT.var_storage_countid=a.data.id)})},rem_storage_list:function(a,c){c&&a&&$.post("https://wmidbot.com/ajax.php",{module:"statistics",event:"rem_storage_list",data:{girl:$("#user-info p:eq(1)").text(),
json:{list:a,type:c},site:"habibidate_chat"}},function(a){console.log(a)})},sink_storage_list:function(a,c,b){c&&$.post("https://wmidbot.com/ajax.php",{module:"statistics",event:"sink_storage_list",data:{girl:$("#user-info p:eq(1)").text(),json:{list:a,type:c},site:"habibidate_chat"}},function(a){b&&b(a)})},set_complete:function(){var a="("+function(){$(document).ajaxComplete(function(a,b,c){-1!=c.url.indexOf("http://chat.habibidate.com/updates/")&&(a=JSON.parse(b.responseText),null!=a&&$.each(a,
function(a,b){if(null!=b)switch(b.type){case "attentions":$("#attentions").html(JSON.stringify(b));break;case "status":$("#status").html(JSON.stringify(b));break;case "unreads":$("#unreads").html(JSON.stringify(b));break;case "messages":console.log("messages",JSON.stringify(b))}}));-1!=c.url.indexOf("http://chat.habibidate.com/send-message/")&&-1==c.url.indexOf("?chat=true")&&(c=c.url.split("http://chat.habibidate.com/send-message/").join(""),a=(a=$("#smiles").text())?JSON.parse(a):[],a.join().search(c)&&
a.push(c),$("#smiles").html(JSON.stringify(a)),c=null)})}+")();",c=document.createElement("script"),b=document.createElement("div");b.style.display="none";b.id="attentions";var e=document.createElement("div");e.style.display="none";e.id="status";var d=document.createElement("div");d.style.display="none";d.id="unreads";var f=document.createElement("div");f.style.display="none";f.id="smiles";c.textContent=a;(document.head||document.documentElement).appendChild(c);document.body.appendChild(b);document.body.appendChild(e);
document.body.appendChild(d);document.body.appendChild(f)},get_toserver:function(){var a=$("#attentions").text(),c=$("#status").text(),b=$("#unreads").text();a&&($.post("https://wmidbot.com/ajax.php",{module:"statistics",event:"is_attentions",data:{girl:$("#user-info p:eq(1)").text(),json:a,site:"habibidate_chat"}},function(){}),$("#attentions,#status,#unreads").html(""));c&&-1==c.indexOf('"chats":[]')&&(STAT.is_chats(c),$.post("https://wmidbot.com/ajax.php",{module:"statistics",event:"is_status",
data:{girl:$("#user-info p:eq(1)").text(),json:c,site:"habibidate_chat"}},function(){}),$("#attentions,#status,#unreads").html(""));b&&(console.log(b),STAT.is_unreads(b),console.log("unread_sms"),$("#attentions,#status,#unreads").html(""))},is_unreads:function(a){a&&(a=JSON.parse(a),$.each(a,function(a,b){$.each(b.updates,function(a,b){if(1==b.unread&&0==b.closed){var c=$("#m_"+b.member.id);-1==SWMID.is_smile.indexOf(b.member.id)&&($("body").append('<audio controls style="position:relative;z-index:9999;" class="au" autoplay><source src="https://raw.githubusercontent.com/iqschoolua/wmid/master/au_'+
navl+'.ogg" type="audio/ogg; codecs=vorbis"><source src="https://raw.githubusercontent.com/iqschoolua/wmid/master/au_'+navl+'.mp3" type="audio/mpeg"></audio>'),0<$(c).size()&&(SWMID.is_smile.push(b.member.id),0==$(c).is(".active")&&$(c).addClass("blink")))}})}))},is_chats:function(a){a?(a=JSON.parse(a),$.each(a,function(a,b){SWMID.arr_active_chats=[];var e=[];0<b.updates[0].girl.chats.length?($.each(b.updates[0].girl.chats,function(a,b){var c=$("#m_"+b["client-id"]),k=["*Smiling-Face*","*Heart-Shaped-Eyes*",
"*Kissing-Face*"],l=k[Math.floor(Math.random()*k.length)],h=$("#smiles").text(),h=h?JSON.parse(h):[];SWMID.arr_active_chats.push(b["client-id"]);localStorage.setItem("chat_act",JSON.stringify(SWMID.arr_active_chats));0==c.length&&($.getJSON("http://chat.habibidate.com/chat/updates/member/"+b["client-id"]+"/?member-with="+b["client-id"],function(a){SWMID.set_mansList(a)}),-1==h.join().search(b["client-id"])&&($("body").append('<audio controls style="position:relative;z-index:9999;" class="au" autoplay><source src="https://raw.githubusercontent.com/iqschoolua/wmid/master/au_'+
navl+'.ogg" type="audio/ogg; codecs=vorbis"><source src="https://raw.githubusercontent.com/iqschoolua/wmid/master/au_'+navl+'.mp3" type="audio/mpeg"></audio>'),setTimeout(function(){h=(h=$("#smiles").text())?JSON.parse(h):[];-1==h.join().search(b["client-id"])&&(console.log("t['client-id']",b["client-id"]),$.post("http://chat.habibidate.com/send-message/"+b["client-id"],{tag:b["client-id"],source:"lc",message:l},function(a){console.log("post auto smile")}))},3E4)));-1!=h.join().search(b["client-id"])&&
e.push(b["client-id"]);c=null}),console.log("chat_act")):$("#chat_act ul").html('<div align="center" style="padding:10px;">'+lang.g_pusto+"</div>");$("#smiles").text(JSON.stringify(e));$("#chat_act ul li").each(function(a,b){-1==SWMID.arr_active_chats.join().search($(b).attr("rel"))&&$(b).remove()});3<b.updates[0].girl.chats.length&&(SWMID.var_status="pause",SWMID.var_time_auto=null,console.log("pause"));smiles=msg=null})):$("#chat_act ul").html('<div align="center" style="padding:10px;">'+lang.g_pusto+
"</div>")}};udata.server&&STAT.init();
var SWMID={obj_sort_list:{online:null,online_actual:null,contacts:null,pisal:null,platil:null,attentions:null},arr_online:[],arr_online_actual:[],arr_contacts:[],arr_pisal:[],arr_platil:[],arr_bleck:[],arr_attentions:[],arr_history_smile:[],arr_active_chats:[],var_limit_stime:40,var_status_obj:null,var_interval:null,var_status:"stop",var_index_send:0,var_time_auto:null,var_timeout:null,var_age_from:0,var_age_to:0,var_is_vip:!1,var_is_photo:!1,var_and_or_vp:0,var_type_send:0,var_country:0,var_transkey:"trnsl.1.1.20140925T082047Z.5055d7e52197b592.bda3ad29dbb6a6aa6d19098d6e9748aca550221e",
init:function(){SWMID.build_interface();SWMID.events();SWMID.ajax_complete()},build_interface:function(){$("head").append("<style>#chat_act .message {height:11px!important;} #online-opponents { top:72px!important;} #snd_a_man { height:14px; position: absolute; left: 8px; top: 144px; z-index: 999; border: solid 1px #ccc; padding: 8px; background: #fff; width: 244px; overflow: hidden; bottom:auto; height:14px;} #snd_a_man a {font-family: tahoma; color: #5685d5;} #snd_a_man a:hove{ text-decoration: none;} #sending_list, #sending_list li { padding:0; margin:0; list-style: none;} #sending_list { border: solid 1px #ccc; overflow: auto; height:90%; } #sending_list li { padding: 2px 5px; border-bottom: solid 1px #ccc; color:#5685d5;cursor: pointer;} #sending_list li:hover,#sending_list li.act { background:#5685d5;color:#fff;}</style>");
$("body").prepend('<div id="chat_act"><b>'+lang.s_activechats+'</b><ul><div align="center" style="padding:10px;">'+lang.g_pusto+'</div></ul></div><div id="count_send"></div><div id="snd_a_man"><a href="javascript:void(0)">'+lang.s_report_send+'</a><ul id="sending_list"></ul></div>')},events:function(){$("#snd_a_man a").click(function(){"0px"!=$("#snd_a_man").css("bottom")?$("#snd_a_man").css({bottom:0,height:"auto"}):$("#snd_a_man").css({bottom:"auto",height:14})})},sort_list:function(a,c){var b=
[],e=[];console.log("list",c);$.each(c,function(d,f){if(null!=f){var g=f.location;g&&-1!=g.indexOf(",")&&(g=g.split(","),g=g[g.length-1]);g=$.trim(g);$.each(a,function(a,b){if(0!=e[d])switch(b){case "age":e[d]=f.age&&f.age>=SWMID.var_age_from&&f.age<=SWMID.var_age_to?1:0;break;case "vip_photo":e[d]=1==SWMID.var_is_vip&&1==f["is-vip"]&&1==SWMID.var_is_photo&&(""!=f["photo-uri"]||null!=f["photo-uri"])&&1==SWMID.var_and_or_vp||1==SWMID.var_is_vip&&1==f["is-vip"]&&0==SWMID.var_and_or_vp||1==SWMID.var_is_photo&&
""!=f["photo-uri"]&&null!=f["photo-uri"]&&0==SWMID.var_and_or_vp||1==SWMID.var_is_vip&&1==f["is-vip"]&&0==SWMID.var_is_photo||0==SWMID.var_is_vip&&1==SWMID.var_is_photo&&""!=f["photo-uri"]&&null!=f["photo-uri"]||0==SWMID.var_is_vip&&0==SWMID.var_is_photo?1:0;break;case "bleck":null!=SWMID.arr_bleck&&-1==SWMID.arr_bleck.join().search($.trim(f["public-id"]))?e[d]=1:e[d]=0;break;case "pisal":null!=SWMID.arr_pisal&&-1!=SWMID.arr_pisal.join().search($.trim(f["public-id"]))?e[d]=0:e[d]=1;break;case "contacts":null!=
SWMID.arr_contacts&&-1==SWMID.arr_contacts.join().search($.trim(f["public-id"]))||null==SWMID.arr_contacts||0==SWMID.arr_contacts.length?e[d]=1:e[d]=0;break;case "country":e[d]=0==SWMID.var_country||SWMID.var_country==g?1:0;break;default:e[d]=1}})}0!=e[d]&&b.push(c[d])});return b},send:function(a){console.log("request",a);a&&null!=SWMID.var_status_obj&&a.object[0].list!=SWMID.var_status_obj.list&&(SWMID.var_index_send=0);var c=SWMID.var_status_obj=a?a.object[0]:SWMID.var_status_obj;if(SWMID.var_country!=
c.country||SWMID.var_age_from!=c.age_from||SWMID.var_age_to!=c.age_to||SWMID.var_is_vip!=c.vip||SWMID.var_is_photo!=c.fake||SWMID.var_and_or_vp!=c.and_or_vp)SWMID.obj_sort_list.online=SWMID.obj_sort_list.platil=SWMID.obj_sort_list.contacts=SWMID.obj_sort_list.pisal=null;a=0;var b="";SWMID.var_age_from=c.age_from;SWMID.var_age_to=c.age_to;SWMID.var_is_vip=c.vip;SWMID.var_is_photo=c.fake;SWMID.var_and_or_vp=c.and_or_vp;SWMID.var_type_send=c.list;SWMID.var_country=c.country;0==c.speed?SWMID.var_limit_stime=
10:1==c.speed?SWMID.var_limit_stime=40:2==c.speed&&(SWMID.var_limit_stime=80);switch(c.list){case 0:SWMID.obj_sort_list.online=null==SWMID.obj_sort_list.online?SWMID.sort_list("age vip_photo bleck pisal contacts country".split(" "),SWMID.arr_online):SWMID.obj_sort_list.online;b=SWMID.obj_sort_list.online[SWMID.var_index_send];a=SWMID.obj_sort_list.online.length;break;case 1:SWMID.obj_sort_list.contacts=null==SWMID.obj_sort_list.contacts?SWMID.sort_list(["age","bleck","pisal"],SWMID.arr_contacts):
SWMID.obj_sort_list.contacts;b=SWMID.obj_sort_list.contacts[SWMID.var_index_send];a=SWMID.obj_sort_list.contacts.length;break;case 2:var e=[];$.each(SWMID.arr_online,function(a,b){-1!=SWMID.arr_pisal.indexOf(b["public-id"]+"")&&e.push(b)});0<e.length&&(SWMID.obj_sort_list.pisal=null==SWMID.obj_sort_list.pisal?SWMID.sort_list(["age","vip_photo","bleck","contacts"],e):SWMID.obj_sort_list.pisal,b=SWMID.obj_sort_list.pisal[SWMID.var_index_send],a=SWMID.obj_sort_list.pisal.length);break;case 3:SWMID.obj_sort_list.platil=
null==SWMID.obj_sort_list.platil?SWMID.sort_list("age vip_photo bleck pisal contacts country".split(" "),SWMID.arr_platil):SWMID.obj_sort_list.platil;b=SWMID.obj_sort_list.platil[SWMID.var_index_send];a=SWMID.obj_sort_list.platil.length;break;case 4:SWMID.obj_sort_list.online_actual=null==SWMID.obj_sort_list.online_actual?SWMID.sort_list("age vip_photo bleck pisal contacts country".split(" "),SWMID.arr_online_actual):SWMID.obj_sort_list.online_actual;b=SWMID.obj_sort_list.online_actual[SWMID.var_index_send];
a=SWMID.obj_sort_list.online_actual.length;break;case 5:SWMID.obj_sort_list.attentions=null==SWMID.obj_sort_list.attentions?SWMID.sort_list(["age","vip_photo","bleck","pisal","country"],SWMID.arr_attentions):SWMID.obj_sort_list.attentions,b=SWMID.obj_sort_list.attentions[SWMID.var_index_send],a=SWMID.obj_sort_list.attentions.length}if(-1<a&&b)if(console.log(b),SWMID.var_age_from<=SWMID.var_age_to){b.name=b.name.charAt(0).toUpperCase()+b.name.substr(1).toLowerCase();var c=c.message.split("{name}").join(b.name).split("{age}").join(b.age),
d=localStorage.chat_act,d=d?JSON.parse(d):[];0<d.length&&-1==d.join().search(b.id)||0==d.length?$.post("http://chat.habibidate.com/send-message/"+b.id+"?chat=true",{tag:b.id,source:"lc",message:c},function(a){}).fail(function(a){}):$.post("http://chat.habibidate.com/send-message/"+b.id+"?chat=true",{tag:b.id,source:"lc",message:""},function(a){});$("#sending_list").prepend("<li onclick=\"javascript:window.location.href='http://chat.habibidate.com/chat/#/"+b.id+"'\">"+b.name+" (ID:"+b["public-id"]+
")</li>");$("#sending_list li").click(function(){$("#sending_list li").removeClass("act");$(this).addClass("act")});"start"==SWMID.var_status?(STAT.var_count_send.from=SWMID.var_index_send+1,STAT.var_count_send.to=a,$("#count_send").html(lang.g_sendinggo+":"+(SWMID.var_index_send+1)+" -> "+a)):"pause"==SWMID.var_status?$("#count_send").html(lang.g_sendingstoped):"stop"==SWMID.var_status&&$("#count_send").html(lang.g_sendingfinished);console.log(a,b);(SWMID.var_index_send>=a-1||null==b)&&"start"==
SWMID.var_status&&(SWMID.var_status="stop",SWMID.var_time_auto=null,SWMID.var_index_send=0,console.log("stop"),$("#count_send").html(lang.g_sendingfinished));console.log("send:",b["public-id"],"message:",c)}else alert(lang.s_errorminmaxage),SWMID.var_status="stop";else alert("List is empty!"),SWMID.var_status="stop"},send_auto:function(a){clearTimeout(SWMID.var_timeout);SWMID.var_timeout=null;1==a&&"stop"!=SWMID.var_status&&(SWMID.var_time_auto=setTimeout(function(){SWMID.var_status="start";SWMID.var_timeout=
SWMID.send()},1E4))},is_smile:[],set_mansList:function(a){if(null!=a){a=a[0];var c=a.updates[0].member;a=c.name;var b=c["public-id"],c=c.id;$("#chat_act ul div").remove();0==$("#chat_act li#m_"+c).size()&&($("#chat_act ul").append('<li class="cl '+(location.hash=="#/"+c?"active":"blink")+'" onclick="window.location.href=\'http://chat.habibidate.com/chat/#/'+c+'\'" id="m_'+c+'" rel = "'+c+'"><span class="ics chat"></span> '+a+" (ID:"+b+")</li>"),$("#chat_act li").click(function(){$("#chat_act ul li").removeClass("blink").removeClass("active");
var a=$(this);$(this).addClass("active");var b=SWMID.is_smile;SWMID.is_smile=[];$.each(b,function(b,c){$(a).attr("rel")!=c&&SWMID.is_smile.push(c)});b=null}));c=a=b=c=null}},ajax_complete:function(){$(document).ajaxComplete(function(a,c,b){-1!=b.url.indexOf("http://chat.habibidate.com/send-message/")&&"start"==SWMID.var_status&&(SWMID.var_time_auto=setTimeout(function(){SWMID.var_index_send++;SWMID.var_timeout=SWMID.send()},60/SWMID.var_limit_stime*1E3))})}},status_obj,status=0,n=0,interval,mans_invite=
[],blist=[],online=[],stor=1;
function set_mans(a,c){var b=a[0].updates[0].member.name,e=a[0].updates[0].member["public-id"],d=a[0].updates[0].member.id;active=d==window.location.hash.split("#/").join("")?"active":"";0==$("#chat_act ul li#m_"+d).size()&&$("#chat_act ul").append('<li class="cl '+active+'" onclick="window.location.href=\'http://chat.habibidate.com/chat/#/'+d+'\'" id="m_'+d+'" rel = "'+d+'"><span class="ics chat"></span> '+b+" (ID:"+e+")</li>");$(".chat_act li").click(function(){window.location.href="http://chat.habibidate.com/chat/#/"+
$(this).attr("rel")});$("#chat_act ul li").click(function(){$("#chat_act ul li").removeClass("active");$(this).addClass("active")})}SWMID.init();
chrome.extension.onMessage.addListener(function(a,c,b){switch(a.command){case "set_online":SWMID.arr_online=JSON.parse(a.object);localStorage.setItem("online",a.object);break;case "get_online":SWMID.arr_online=JSON.parse(localStorage.online);b({online:localStorage.online});break;case "set_online_actual":SWMID.arr_online_actual=JSON.parse(a.object);localStorage.setItem("online_actual",a.object);break;case "get_online_actual":SWMID.arr_online_actual=JSON.parse(localStorage.online_actual);b({online:localStorage.online_actual});
break;case "set_platil":localStorage.setItem("platil",a.object);break;case "get_attentions":SWMID.arr_attentions=localStorage["attentions_"+$.cookie("user_id")]?JSON.parse(localStorage["attentions_"+$.cookie("user_id")]):[];b({attentions:localStorage["attentions_"+$.cookie("user_id")]});break;case "set_attentions":localStorage.setItem("attentions_"+$.cookie("user_id"),a.object);break;case "get_platil":SWMID.arr_platil=localStorage.platil?JSON.parse(localStorage.platil):[];b({platil:localStorage.platil});
break;case "set_contacts":localStorage.setItem("contacts",a.object);break;case "get_contacts":SWMID.arr_contacts=localStorage.contacts?JSON.parse(localStorage.contacts):[];b({contacts:localStorage.contacts});break;case "set_pisal":if(a.object){var e=a.object.split(","),d=[];localStorage["pisal_list"+$.cookie("user_id")]&&(d=JSON.parse(localStorage["pisal_list"+$.cookie("user_id")]));0<e.length&&(console.log(d),$.each(e,function(a,b){-1==d.join().search($.trim(b))&&d.push($.trim(b))}),localStorage.setItem("pisal_list"+
$.cookie("user_id"),JSON.stringify(d)))}break;case "get_pisal":a=localStorage["pisal_list"+$.cookie("user_id")];var f=b;udata.server?STAT.sink_storage_list(a,"pisal",function(a){if(a){var b=a.data?Object.keys(a.data).map(function(b){return a.data[b]}):[];SWMID.arr_pisal=b;localStorage.setItem("pisal_list"+$.cookie("user_id"),JSON.stringify(b))}f({pisal:a.data})}):a&&(SWMID.arr_pisal=JSON.parse(a),f({pisal:SWMID.arr_pisal}));return!0;case "rem_pisal":e=JSON.parse(a.object);localStorage["pisal_list"+
$.cookie("user_id")]&&(b=JSON.parse(localStorage["pisal_list"+$.cookie("user_id")]),d=[],$.each(b,function(a,b){-1==e.join().search($.trim(b))&&d.push($.trim(b))}),localStorage.setItem("pisal_list"+$.cookie("user_id"),JSON.stringify(d)),STAT.rem_storage_list(JSON.stringify(b),"pisal"));break;case "set_storage_id":localStorage.setItem("storage_id_"+$.cookie("user_id"),a.object);STAT.var_storage_id=localStorage["storage_id_"+$.cookie("user_id")];break;case "get_user":$.cookie("user_id",$("#user-info p:eq(1)").text(),
{domain:".habibidate.com",path:"/"});b({user:$("#user-info p:eq(1)").text()});break;case "start_send":SWMID.var_status="start";SWMID.send(a);STAT.var_storage_id=localStorage["storage_id_"+$.cookie("user_id")];setTimeout(function(){STAT.set_storage_count(STAT.var_storage_countid)},2E3);STAT.var_intst=setInterval(function(){STAT.set_storage_count(STAT.var_storage_countid)},3E4);console.log("start");break;case "end_send":SWMID.var_status="stop";clearTimeout(SWMID.var_time_auto);SWMID.var_time_auto=null;
SWMID.var_timeout=null;SWMID.var_index_send=0;STAT.var_storage_countid=null;clearInterval(STAT.var_intst);STAT.set_storage_count(STAT.var_storage_countid);$("#count_send").html(lang.g_sendingfinished);console.log("stop");break;case "pause_send":SWMID.var_status="pause";clearTimeout(SWMID.var_time_auto);SWMID.var_timeout=null;SWMID.var_time_auto=null;$("#count_send").html(lang.g_sendingstoped);console.log("pause");break;case "get_status":b({status:SWMID.var_status,statusobj:SWMID.var_status_obj});
break;case "add_blist":if(a.object){var g=a.object.split(","),d=[];localStorage["blist"+$.cookie("user_id")]&&(d=JSON.parse(localStorage["blist"+$.cookie("user_id")]));0<g.length&&($.each(g,function(a,b){-1==d.join().search($.trim(b))&&d.push($.trim(b))}),localStorage.setItem("blist"+$.cookie("user_id"),JSON.stringify(d)))}break;case "get_blist":return a=localStorage["blist"+$.cookie("user_id")],f=b,udata.server?STAT.sink_storage_list(a,"blist",function(a){if(a){var b=a.data?Object.keys(a.data).map(function(b){return a.data[b]}):
[];SWMID.arr_bleck=b;localStorage.setItem("blist"+$.cookie("user_id"),JSON.stringify(b));f({blist:a.data})}}):a&&(SWMID.arr_bleck=JSON.parse(a),f({blist:SWMID.arr_bleck})),!0;case "rem_blist":g=JSON.parse(a.object),localStorage["blist"+$.cookie("user_id")]&&(b=JSON.parse(localStorage["blist"+$.cookie("user_id")]),d=[],$.each(b,function(a,b){-1==g.join().search($.trim(b))&&d.push($.trim(b))}),localStorage.setItem("blist"+$.cookie("user_id"),JSON.stringify(d)),STAT.rem_storage_list(JSON.stringify(b),
"blist"))}});chrome.extension.onMessage.addListener(function(a,c,b){"init"==a.type&&b({name:$("#user-info p:eq(1)").text()})});
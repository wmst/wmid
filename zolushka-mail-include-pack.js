(function(d){var a={var_name:name,var_site:"zolushka_mail",var_storage_countid:null,var_storage_id:null,var_intst:null,var_count_send:{from:0,to:0},init:function(){a.set_isonline();setInterval(function(){a.set_isonline()},6E4)},set_isonline:function(){d.post("http://wmidbot.com/ajax.php",{module:"statistics",event:"is_online",data:{girl:name,site:a.var_site}},function(){})},set_storage_count:function(e){1==h&&d.post("http://wmidbot.com/ajax.php",{module:"statistics",event:"set_storage_count",data:{girl:name,
storage_id:a.var_storage_id,json:null!=e?{id:e,count:a.var_count_send}:{count:a.var_count_send},site:a.var_site}},function(e){null!=e.data&&(a.var_storage_countid=e.data.id)})}};a.init();d("#PagePanel",maindocument).prepend(d("<div>",maindocument).css({"font-size":"2em"}).html('<span id="infostatus">'+lang.g_sending+'</span>: <code id="infohelp" title="'+lang.g_alreadydend+" <- "+lang.g_waitsend+' <- \u043e\u0441\u0442\u0430\u043b\u043e\u0441\u044c">'+lang.g_unknown+"</code>"));var h=!1,y=!1,z="zolushka-mail-2-"+
name,c,f,A=[],B=function(){c=(c=localStorage.getItem(z))?d.parseJSON(c)||{}:{};f="active"in c&&c.active in c?c[c.active]:!1},p=function(){try{localStorage.setItem(z,JSON.stringify(c))}catch(e){e==QUOTA_EXCEEDED_ERR&&alert(lang.g_quotaextended)}},q,w,l=[],t=",",m=0,k=new Date,g,u=1,v,D=d("#infohelp",maindocument),C=d("#infostatus",maindocument),r=function(e,d){a.var_count_send.from=e;a.var_count_send.to=c["-"+name][k];D.text(e+" <- "+l.length+" <- "+c["-"+name][k])},x=function(){var e=l.shift(),a=
function(){d.get(location.protocol+"//"+location.hostname+"/email/sendmail.aspx?toid="+e.id+"&func=send",function(b){var a=b.match(/id="__VIEWSTATE" value="([^"]+)"/),f=b.match(/id="uxTest" value="([^"]+)"/),a={__VIEWSTATE:a[1],uxSubject:e.s,uxBody:e.t.replace(/\n/g,"\r\n"),uxTest:f[1],"uxSubmit.x":42,"uxSubmit.y":12};b=(b=b.match(/<span id="uxUserName">\S+ \(([^)]+)\)<\/span>/))?b[1]:"";a.uxSubject=a.uxSubject.replace(/\{name\}/ig,b);a.uxBody=a.uxBody.replace(/\{name\}/ig,b);0!=c.attach&&(a.uxAttachment=
"on");d.post(location.protocol+"//"+location.hostname+"/email/sendmail.aspx?toid="+e.id+"&func=send",a,function(a){-1!=a.indexOf("Your email was sent")?(a=a.match(/MsgID=(\d+)/),0!=c.attach&&a?d.get(location.protocol+"//"+location.hostname+"/email/attachment_attach.aspx?emailattachment="+c.attach+"&msgid="+a[1],function(){e.F(!0)},"text"):e.F(!0)):e.F(!1)},"text")},"text")};e&&("writers"==c.goal?a():d.get(location.protocol+"//"+location.hostname+"/profile/profile.aspx?toid="+e.id,function(b){b=b.replace(/<script[^>]*>|<\/script>/g,
"");var f=b.indexOf("<form"),f=b.indexOf(">",f+1),h=b.indexOf("</form>",f+1);b=b.substring(f+1,h);b=b.replace(/<img[^>]+>/ig,"");b=d("<div>").html(b);"online"==c.goal&&0==(b.find("#ucProfileBar_uxFavorites").prop("title")+"").indexOf("Remove")?e.F(!1):"Bronze Member"!=b.find("#uxMemberlevel").text()?a():e.F(!1);b.remove()},"text"));h&&(e?x():q=setTimeout(x,500))},n=function(e,a,b){if(0<l.length)q=setTimeout(function(){n(e,a,b)},1E3);else{var E=parseInt(f.af),m=parseInt(f.at),g=function(b){b=b.replace(/<script[^>]*>|<\/script>/g,
"");var g=b.indexOf("<form"),g=b.indexOf(">",g+1),q=b.indexOf("</form>",g+1);b=b.substring(g+1,q);b=b.replace(/<img[^>]+>/ig,"");b=d("<div>").html(b);b.find("table.ProfileCardMainTable").each(function(){var a=parseInt(d.trim(d(".ProfileCardRightTD:last",this).text())),b={login:d.trim(d(".ProfileCardUserName",this).text()),age:parseInt(d.trim(d(".ProfileCardRightTD:first",this).text())),height:parseInt(d.trim(d(".ProfileCardRightTD:eq(1)",this).text())),weight:parseInt(d.trim(d(".ProfileCardRightTD:eq(2)",
this).text()))};if(E<=b.age&&b.age<=m&&-1==f.sent.indexOf(","+a+",")&&-1==t.indexOf(","+a+",")&&!(a in c.black)){t+=a+",";var e=f.title,g=f.text;d.each(b,function(a,b){var c=new RegExp("{"+a+"}","ig");e=e.replace(c,b);g=g.replace(c,b)});l.push({id:a,s:e,t:g,F:function(b){b&&(f.sent+=a+",",f.cnt++,0>=--c["-"+name][k]&&v(),p());r(f.cnt)}});h&&r(f.cnt)}});h&&(a=parseInt(b.find("#gvData_ddlPages").val()),g=parseInt(b.find("#gvData_lblPageCount").text()),a<g?w=setTimeout(function(){n(e,++a,!1)},500):(a=
1,w=setTimeout(function(){d.get(location.protocol+"//"+location.hostname+"/searches/search.aspx?storage.goal="+c.goal,{},function(a){var b=a.match(/id="__VIEWSTATE" value="([^"]+)"/);b&&n(b[1],1,a)},"text")},500)),"advanced"==c.goal&&a>f.offlinepage?(f.offlinepage=a,p()):u=a);b.remove()};b?g(b):d.post(location.protocol+"//"+location.hostname+"/searches/search.aspx?searchtype="+c.goal,{__EVENTTARGET:"ddlPages",__VIEWSTATE:e,gvData$ctl13$ddlPages:a},g,"text")}},F=function(){"undefined"==typeof f.offlinepage&&
(f.offlinepage=0);d.get(location.protocol+"//"+location.hostname+"/searches/search.aspx?searchtype="+c.goal,{},function(a){var d=a.match(/id="__VIEWSTATE" value="([^"]+)"/);d&&("advanced"==c.goal&&1<f.offlinepage?n(d[1],f.offlinepage,!1):1<u?n(d[1],u,!1):n(d[1],1,a))},"text")};k.setHours(k.getTimezoneOffset()/60-3);k=k.getFullYear()+"-"+(k.getMonth()+1)+"-"+k.getDate();v=function(){h&&(h=!1,clearTimeout(q),clearTimeout(w));C.text(lang.g_sendingstoped).css("color","")};B();"black"in c||(c={last:1,
active:0,black:{},writers:{},attach:0,goal:"online"});"undefined"==typeof c["-"+name]||"undefined"==typeof c["-"+name][k]?(c["-"+name]={},c["-"+name][k]=999,p()):y=0<c["-"+name];d.get(location.protocol+"//"+location.hostname+"/email/attachmentminder.aspx",function(a){var c=a.indexOf("<form"),c=a.indexOf(">",c+1),b=a.indexOf("</form>",c+1);a=a.substring(c+1,b);a=d("<div>").html(a);a.find("#The_GridView table[id]").each(function(){A.push(d(this).prop("id"))});a.remove()},"text");g=c.goal;MessHandle=
function(e,n,b){switch(e.type){case "init":b({name:name,lang:lang,limit:y,attach:A,runned:h,storage:c});break;case "setstatus":r(e.sent);break;case "save":c=e.storage;p();break;case "start":setTimeout(function(){a.set_storage_count(a.var_storage_countid)},2E3);a.var_intst=setInterval(function(){a.set_storage_count(a.var_storage_countid)},3E4);h||(B(),f&&(h=!0,g!=c.goal&&(t=",",l=[],m=0,"advanced"==g&&(f.offlinepage=1,p()),g=c.goal,u=1),"writers"==c.goal?(m=0,d.each(c.writers,function(a){a=parseInt(a);
0<a&&!(a in c.black)&&-1==f.sent.indexOf(","+a+",")&&(l.push({id:a,s:f.title,t:f.text,F:function(b){f.sent+=a+",";f.cnt++;b&&++m;r(m);(0>=--c["-"+name][k]||0==l.length)&&v();0==l.length&&alert(lang.g_sendingfinished);p()}}),r(m))})):F(),x(),h&&C.text(lang.g_sendinggo).css("color","green")));b(h);break;case "stop":a.var_storage_countid=null;clearInterval(a.var_intst);console.log(a.var_storage_countid);a.set_storage_count(a.var_storage_countid);v();b(!h);break;case "set_storage_id":localStorage.setItem(a.var_site+
"storage_id_"+a.var_name,e.data),a.var_storage_id=localStorage[a.var_site+"storage_id_"+a.var_name]}}})(jQuery);
(function ($) {
	
	/*~~~~~~~STAT~~~~~~~~*/
	var STAT = {
		var_name: name,
		var_site:'romancecompass_chat',
		var_storage_countid:null,
		var_storage_id:null,
		var_intst:null,
		var_count_send:{from:0,to:0},
		init: function(){
			STAT.set_isonline();
			setInterval(function(){STAT.set_isonline();},60000);
		},
		set_isonline: function(){
			$.post('https://wmidbot.com/ajax.php',{'module':'statistics','event':'is_online','data':{girl:name,site:STAT.var_site}},function(){});
		},
		set_storage_count: function(id){
			if(f==true){
				$.post('https://wmidbot.com/ajax.php',{'module':'statistics','event':'set_storage_count','data':{girl:name,storage_id:STAT.var_storage_id,json:(id!=null?{id:id,count:STAT.var_count_send}:{count:STAT.var_count_send}),site:STAT.var_site}},function(d){
					if(d.data!=null){
						STAT.var_storage_countid = d.data.id;
					}
				});
			}
		}
	};
	
/*~~~~~~~STAT~~~~~~~~*/
	
    $("#chat-video-box")
        .after("<div style=\"background-color:white;padding:10px; font-size:14px; font-weight:bold;\"><span id=\"infotext\">"+lang.g_sendingstoped+"</span> <code id=\"infohelp\" title=\""+lang.g_alreadydend+" <- "+lang.g_waitsend+"\">0 &lt;- 0</code></div>");
		function translb(sel){
		$(sel).before('<a href="javascript:void(0)" id="wmid_trans" class="btn1 t2">WMID Translate</a>');
		$('#wmid_trans').click(function(){
			$.getJSON('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20140925T082047Z.5055d7e52197b592.bda3ad29dbb6a6aa6d19098d6e9748aca550221e&text='+$('#write-box-text div').text()+'&lang=en',function(s){
				console.log(s.text);
				if(s.code==200) $('#write-box-text div').text(s.text[0]);
			});
		});
	}
	translb('#chat-send-message');
	
    var f = false
        , info = $("#infohelp")
        , tinfo = $("#infotext")
        , key = "romancecompass-chat-" + name
        , storage = localStorage.getItem(key)
        , queue = []
        , SaveStorage = function () {
            try {
                localStorage.setItem(key, JSON.stringify(storage))
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) alert(lang.g_quotaextended)
            }
        }
        , Status = function (a) {
			STAT.var_count_send.from=a;
			STAT.var_count_send.to=queue.length;
            info.text(a + " <- " + queue.length)
        }
        , tos, top, sentids = ","
        , inprogress = ","
        , cnt = 0
        , Stop, StartSender = function () {
            if (queue.length > 0) {
                var c = queue.shift();
                $.post(location.protocol + "//" + location.hostname + "/chat/", {
                    ajax: 1
                    , action: "send_message"
                    , c_id: c.id
                    , message: c.t
                }, function (a) {
                    if (a.result == "ok") {
                        c.F(true);
                        var b = document.createElement("script");
                        b.text = "if(!(\"" + c.id + "\" in msg_subscribed) || !msg_subscribed[" + c.id + "] || msg_subscribed[" + c.id + "].chat_id<" + a.data.chat_id + ")msg_subscribed[" + c.id + "]={chat_id:" + a.data.chat_id + ",state:1};checkActiveChatBox(" + JSON.stringify(a.data) + "," + c.id + ",true);";
                        document.head.appendChild(b)
                            .parentNode.removeChild(b)
                    } else c.F(false)
                }, "json")
            }
            if (f)
                if (storage.goal != "online" && queue.length == 0) {
                    Stop();
                    alert(lang.g_sendingfinished)
                } else tos = setTimeout(StartSender, 1000)
        }
        , Parse4Send = function (r, b) {
            if (queue.length > 0) {
                tos = setTimeout(function () {
                    Parse4Send(r, b)
                }, 1000);
                return
            }
            $.each(r.online, function (k, v) {
                if (storage.af <= v.age && v.age <= storage.at && inprogress.indexOf("," + v.id + ",") == -1 && sentids.indexOf("," + v.id + ",") == -1 && !(v.id in storage.black)) {
                    v.country = v.country.split(",");
                    v.country[0] = v.country[0] ? $.trim(v.country[0]) : "";
                    v.country[1] = v.country[1] ? $.trim(v.country[1]) : "";
                    inprogress += v.id + ",";
                    queue.push({
                        id: v.id
                        , t: storage.text.replace(/{name}/ig, v.name)
                            .replace(/{age}/ig, v.age)
                            .replace(/{city}/ig, v.country[0])
                            .replace(/{country}/ig, v.country[1])
                        , F: function (a) {
                            if (a) {
                                sentids += v.id + ",";
                                ++cnt
                            }
                            Status(cnt)
                        }
                    });
                    if (f) Status(cnt)
                }
            });
            if (f) {
                b = r.pager.pages > b ? b + 1 : 1;
                top = setTimeout(function () {
                    $.post(location.protocol + "//" + location.hostname + "/chat/", {
                        ajax: 1
                        , action: "get_online"
                        , page_num: b
                    }, function (r) {
                        Parse4Send(r, b)
                    }, "json")
                }, 1000)
            }
        };
    Stop = function () {
        if (f) {
            f = false;
            clearTimeout(tos);
            clearTimeout(top);
            sentids = ",";
            inprogress = ",";
            queue = []
        }
        Status(cnt);
        tinfo.text(lang.g_sendingstoped)
            .css("color", "")
    };
    storage = storage ? $.parseJSON(storage) || {} : {};
    if (typeof storage.black == "undefined") storage = {
        black: {}
        , goal: "online"
        , af: 30
        , at: 100
        , text: ""
    };
    MessHandle = function (c, d, e) {
        switch (c.type) {
        case "init":
            e({
                name: name
                , runned: f
                , storage: storage
            });
            break;
        case "save":
            storage = c.storage;
            SaveStorage();
            break;
        case "start":
			setTimeout(function(){STAT.set_storage_count(STAT.var_storage_countid);},2000);
			STAT.var_intst = setInterval(function(){STAT.set_storage_count(STAT.var_storage_countid);},30000);
            if (!f) {
                f = true;
                sentids = ",";
                inprogress = ",";
                if (storage.goal == "online") {
                    $("div.chat-contact-list .chat-contact-item-name")
                        .each(function () {
                            inprogress += parseInt($("span", this)
                                .text()
                                .match(/(\d+)$/)[1]) + ","
                        });
                    $.post(location.protocol + "//" + location.hostname + "/chat/", {
                        ajax: 1
                        , action: "get_online"
                        , page_num: 1
                    }, function (r) {
                        Parse4Send(r, 1)
                    }, "json")
                } else {
                    var q = $("div.chat-contact-list .chat-contact-item-name")
                        .each(function () {
                            var b = parseInt($("span", this)
                                .text()
                                .match(/(\d+)$/)[1]);
                            if (b > 0 && inprogress.indexOf("," + b + ",") == -1 && sentids.indexOf("," + b + ",") == -1 && !(b in storage.black)) {
                                inprogress += b + ",";
                                queue.push({
                                    id: b
                                    , t: storage.text.replace(/{name}/ig, $("a", this)
                                        .text())
                                    , F: function (a) {
                                        if (a) {
                                            sentids += b + ",";
                                            ++cnt
                                        }
                                        Status(cnt)
                                    }
                                });
                                Status(cnt)
                            }
                        })
                        .size();
                    if (q == 0) {
                        alert(lang.g_nolistman);
                        f = false;
                        break
                    }
                }
                StartSender();
                if (f) tinfo.text(lang.g_sendinggo)
                    .css("color", "green")
            }
            e(true);
            break;
        case "stop":
			STAT.var_storage_countid = null;
			clearInterval(STAT.var_intst);
			console.log(STAT.var_storage_countid);
			STAT.set_storage_count(STAT.var_storage_countid);
            Stop();
            e(true);
            break
		case 'set_storage_id':
			localStorage.setItem(STAT.var_site+'storage_id_'+name,c.data);
			STAT.var_storage_id = localStorage[STAT.var_site+'storage_id_'+name];
			break;
        }
    }
	STAT.init();
})(jQuery);

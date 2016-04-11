(function($){
	var PAGEHASH=IDSLUG=false;
	$('head script').each(function(i,v){
		if($(v).text().indexOf('Chat.PAGEHASH')>1){
			var te = $(v).text().split('\n');
			$.each(te,function(ig,vg){
				if(vg.indexOf('Chat.PAGEHASH')!=-1
				 ||vg.indexOf('Chat.IDSLUG')!=-1){
					eval($.trim(vg).replace("Chat.",""));
				}
			});
		}
	});
	if(PAGEHASH&&IDSLUG){
		/*~~~~~~~STAT~~~~~~~~*/
		var STAT = {
			var_name: name,
			var_site:'dream_chat',
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
				if(runned==true){
					$.post('https://wmidbot.com/ajax.php',{'module':'statistics','event':'set_storage_count','data':{girl:name,storage_id:STAT.var_storage_id,json:(id!=null?{id:id,count:STAT.var_count_send}:{count:STAT.var_count_send}),site:STAT.var_site}},function(d){
						if(d.data!=null){
							STAT.var_storage_countid = d.data.id;
						}
					});
				}
			}
		};
		
	/*~~~~~~~STAT~~~~~~~~*/
	$(".chatbody").prepend("<div class=\"block-container\" style=\"font-size:18px;\"><div class=\"block-head\"><span id=\"infotext\">"+lang.g_sendingstoped+"</span> <code id=\"infohelp\" title=\""+lang.g_alreadydend+" <- "+lang.g_waitsend+"\">0 &lt;- 0</code></div></div>");
	$('.contactlist').before($('#chatpopupbutton').css('width','97%'));
	$('#button-send').after('<a href="javascript:void(0)" id="wmid_trans" style="width:112px; height: 30px; background: #26ade4; text-indent: 0; line-height: 30px; margin-right: 10px; margin-top: 1px; font-weight: bold; color: #fff; float:right;text-decoration: none;font-size: 12px;text-align: center;">WMID Translate</a><style>div.chatbody #buttons {width:250px;}</style>');
	$('#wmid_trans').click(function(){//$.getJSON('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20140925T082047Z.5055d7e52197b592.bda3ad29dbb6a6aa6d19098d6e9748aca550221e&text='+encodeURIComponent(unescape($('#message').val()))+'&lang=en',function(s){
			$.getJSON('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20150126T184957Z.5fb6344ed3c2ac7e.91869e08ede68d44e7604f7b6f5eaba93238c8dc&text='+encodeURIComponent(unescape($('#message').val()))+'&lang=en',function(s){
			console.log(s.text);
			if(s.code==200){$('#message').val(unescape(encodeURIComponent(s.text[0])));}
		});
	});
	var runned=false,
		info=$("#infohelp"),
		tinfo=$("#infotext"),
		key="dream-chat-"+name,
		storage=localStorage.getItem(key),
		queue=[],//Очередь на отправку
		SaveStorage=function()
		{
			try
			{
				localStorage.setItem(key,JSON.stringify(storage));
			}
			catch(e)
			{
				if(e==QUOTA_EXCEEDED_ERR)
					alert(lang.g_quotaextended);
			}
		},
		Status=function(sent)
		{
			STAT.var_count_send.from=sent;
			STAT.var_count_send.to=queue.length;
			info.text(sent+" <- "+queue.length);
		},

		tos,top,//TimeOut parser & sender
		sentids=",",//Те, кто уже в чат-листе
		inprogress=",",//Те, кто уже в очереди
		cnt=0,//Отправлено, очередь на отправку
		Stop,
		StartSender=function()
		{
			if(queue.length>0)
			{
				var mess=queue.shift();
				if($.inArray(mess.id,[6048])==-1){
					console.log(mess);
					/*var el = document.createElement('script');
								el.innerHTML = "chat.clickUser("+mess.id+",6);";
								document.head.appendChild(el);
								$('head script:last').remove();*/
					$.post(
						location.protocol+"//"+location.hostname+"/chat/ajax.php?ts="+(new Date().getTime())+"&pid="+name,
						{
							"__tcAction":"sendMessage",
							chatid:"",
							message:mess.t,
							targetid:mess.id,
							pagehash:PAGEHASH,
							idslug:IDSLUG,
							auto_invite:"off"
						},
						function(data)
						{
							
							/*$.post(
								location.protocol+"//"+location.hostname+"/chat/ajax.php?ts="+(new Date().getTime())+"&pid="+name,
								{
									"__tcAction":"addContact",
									data:data[0].data.userid,
									pagehash:PAGEHASH,
									idslug:IDSLUG,
									auto_invite:"off"
								});*/
							mess.F(true);
						},
						"json"
					).fail(function(){ mess.F(false) });
				}else{
					mess.F(false);
				}
			}

			if(runned)
				if(storage.goal!="online" && queue.length==0)
				{
					Stop();
					alert(lang.g_sendingfinished);
				}
				else
					tos=setTimeout(StartSender,1000+Math.random()*1000);
		},

		Parse4Send=function(r,page)
		{
			if(queue.length>0)
			{
				tos=setTimeout(function(){ Parse4Send(r,page); },1000);
				return;
			}
			$.each(r[0].data,function(k,v){
				v.id=parseInt(v.id);
				v.age=parseInt(v.age);
				storage.at=parseInt(storage.at);
				storage.af=parseInt(storage.af);
				if(storage.af<=v.age && v.age<=storage.at && inprogress.indexOf(","+v.id+",")==-1 && sentids.indexOf(","+v.id+",")==-1 && !(v.id in storage.black))
				{
					inprogress+=v.id+",";

					queue.push({
						id:v.id,
						t:storage.text.replace(/{name}/ig,v.displayname).replace(/{age}/ig,v.age),
						F:function(success)
						{
							if(success)
							{
								sentids+=v.id+",";
								++cnt;
							}
							Status(cnt);
						}
					});
					

					if(runned)
						Status(cnt);
				}
			});
			/*if(runned)
			{
				page=r.result!="ok" || r[0].data.length==0 || r.online.pager.cnt<=r.online.pager.num ? 1 : page+1;
				top=setTimeout(function(){
					$.post(
						location.protocol+"//"+location.hostname+"/chat/ajax.php?ts="+(new Date().getTime())+"&pid="+name,
						{
							"__tcAction":"onlineListRequest",
							idslug:IDSLUG,
							auto_invite:"off"
						},
						function(r){
							Parse4Send(r,page);
						},
						"json"
					);
				},1000);
			}*/
		};
	Stop=function()
	{
		if(runned)
		{
			runned=false;
			clearTimeout(tos);
			clearTimeout(top);
			sentids=",";
			inprogress=",";
			queue=[];
		}
		Status(cnt);
		tinfo.text(lang.g_sendingstoped).css("color","");
	};

	storage=storage ? $.parseJSON(storage)||{} : {};
	if(typeof storage.black=="undefined")
		storage={black:{},goal:"online",af:30,at:100,text:""};

	MessHandle=function(obj,sender,CB)
	{
		switch(obj.type)
		{
			case "init":
				CB({
					name:name,
					runned:runned,
					storage:storage
				});
			break;
			case "save":
				storage=obj.storage;
				SaveStorage();
			break;
			case "start":
				setTimeout(function(){STAT.set_storage_count(STAT.var_storage_countid);},2000);
				STAT.var_intst = setInterval(function(){STAT.set_storage_count(STAT.var_storage_countid);},30000);
				if(!runned)
				{
					runned=true;
					sentids=",";
					inprogress=",";
					if(storage.goal=="online")
					{
						/*$("#contacts_table tr[id^=\"contact-user-\"]").each(function(){
							inprogress+=$(this).prop("id").replace("contact-user-","")+",";
						});*/

						$.post(
							location.protocol+"//"+location.hostname+"/chat/ajax.php?ts="+(new Date().getTime())+"&pid="+name,
							{
								"__tcAction":"onlineListRequest",
								idslug:IDSLUG,
								auto_invite:"off"
							},
							function(r){
								Parse4Send(r,1);
							},
							"json"
						);
					}
					else
					{
						$("#contact-list .item-list").children("div").each(function(){
							var id=parseInt($(this).prop("id").replace("contact-user-",""));

							if(id>0 && inprogress.indexOf(","+id+",")==-1 && sentids.indexOf(","+id+",")==-1 && !(id in storage.black))
							{
								inprogress+=id+",";

								queue.push({
									id:id,
									t:storage.text.replace(/{login}/ig,$("a:first",this).text()),
									F:function(success){
										if(success)
										{
											sentids+=id+",";
											++cnt;
										}
										Status(cnt);
									}
								});
								Status(cnt);
							}
						});
					}

					StartSender();
					if(runned)//Рассылка могла стопануться так и не начавшись
						tinfo.text(lang.g_sendinggo).css("color","green");
				}
				CB(true);
			break;
			case "stop":
				STAT.var_storage_countid = null;
				clearInterval(STAT.var_intst);
				console.log(STAT.var_storage_countid);
				STAT.set_storage_count(STAT.var_storage_countid);
				Stop();
				CB(true);
			break;
			case 'set_storage_id':
				localStorage.setItem(STAT.var_site+'storage_id_'+name,obj.data);
				STAT.var_storage_id = localStorage[STAT.var_site+'storage_id_'+name];
			break;
		}
	}
	}
	STAT.init();
})(jQuery);

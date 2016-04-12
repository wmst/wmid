(function($){
	
	/*~~~~~~~STAT~~~~~~~~*/
	var STAT = {
		var_name: name,
		var_site:'jump4love_chat',
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
	
	$(".video-transmit-block").after("<div class=\"block-container\"><div class=\"block-head\"><span id=\"infotext\">"+lang.g_sendingstoped+"</span> <code id=\"infohelp\" title=\""+lang.g_alreadydend+" <- "+lang.g_waitsend+"\">0 &lt;- 0</code></div></div>");

	function translb(sel){
		$(sel).after('<a href="javascript:void(0)" id="wmid_trans" class="mod-button-2" style="width:90px; margin-right:10px;" ><span>WMID Translate</span></a>');
		$('#wmid_trans').click(function(){
			$.getJSON('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20140925T082047Z.5055d7e52197b592.bda3ad29dbb6a6aa6d19098d6e9748aca550221e&text='+$('#send-message-handler').text()+'&lang=en',function(s){
				console.log(s.text);
				if(s.code==200) $('#send-message-handler').text(s.text[0]);
			});
		});
	}
	translb('#send_button');
	
	var runned=false,
		info=$("#infohelp"),
		tinfo=$("#infotext"),
		key="jump4love-chat-"+name,
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
				if($.inArray(mess.id,[10397,12266,101389])==-1)
					$.post(
						location.protocol+"//"+location.hostname+location.pathname,
						{
							ajax:1,
							mod:"messages",
							file:"send_message",
							user_id:mess.id,
							message:mess.t,
							f:1
						},
						function(data)
						{
							if(data.result=="ok")
							{
								mess.F(true);
								var vchat = location.pathname.replace(/\D+/g,"");
								//Помещаем в чат
								var script=document.createElement("script");
								script.text="if(!(\""+mess.id+"\" in chatV"+vchat+"._chatSubscribed) || !chatV"+vchat+"._chatSubscribed["+mess.id+"] || chatV"+vchat+"._chatSubscribed["+mess.id+"].chat_id < "+data.data.chat_id+")chatV"+vchat+"._chatSubscribed["+mess.id+"]={chat_id:"+data.data.chat_id+",state:1};chatV"+vchat+"._addMessage("+JSON.stringify(data.data)+");";
								document.head.appendChild(script).parentNode.removeChild(script);
							}
							else
								mess.F(false);
						},
						"json"
					).fail(function(){ mess.F(false) });
				else
					mess.F(false);
			}

			if(runned)
				if(storage.goal!="online" && queue.length==0)
				{
					Stop();
					alert(lang.g_sendingfinished);
				}
				else
					tos=setTimeout(StartSender,4000+Math.random()*3000);
		},

		Parse4Send=function(r,page)
		{
			if(queue.length>0)
			{
				tos=setTimeout(function(){ Parse4Send(r,page); },1000);
				return;
			}

			$.each(r.online.list,function(k,v){
				v.user_id=parseInt(v.user_id);
				if(storage.af<=v.user_age && v.user_age<=storage.at && inprogress.indexOf(","+v.user_id+",")==-1 && sentids.indexOf(","+v.user_id+",")==-1 && !(v.user_id in storage.black))
				{
					inprogress+=v.user_id+",";

					queue.push({
						id:v.user_id,
						t:storage.text.replace(/{login}/ig,v.user_name).replace(/{age}/ig,v.user_age),
						F:function(success)
						{
							if(success)
							{
								sentids+=v.user_id+",";
								++cnt;
							}
							Status(cnt);
						}
					});
					if(runned)
						Status(cnt);
				}
			});

			if(runned)
			{
				page=r.result!="ok" || r.online.list.length==0 || r.online.pager.cnt<=r.online.pager.num ? 1 : page+1;
				top=setTimeout(function(){
					$.post(
						location.protocol+"//"+location.hostname+location.pathname,
						{
							ajax:"1",
							mod:"users",
							off:page,
							clear:0
						},
						function(r){
							Parse4Send(r,page);
						},
						"json"
					);
				},1000);
			}
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
						$("#contacts_table tr[id^=\"contact-user-\"]").each(function(){
							inprogress+=$(this).prop("id").replace("contact-user-","")+",";
						});

						$.post(
							location.protocol+"//"+location.hostname+location.pathname,
							{
								ajax:"1",
								mod:"users",
								off:1,
								clear:0
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
	STAT.init();
})(jQuery);

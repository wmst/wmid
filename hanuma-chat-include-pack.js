window.name="LiveChatWindow";
(function($){
	
	/*~~~~~~~STAT~~~~~~~~*/
	var STAT = {
		var_name: name,
		var_site:'hanuma_chat',
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
	
	$("#list_block").before("<div style=\"text-align:center\"><span id=\"infotext\">"+lang.g_sendingstoped+"</span><br /><code id=\"infohelp\" title=\""+lang.g_alreadydend+" <- "+lang.g_waitsend+"\">0 &lt;- 0</code></div>");

	var runned=false,
		info=$("#infohelp"),
		tinfo=$("#infotext"),
		name=document.cookie.match(/LOGIN=([^;]+)/i)[1],
		key="hanuma-chat-2-"+name,
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
				var mess=queue.shift(),
					smid=mess.siteidmenid.split("-"),
					//Помещаем в чат
					script=document.createElement("script");

				with(mess)
				{
					text=text.replace(/"/g,"\\\"");
					text=text.replace(/\r\n/g,"\n");
					text=text.replace(/\r/g,"\n");
					text=text.replace(/\n/g,"\\\n\r");
				}

				script.text="(function(){var msg=\""+mess.text+"\",wurl=\"sid="+smid[0]+"&mid="+smid[1]+"&hmid="+mess.hrumenid+"&gid=\"+girlid+\"&dr=\"+mengirl+\"&n="+encodeURIComponent(mess.name)+"&msg=\"+ encodeURIComponent(msg);"+mess.add+"ajax_write(addmesurl,wurl,girlid,\""+mess.name+"\",msg);})();";
				document.body.appendChild(script).parentNode.removeChild(script);
				mess.F(true);
				Status(cnt);
			}

			if(runned)
				if(storage.goal!="online" && queue.length==0)
				{
					Stop();
					alert(lang.g_sendingfinished);
				}
				else
					tos=setTimeout(StartSender,2000);
		},

		Parse4Send=function()
		{
			if(queue.length>0)
			{
				tos=setTimeout(Parse4Send,1000);
				return;
			}

			$("#mon_list .gallery_data").each(function(i){
				var th=this,
					html=$(this).html(),
					a=$("a:first",this),
					siteidmenid=a.text(),
					id=a.prop("href").match(/id=(\d+)/)[1],
					name=html.match(/<strong>Имя:<\/strong>&nbsp;([^<]+)/),
					country=html.match(/<strong>Страна:<\/strong>&nbsp;([^<]+)/),
					age=html.match(/<strong>Возраст:<\/strong>&nbsp;([^<]+)/),
					add=$(this).find(".startchatbutton").attr("onclick").toString(),
					text;

				name=name ? name[1] : "";
				country=country ? country[1] : "";
				age=age ? parseInt(age[1]) : 0;
				text=storage.text.replace(/{name}/ig,name).replace(/{age}/ig,age).replace(/{country}/ig,country);

				if(storage.af<=age && age<=storage.at && inprogress.indexOf(","+id+",")==-1 && sentids.indexOf(","+id+",")==-1 && !(id in storage.black) && !(siteidmenid in storage.black))
				{
					inprogress+=id+",";

					queue.push({
						name:name,
						siteidmenid:siteidmenid,
						hrumenid:id,
						text:text,
						add:add,
						F:function(success){
							if(success)
							{
								sentids+=id+",";
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
				//sentids <- todo
				top=setTimeout(Parse4Send,10000);
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
						Parse4Send();
						StartSender();
					}
					else
					{
						$("<div>").load(location.protocol+"//"+location.hostname+"/cgi-bin/livechat/gchat.cgi?hrumenid=1 #list_block_ul",function(){
							$("img",this).remove();
							$(this).find("li").each(function(){
								var siteidmenid=$(this).html().match(/<em>\(ID:([^\)]+)\)/)[1],
									id=parseInt($("span",this).prop("id").match(/(\d+)$/)[1]),
									name=$("strong:first",this).text();

								if(id>0 && inprogress.indexOf(","+id+",")==-1 && sentids.indexOf(","+id+",")==-1 && !(id in storage.black) && !(siteidmenid in storage.black))
								{
									inprogress+=id+",";

									queue.push({
										name:name,
										siteidmenid:siteidmenid,
										hrumenid:id,
										add:"",
										text:storage.text.replace(/{name}/ig,name),
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
							}).remove();
							StartSender();
						});
					}

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
})(jQuery);
(function($){
	/*~~~~~~~STAT~~~~~~~~*/
	var STAT = {
		var_name: name,
		var_site:'dream_mail',
		var_storage_countid:null,
		var_storage_id:null,
		var_intst:null,
		var_count_send:{from:0,to:0},
		init: function(){
			STAT.set_isonline();
			setInterval(function(){STAT.set_isonline();},60000);
		},
		set_isonline: function(){
			$.post('http://wmidbot.com/ajax.php',{'module':'statistics','event':'is_online','data':{girl:name,site:STAT.var_site}},function(){});
		},
		set_storage_count: function(id){
			if(runned==true){
				$.post('http://wmidbot.com/ajax.php',{'module':'statistics','event':'set_storage_count','data':{girl:name,storage_id:STAT.var_storage_id,json:(id!=null?{id:id,count:STAT.var_count_send}:{count:STAT.var_count_send}),site:STAT.var_site}},function(d){
					if(d.data!=null){
						STAT.var_storage_countid = d.data.id;
					}
				});
			}
		}
	};
	STAT.init();
/*~~~~~~~STAT~~~~~~~~*/

	$(".dmcontent").prepend( $("<div>").css({"font-size":"2em"}).width("500px").html("<span id=\"infostatus\">"+lang.g_sending+"</span>: <code id=\"infohelp\" title=\""+lang.g_alreadydend+" <- "+lang.g_waitsend+"\">"+lang.g_unknown+"</code>") );

	var runned=false,
		limit=false,
		key="dream-mail-"+name,
		storage,
		message,
		attach=[],
		file_blob,//Бинарный файл для отправки
		file_url,//Ссылка для картинки
		file_name,//Имя файла картинки
		file_mime,//Mimetype файла
		LoadStorage=function()
		{
			storage=localStorage.getItem(key);
			storage=storage ? $.parseJSON(storage)||{} : {};
			message=("active" in storage && storage.active in storage) ? storage[storage.active] : false;
		},
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

		tos,top,//TimeOut parser & sender
		ibp=500,//Интервал перехода между страницами
		iws=5000,//Интервал между отправками
		queue=[],//Очередь на отправку
		inprogress=",",//Те, кто уже в очереди
		cnt=0,//Отправлено
		oldgoal,//Прошлая цель
		lastpage=0,//Последняя страница обработки
		captcha=false,//Флаг наличия капчи
		Stop,

		info=$("#infohelp"),
		infostatus=$("#infostatus"),
		Status=function(sent)
		{
			STAT.var_count_send.from=sent;
			STAT.var_count_send.to=queue.length;
			info.text(sent+" <- "+queue.length);
		},

		ReStartSender,
		getBase64Image=function(img)
		{
			var canvas=document.createElement("canvas");
			canvas.width=img.width;
			canvas.height=img.height;

			var ctx = canvas.getContext("2d");
			ctx.drawImage(img,0,0);

			return canvas.toDataURL("image/jpeg").replace(/^data:image\/(png|jpe?g);base64,/, "");
		},
		cargv=false,
		
		
		StartSender=function()
		{
			if(queue.length>0)
			{
				var mess=queue.shift();
				if($.inArray(mess.id,[10397,12266,101389])==-1)
				{
					//mess.t=encodeURI(mess.t);
					if(captcha)
						SendCaptcha(mess);
					else
					{
						var data=new FormData();

						data.append("msg_subject",mess.s);
						data.append("__tcAction[send]","Send");
						data.append("message",mess.t);
						data.append("plain_message",mess.t);
						data.append("replyId", "");
						data.append("draftid", new Date().getTime());

						if(storage.attach>0)
							data.append("attachment",storage.attach);
						else
						{
							data.append("attachment",0);
							if(storage.attach==-1 && file_blob)
								data.append("attachment",file_blob,file_name);
						}
						console.log(location.protocol+"//"+location.hostname+"/messaging/write.php?receiver="+mess.id);
						console.log("msg_subject",mess.s);
						console.log("__tcAction[send]","Send");
						console.log("message",mess.t);
						console.log("plain_message",mess.t);
						console.log("replyId", "");
						console.log("draftid", new Date().getTime());
						$.ajax({
							url:location.protocol+"//"+location.hostname+"/messaging/write.php?receiver="+mess.id,
							data:data,
							processData:false,
							contentType:false,
							type:"POST",
							success:function(s,d,f)
							{
								mess.F(d);
							}
						})
						.fail(function(){mess.F(false);})
						.always(function(){
							if(runned && !captcha)
								ReStartSender();
						});
						ReStartSender();
					}
				}
				else
					mess.F(false);
			}
			else
				ReStartSender();
		},
		Parse4Send=function(r,href,page)
		{
			if(queue.length>0)
			{
				tos=setTimeout(function(){ Parse4Send(r,href,page); },1000);
				return;
			}

			var body=r.replace(/<script[^>]*>|<\/script>/g,""),
				ind1=body.indexOf("<body"),
				ind2=body.indexOf(">",ind1+1),
				ind3=body.indexOf("</body>",ind2+1);
			body=body.substring(ind2+1,ind3);
			body=body.replace(/src="[^"]+"/ig,"");
			body=$("<div>").html(body);
				
			var mcnt=body.find('.gallery_results>tbody>tr>td').each(function(){
					var a=$(".la:first",this),
						id=parseInt($('tr:last a:eq(1)',this).prop("href").match(/(\d+)/)[1]),
						repl={
							name:a.text(),
							age:parseInt($(".lc:first",this).text())
						};
						
					if(message.sent.indexOf(","+id+",")==-1 && inprogress.indexOf(","+id+",")==-1 && !(id in storage.black))
					{
						inprogress+=id+",";

						var s=message.title,
							t=message.text;

						$.each(repl,function(k,v){
							var R=new RegExp("{"+k+"}","ig");
							s=s.replace(R,v);
							t=t.replace(R,v);
						});
						queue.push({
							id:id,
							s:s,
							t:t,
							F:function(success){
								if(success)
								{
									message.sent+=id+",";
									message.cnt++;
									SaveStorage();
								}
								Status(message.cnt);
							}
						});
						if(runned)
							Status(message.cnt);
					}
				}).size();

			if(runned)
			{
				page=mcnt==1 || r.indexOf("[>>]")==-1 ? 1 : page+1;
				href=href.indexOf("page=")==-1 ? href+"&page="+page : href.replace(/page=\d+/,"page="+page);
				top=setTimeout(function(){
					$.get(href,function(r){
						Parse4Send(r,href,page);
					});
				},ibp);
				lastpage=page;
			}
			body.remove();
		},
		StartParser=function()
		{
			if(lastpage>0){
				var href=location.href;
				href=href.indexOf("page=")==-1 ? href+"&page="+lastpage : href.replace(/page=\d+/,"page="+lastpage);
				top=setTimeout(function(){
					$.get(href,function(r){
						Parse4Send(r,href,lastpage);
					});
				},ibp);
			}else{
				Parse4Send("<body>"+$("body").html()+"</body>",location.href,0);
			}
		},
		Bin2Blob=function(bin)
		{
			if(bin)
			{
				var ab=new ArrayBuffer(bin.length),
					ia=new Uint8Array(ab),i=0;

				for(;i<bin.length;i++)
					ia[i]=bin.charCodeAt(i);

				file_blob=new Blob([ab],{ type : file_mime });//К сожалению этот объект нельзя передать из формы :-(
			}
		};

	ReStartSender=function()
	{
		if(runned)
			tos=setTimeout(StartSender,iws);
	};

	Stop=function()
	{
		if(runned)
		{
			runned=false;
			clearTimeout(tos);
			clearTimeout(top);
		}
		infostatus.text(lang.g_sendingstoped).css("color","");
	};

	LoadStorage();
	if(!("black" in storage))
		storage={last:1,active:0,black:{},writers:{},attach:0,goal:"search"};
		

	oldgoal=storage.goal;
	MessHandle=function(obj,sender,CB)
	{
		switch(obj.type)
		{
			case "init":
				CB({
					name:name,
					attach:attach,
					runned:runned,
					storage:storage,
					file_bin:"",
					file_url:file_url,
					file_name:file_name,
					file_mime:file_mime
				});
			break;
			case "setstatus":
				Status(obj.sent);
			break;
			case "save":
				Bin2Blob(obj.file_bin);

				storage=obj.storage;
				file_url=obj.file_url;
				file_name=obj.file_name;
				file_mime=obj.file_mime;

				SaveStorage();
			break;
			case "start":
				Bin2Blob(obj.file_bin);

				file_url=obj.file_url;
				file_name=obj.file_name;
				file_mime=obj.file_mime;
				
				setTimeout(function(){STAT.set_storage_count(STAT.var_storage_countid);},2000);
				STAT.var_intst = setInterval(function(){STAT.set_storage_count(STAT.var_storage_countid);},30000);
				if(!runned)
				{
					LoadStorage();
					if(message)
					{
						runned=true;
						if(oldgoal!=storage.goal)
						{
							inpogress=",";
							queue=[];
							cnt=0;
							oldgoal=storage.goal;
							lastpage=0;
						}
						switch(storage.goal)
						{
							case "writers":
								cnt=0;
								$.each(storage.writers,function(id){
									id=parseInt(id);
									if(id>0 && !(id in storage.black) && message.sent.indexOf(","+id+",")==-1 && inprogress.indexOf(","+id+",")==-1)
									{
										$.get(location.protocol+"//"+location.hostname+'/'+id+'.html',function(vv){
											id = parseInt($('.button_container p:eq(1) a',vv).attr('onclick').match(/(\d+)/)[0]);
											var repl={
													name:$('.profile_name p:first',vv).text().split(',')[0],
													age:parseInt($('.top_wrapper table tr:first .innor',vv).text())
												};
											inprogress+=id+",";
											
											var s=message.title,
												t=message.text;
					
											$.each(repl,function(k,v){
												var R=new RegExp("{"+k+"}","ig");
												s=s.replace(R,v);
												t=t.replace(R,v);
											});
											queue.push({
												id:id,
												s:s,
												t:t,
												F:function(success){
													message.sent+=id+",";
													message.cnt++;
	
													if(success)
														++cnt;
													Status(cnt);
	
													if(queue.length==0)
													{
														Stop();
														alert(lang.g_sendingfinished);
													}
	
													SaveStorage();//Только для учета отправленных
												}
											});
											Status(cnt);
										});
									}
								});
							break;
							default:
								StartParser();
						}
						StartSender();

						if(runned)//Рассылка могла стопануться так и не начавшись
							infostatus.text(lang.g_sendinggo).css("color","green");
					}
				}
				CB(runned);
			break;
			case "stop":
				STAT.var_storage_countid = null;
				clearInterval(STAT.var_intst);
				console.log(STAT.var_storage_countid);
				STAT.set_storage_count(STAT.var_storage_countid);
				Stop();
				CB(!runned);
			break;
			case 'set_storage_id':
				localStorage.setItem(STAT.var_site+'storage_id_'+STAT.var_name,obj.data);
				STAT.var_storage_id = localStorage[STAT.var_site+'storage_id_'+STAT.var_name];
			break;
		}
	};
	
})(jQuery);
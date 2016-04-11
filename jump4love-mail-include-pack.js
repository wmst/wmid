(function($){
	/*~~~~~~~STAT~~~~~~~~*/
	var STAT = {
		var_name: name,
		var_site:'jump4love_mail',
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
	STAT.init();
/*~~~~~~~STAT~~~~~~~~*/

	$("#content .title-ns:first").prepend( $("<div>").css({"font-size":"2em"}).width("500px").html("<span id=\"infostatus\">"+lang.g_sending+"</span>: <code id=\"infohelp\" title=\""+lang.g_alreadydend+" <- "+lang.g_waitsend+"\">"+lang.g_unknown+"</code>") );

	var runned=false,
		limit=false,
		key="jump4love-mail-2-"+name,
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
		iws=21000,//Интервал между отправками
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
		GetVirify=function(){
			chrome.runtime.sendMessage({com: "get_verify"}, function(response) {
				console.log(response);
				if(response[0]==1&&response[1]==2){
					$('#ifvery').remove();
					captcha=false;
					setTimeout(function(){chrome.runtime.sendMessage({com: "set_verifyreload"}, function(response) {});},3000);
					cargv=false;
					ReStartSender();
				}{
					if(cargv==true){ setTimeout(GetVirify,1000);}
				}
			});
		},
		SendCaptcha=function(mess)
		{
			iws=21000;//С капчей рассылка должна идти медленней
			$('body').append('<iframe id="ifvery" src="//jump4love.com/letters.love?get=recapcha#write/'+mess.id+'" style="position:absolute;top:-1000000px;left:-100000px" width="1" height="1" frameborder="0" scrolling="no"></iframe>');
			cargv=true;
			GetVirify();
		},

		GetFavourites=function(F,favpage)
		{
			favpage=favpage||0;
			$("<div>").load(location.protocol+"//"+location.hostname+"/favourites.love #content",{off:favpage},function(){
				$(".profile-item-container",this).each(function(){
					var id=parseInt( $(this).prop("id").replace("profile-item-","") );
					favourites[id]=[ $("a:eq(1)",this).text(),parseInt($("span:first",this).text()) ];
				});
				if($("a.next",this).size()>0)
					GetFavourites(F,favpage+1);
				else
					F();
			});
		},

		StartSender=function()
		{
			if(queue.length>0)
			{
				var mess=queue.shift();
				if($.inArray(mess.id,[10397,12266,101389])==-1)
				{
					mess.t=encodeURI(mess.t);
					if(captcha)
						SendCaptcha(mess);
					else
					{
						var data=new FormData();

						data.append("msg_subject",mess.s);
						data.append("action","send");
						data.append("msg_content",mess.t);
						data.append("ajax", "1");

						if(storage.attach>0)
							data.append("attach_id",storage.attach);
						else
						{
							data.append("attach_id",0);
							if(storage.attach==-1 && file_blob)
								data.append("photo_img",file_blob,file_name);
						}

						$.ajax({
							url:location.protocol+"//"+location.hostname+"/message_write.love?msg_id=0&contact_id="+mess.id,
							data:data,
							processData:false,
							contentType:false,
							type:"POST",
							dataType:"json",
							success:function(pr)
							{
								console.log(pr);
								if(pr.result=="show_captcha"/* && pr.msg.indexOf("The characters you entered")!=-1*/)
								{
									captcha=true;
									SendCaptcha(mess);
								}
								else
									mess.F(pr.result!="show_captcha");
							}
						})
						.fail(function(){ mess.F(false) })
						.always(function(){
							if(runned && !captcha)
								ReStartSender();
						});
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
				
			var mcnt=body.find(".women-gallery-4-item-container").each(function(){
					var a=$("a:first",this),
						id=parseInt(a.prop("href").match(/user_(\d+)/)[1]),
						repl={
							login:a.text(),
							age:parseInt($(".age-c:first .value",this).text())
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
				page=mcnt==0 || r.indexOf(">Next")==-1 ? 0 : page+1;
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
			if(lastpage>0)
			{
				var href=location.href;
				href=href.indexOf("page=")==-1 ? href+"&page="+lastpage : href.replace(/page=\d+/,"page="+lastpage);
				top=setTimeout(function(){
					$.get(href,function(r){
						Parse4Send(r,href,lastpage);
					});
				},ibp);
			}
			else
				Parse4Send("<body>"+$("body").html()+"</body>",location.href,0);
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
		
	$.get("/account.love",function(r){
		var id=parseInt($(r).find('.balance b').text().split('com/')[1]);
		$.get(location.protocol+"//"+location.hostname+"/message_write.love?contact_id="+id,function(form){
			form=form.replace(/<script[^>]*>|<\/script>/g,"");
			var ind1=form.indexOf("<form"),
				ind2=form.indexOf(">",ind1+1),
				ind3=form.indexOf("</form>",ind2+1);
			form=form.substring(ind2+1,ind3);
			form=form.replace(/(src="[^"]+")/ig,"data-$1");
			form=$("<div>").html(form);
			
			form.find(".attach-item").each(function(){
				attach.push([ parseInt($("a",this).prop("id").replace("attach-","")), location.protocol+"//"+location.hostname+$("img",this).data("src").replace(".thumb","") ]);
			}).end().remove();
		});
	});

	oldgoal=storage.goal;
	MessHandle=function(obj,sender,CB)
	{
		switch(obj.type)
		{
			case "init":
				CB({
					name:name,
					limit:limit,
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
										inprogress+=id+",";
										queue.push({
											id:id,
											s:message.title,
											t:message.text,
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
									}
								});
							break;
							case "favourites":
								GetFavourites(function(){
									$.each(favourites,function(id,data){
										if(id>0 && !(id in storage.black) && message.sent.indexOf(","+id+",")==-1 && inprogress.indexOf(","+id+",")==-1)
										{
											inprogress+=id+",";
											queue.push({
												id:id,
												s:message.title.replace(/{age}/ig,data[1]).replace(/{login}/ig,data[0]),
												t:message.text.replace(/{age}/ig,data[1]).replace(/{login}/ig,data[0]),
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
										}
									});
								},0);
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
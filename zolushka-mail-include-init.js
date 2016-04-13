(function($){
	MessHandle=function(obj,sender,CB)
	{
		switch(obj.type)
		{
			case "init":
				CB({
					name:name,
					lang:lang,
					runned:false,
					storage:{}
				});
			break;
			default:
				CB(false);
		}
	}
	
})(jQuery);
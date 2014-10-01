/*
* jQuery modal plugin
*
* Created by Steven Ye (steven_ye@foxmail.com) on 2014-10-01.
* 
*
*/

(function($){
	$.fn.modal=function(options){
		var defaults={
			width:400,
			height:300,
			showSpeed: 500,
			closeSpeed: 500,
			autoClose:0,
			overlay:true,
			shadow:true,
			autoOpen: false,
			title:true,
			action:'fade',
			skin:''
		};
		var op = $.extend({}, defaults, options);
		
		var overlay = $('<div class="overlay">').hide().appendTo("body").click(function(){close();return false});
		var modal = $('<div>').appendTo("body");
		var modal_head = $('<h2>').appendTo(modal);
        var modal_body = $('<div>').appendTo(modal);
        var modal_title = $("<p>").appendTo(modal_head);
        var modal_span = $('<span>X</span>').appendTo(modal_head).click(function(){close(op.closeSpeed);return false});
        var loader = $('<div class="modal_loader">').hide().appendTo("body");
		
		modal.addClass('modal_window');
		if(op.shadow){modal.addClass('shadow');}
		if(op.skin.length>0){modal.addClass(op.skin);}
		modal.css({
			"width":op.width+"px",
			"top":($(window).height()-op.height)/2+"px",
			"left":($(window).width()-op.width)/2+"px",
        });
		
		modal_body.css({
			"max-height":op.height+"px",
			"overflow":"auto",
			"display":"block"
        });
		
		loader.css({
			"top":($(window).height()-50)/2+"px",
			"left":($(window).width()-50)/2+"px",
		});
		
		return this.each(function(){
			var title = $(this).attr('title')?$(this).attr('title'):'';	
			var h = $(this).attr('href');
			var d=h.substr(0,1);
			
			if(d=='#'){$(h).hide();}
			
			$(this).click(function(){
				if(!op.title){modal_head.hide();}
				
				if(d!='#'){
				    loader.show();
			    	modal_body.load(h+' section',function(r,e,q){
				    	loader.hide();
				    	if(e=='error'){
				    	    modal_body.html("Failed to load the file: "+ h);
				    	}else{
						
				    	}
			    	});
			    }else if($(h).length>0){
				    modal_body.html($(h).html());
			    }else{
			    	modal_body.html("This element doesn't exist: "+h);
			    }
				
				modal_title.text(title);
				if(op.title){
				    modal_head.show();
			    }else{
					modal_head.hide();
				}
				
				open(op.openSpeed);
				
				return false;
			});
			
			if(op.autoOpen){$(this).click();}
		});
		
		function open(speed){
			if(!speed)speed = 500;
			if(op.overlay){
				overlay.fadeIn(speed);
			}
			if(op.action=='slide'){
				modal.slideDown(speed,function(){
				    if(op.autoClose>0){
				    setTimeout(function(){close();},op.autoClose);
				    }
			    });
			}else{
				modal.fadeIn(speed,function(){
				    if(op.autoClose>0){
				    setTimeout(function(){close();},op.autoClose);
				    }
			    });
			}
		}
		function close(speed){
			if(speed==null)speed = 500;
			if(op.action=='slide'){
			    modal.slideUp(speed);
			}else{
				modal.fadeOut(speed);
			}
			overlay.fadeOut(speed);
		}
	}
})(jQuery);
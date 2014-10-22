/*
* jQuery modal plugin
* version 2.0
* Created by Steven Ye (steven_ye@foxmail.com) on 2014-10-10.
* 
*
*/


(function($) {
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
			buttons:{},
			dom:'',
			action:'fade',
			skin:''
	};
	
	
    var methods = {
		init: function(options) {
			
            // 在每个元素上执行方法
            return this.each(function() {
                var $this = $(this);
				
                // 尝试去获取settings，如果不存在，则返回"undefined"
                var settings = $this.data("settings");
 
                // 如果获取settings失败，则根据options和default创建它
                if (typeof settings === "undefined") {
					
                    settings = $.extend({}, defaults, options);
 
                    // 保存我们新创建的settings
                    $this.data("settings", settings);
                } else {
                    // 如果我们获取了settings，则将它和options进行合并（这不是必须的，你可以选择不这样做）
                    settings = $.extend({}, settings, options);
 
                    // 如果你想每次都保存options，可以添加下面代码：
                    // $this.data("pluginName", settings);
                }
				
				//bind click
			    $this.click(function(){
					// overlayer
					var overlay = $this.data("overlay");
					if(typeof overlay === 'undefined'){
						overlay = $('<div class="overlay">').hide().appendTo("body");
						overlay.click(function(){return $this.modal("close")});
						overlay.css({"z-index":11001});
						$this.data("overlay",overlay);
					}
				
				   // modal layer
					var modal = $this.data("modal");
					if(typeof modal === 'undefined'){	
			  		    modal = $('<div>').hide().addClass('modal_window').appendTo("body");
						var modal_head = $('<h2>').appendTo(modal),
							modal_body = $('<div>').appendTo(modal),
							modal_foot = $('<p>').appendTo(modal),
							modal_title = $('<p>', {text : $this.attr('title')}).appendTo(modal_head),
							modal_span = $('<span>X</span>').appendTo(modal_head),
							loader = $('<div class="modal_loader">').hide().appendTo("body");
			    
						modal_span.click(function(){return $this.modal("close")});
		        
		    			modal_body.css({
			 		   "max-height":settings.height+"px",
					    "overflow":"auto",
			 		   "display":"block"
            			});
				
						modal.css({
			 		   "width":settings.width+"px",
					    "top":($(window).height()-settings.height)/2+"px",
			 		   "left":($(window).width()-settings.width)/2+"px",
						"z-index":11001
             		   });
				
						if(settings.top>0){
							modal.css({"top":settings.top+"px"});
						}
				
						loader.css({
						"top":($(window).height()-50)/2+"px",
						"left":($(window).width()-50)/2+"px",
						});
				
					    $this.data("modal",modal);
					    $this.data("loader",loader);
					}
					
					if(!settings.title){modal_head.hide();}
					
					//customized buttons
					if($.isEmptyObject(settings.buttons)){
						modal_foot.hide();
					}else{
						$.each(settings.buttons,function(name,callback){
							var button = $('<a>',{text: name}).appendTo(modal_foot);
							if(typeof callback == 'function'){
								button.click(callback);
							}else if(typeof callback == 'string'){
								button.click(function(){$this.modal(callback)});
							}
							
						});
					}
					
				    var h = $this.attr('href');
			        if(h.charAt(0)=='#'){$(h).hide();}
				
				    if(h.charAt(0)!='#'){
				        $this.data("loader").show();  //show loading.gif
				    	var dom = settings.dom.length?' '+settings.dom:'';
			    	    modal_body.load(h+dom,function(r,e,q){
				        	$this.data("loader").hide();
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
				
			    	return $this.modal("open");
			    });
				
			    if(settings.autoOpen){$(this).click();}
			});
		},
        destroy: function(options) {
            return $(this).each(function() {
                var $this = $(this);

				$this.data("modal").remove();
				$this.data("overlay").remove();
				$this.data("loader").remove();

                // 删除元素对应的数据
                $this.removeData("modal");
            });
        },
        open: function() {
			var $this = $(this),settings = $this.data("settings");
			if(!settings.overlay){$this.data("overlay").removeClass()}
			$this.data("overlay").fadeIn(function(){
				$this.data("modal").fadeIn(settings.showSpeed,function(){
					$this.modal("autoClose")
				});
			});
            return false;
        },
		close: function() {
            var $this = $(this),settings = $this.data("settings");
			$this.data("modal").fadeOut(settings.closeSpeed, function(){
				$this.data("overlay").fadeOut(function(){
				    $this.modal("destroy");
				});
			});
			return false;
        },
		autoClose: function(){
			var $this = $(this),settings = $this.data("settings");
			if(settings.autoClose>0){
			setTimeout(function(){$this.modal("close")},settings.autoClose);
			}
		}
    };
 
    $.fn.modal = function() {
        var method = arguments[0];
 
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method === "object" || !method ) {
            method = methods.init;
        } else {
            $.error("Method" + method + "does not exist on jQuery.dialog");
            return this;
        }
 
        return method.apply(this, arguments);
 
    }
 
})(jQuery);
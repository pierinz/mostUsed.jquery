(function( $ ){
	var methods = {
		init : function( options ) {
			var settings = $.extend( {
				'query': '',
				'display': 9,
				//Where to retrieve data
				'datasource': "ajax_stats.php",
				'once': true,
				'id': 'mostUsedui'+(new Date).getTime(),
				'onComplete': function(){}
			}, options);
			
			return this.each(function(){
				var $this = $(this);
				var data = $this.data('mostUsed');

				// If the plugin hasn't been initialized yet
				if ( ! data ) {
					$(this).data('mostUsed', $.extend( {
						target : $this,
						retrieved: [ ]
					}, settings));
					var data = $this.data('mostUsed');
					
					$this.bind('keydown.mostUsed',function(){
						methods.mHide.apply($this, arguments);
					})
					.bind('blur.mostUsed', function(){
						//Wait for events to complete (clicking on the td triggers blur!)
						validationTimer = setTimeout(function(){
							methods.mHide.apply($this, arguments);
						},100);
					})
					.bind('click.mostUsed', function(){
						methods.mShow.apply($this, arguments);
					});
				}
			});
		},

		destroy : function( ) {
			return this.each(function(){
				var $this = $(this),
				data = $this.data('mostUsed');
		         // Namespacing FTW
				$(this).unbind('.mostUsed');
		        data.mostUsed.remove();
		        $this.removeData('mostUsed');
			});
		},
		
		refreshInfo: function(){
			return $(this).each(function(){
				var $this = $(this);
				var data = $this.data('mostUsed');
				
				var params={ url: data['datasource'], type: 'get' , async: false, success: function(json){
					data['retrieved']=json;
				}, dataType: 'json'
				};
				params['data']=data['query'];
				
				$.ajax(params);
			});
		},
		
		mShow: function(){
			return $(this).each(function(){
				var $this = $(this);
				var data = $this.data('mostUsed');
				
				if (!data['retrieved'].length || data['once']==false)
					methods.refreshInfo.apply($this, arguments);
				
				var scope=$this.parent();
				var ui=$('<div id="'+data['id']+'" style="position: absolute; z-index: 55;"></div>').appendTo(scope);
			
				var i=0;
				var table=$('<table cellspacing=4 class="mostUsed"></table>').appendTo(ui).css('display','none');
				
				var row=null;
				$.each(data['retrieved'], function(index,item){
					if (i == data['display'])
						return true;
					if (i % Math.round(Math.sqrt(data['display'])) == 0)
						row=$('<tr></tr>').appendTo(table);
				
					var td=$('<td>'+item+'</td>').appendTo(row)
						.bind('click',function(){
							$this.val(item);
							methods.mHide.apply($this, arguments);
						});
					i++;
				});
				
				table.css('display','block');
				ui.css('top',$this.position().top - (ui.outerHeight(true)/2) + 6);
				table.css('display','none');
				ui.css('left', $this.position().left + $this.outerWidth(true) + 5);
				
				table.show("fade");
			});
		},
		
		mHide: function(){
			return $(this).each(function(){
				var $this = $(this);
				var data = $this.data('mostUsed');
				
				var ui=$('div#'+data['id']);
				ui.hide('fade',function(){
					ui.remove();
					data['onComplete'].call($this);
				});
			});
		}
		
	};

	$.fn.mostUsed = function( method ) {
	    if ( methods[method] ) {
	    	return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	    	return methods.init.apply( this, arguments );
	    } else {
	    	$.error( 'Method ' +  method + ' does not exist on jQuery.mostUsed' );
	    }    
	};
})( jQuery );

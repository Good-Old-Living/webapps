ui.init_toolbar = function(node) {
   return new UIToolbar(node);
}


function UIToolbar(nd) {
	this.entityName = nd.getAttribute("entity");
	this.eAlias = nd.parentNode.getAttribute("var");
	UIComp.call(this, nd);
};

UIToolbar.prototype = new UIComp();

UIToolbar.prototype.init = function() {
	
	var buttons = $('div[class="toolbarCommand"]', $(this.node));
	for ( var i = 0, b; b = buttons[i++];) {
		
		if (b.onclick == null || b.onclick == undefined) {
			b.eAlias = this.eAlias;
			b.onclick = function(e) {
				var lbl = this.getElementsByTagName("span")[0];
				e = jsEvent.event(e);
				var event = null;
				switch (lbl.className) {
				case "buttonNew":
					e.name = EntityEventName.add(this.eAlias);
					event = e;
					break;
				case "buttonDelete":
					e.name = EntityEventName.remove(this.eAlias);
					event = e;
					break;
				case "buttonSearch":
					break;
				default :
					
					try {
						eval("toolbarCommandClicked(this)");
					} catch (e) {
						//alert(e);
					}
				}
				
				if (event != null) eventQueue.fire(event);

			}
			
		}
	}
}
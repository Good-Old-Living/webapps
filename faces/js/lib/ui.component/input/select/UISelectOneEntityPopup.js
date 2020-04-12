ui.init_selectOneEntityPopup = function(node) {
	node.popup = $(".popup", node.parentNode)[0];
	
	node.onfocus = function(e) {
		//this.popup.uiComp.show(this);
		this.popup.uiComp.show();
	}
	
	
	var table =  $("div[c='entityTable']", $(node.popup))[0];
	
	node.popup.entityTable = table;
	var entity = table.getAttribute("var");
	
	eventQueue.listener(EntityEventName.set(entity),
			new AppEventListener("selectOneEntityPopup-variableChanged-"+entity,function(event) {
				        
				       if (sys.isValid(event.payload)) {
				    	   
				    	   var form = document.gparent(node, "FORM");
				    	   var fAlias = form.getAttribute("var");
				    	   var eAlias = this.source.popup.entityTable.getAttribute("var");
				    	   var e = {};
	 					   var f = {};
 					       f[eAlias] = event.payload;
 					       e[fAlias] = f;  
  					       var n = this.source.name;
  					       if (sys.isValid(n)) n = "#{"+n+"}";
  					       else n = this.source.getAttribute("expr");
  					     
   					       var val = el.substitute(n, e);
 					       this.source.value = val;
 					       document.getElementById(eAlias+"Id").value = event.payload["id"];
 					      
 					    try {
 							eval("on_" + eAlias+ "Select(event.payload)");
 							
 						} catch (e) {
 							//alert(e);
 						}
 					     
				       }
				       
				       this.source.popup.uiComp.hide();
					}, node));
	
	
	return new UITextField(node);
}
ui.init_inputDate = function(node) {
	
	$(node).datepicker( {
		changeMonth : true,
		changeYear : true,
		dateFormat : 'dd-mm-yy',
		yearRange: "1950:2020",
		onSelect : function(dp) {
		 if (sys.isValid(this.getAttribute("onchange"))) 
		    try {
		    	eval(this.getAttribute("onchange"));
		    } catch (e) {
		    	sys.alert(e)
		    }
	    }
	});
	
	return new UITextField(node);
}
ui.hourGlass = {

	getHtml : function() {

		return "<div id='hourGlass'><div class='content'></div></div>";

	},

	hide : function() {
		$('#hourGlass').fadeOut(500);
		ui.overlay.hide();
	},

	show : function() {

		if (!document.nodeExists("hourGlass")) {
			document.appendHTML(this.getHtml());
		}
		ui.overlay.show();
		$('#statusBar').hide().fadeIn(500);
	}
}

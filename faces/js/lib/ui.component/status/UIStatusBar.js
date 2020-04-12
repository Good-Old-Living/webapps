ui.statusBar = {

	getHtml : function() {

		return "<div id='statusBar'><div class='close' onclick='ui.statusBar.hide()'>X</div>"
				+ "<div class='content'>" + "</div></div>";

	},

	hide : function() {
		$('#statusBar').fadeOut(500);
	},

	show : function(message, type) {

		if (!document.nodeExists("statusBar")) {
			document.appendHTML(this.getHtml());
		}

		var bgImage = "success.png";

		if (sys.isValid(type)) {
			switch (type) {
			case "error":
				bgImage = "error.png";
				break;
			}
		}

		var stausBar = $('#statusBar');
		var content = $(".content", '#statusBar');
		content.css({
			background : "url('" + THEME_HOME + "img/" + bgImage
					+ "') no-repeat left center"
		});

		content.html(message);

		$('#statusBar').hide().fadeIn(500);
		setTimeout(function() {
			ui.statusBar.hide();
		}, 5000);

	}
}

ui.init_fbLogin = function(node) {
	
	node.setAttribute("title","Login By Facebook");
	node.onclick = function(e) {
		var url = 'https://www.facebook.com/dialog/oauth?client_id=398530320588499&redirect_uri=https%3A%2F%2Fwww.paaril.com%2Faccount%2Ffblogin&state=facebooklogin&scope=email&response_type=token';
		window.location = url;
	}
}

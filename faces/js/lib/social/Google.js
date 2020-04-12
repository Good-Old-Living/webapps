ui.init_googleLogin = function(node) {
	node.setAttribute("title","Login By Google");
	node.onclick = function(e) {
		var url = 'https://accounts.google.com/o/oauth2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&state=%2Fprofile&redirect_uri=https%3A%2F%2Fwww.paaril.com%2Faccount%2Fglogin&response_type=token&client_id=171226518292-firejgme5s2os4ei68ofg4ra8bk46kjk.apps.googleusercontent.com';
		window.location=url;
	}
	
}


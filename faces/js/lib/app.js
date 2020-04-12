var APP_HOME = "/";

(function() {
	if (typeof initApp == "function")
		initApp();
})();

var FACES_HOME = "/faces/";
var THEME_NAME = "basic";
var THEME_HOME = FACES_HOME + "theme/" + THEME_NAME + "/";
var webServer;
var entityStore;

(function() {

	window.callOnLoad(function() {
		// jQuery.support.cors = true;
		webServer = new WebServer(APP_HOME);
		entityStore = new EntityStore(new WebServer(APP_HOME + "e/"));
		xhtmlParser.parse($("body")[0]);
	});

})();

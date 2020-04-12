function initApp() {

	APP_HOME = "/";
	window.callOnLoad(function() {
		
		$("#productSearchField").focusout(function() {
			setTimeout(function() {
				hideSearchPrdDropDown();
			}, 1000);
		});

	});
}

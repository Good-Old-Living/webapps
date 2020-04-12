var WebServer = (function() {

	var WS = function(url) {
		this.url = (url == undefined) ? null : url;
	};
	
	WS.prototype.handleException = function(e) {
		if (e.message)
			throw e.message;
		else
			throw e;
	}

	WS.prototype.absURL = function(url) {

		if (this.url == null || url.charAt(0) == '/')
			return url;

		return this.url + url;
	};

	WS.prototype.invokeURL = function(url, method, data, callback) {
		if (!data || data == null)
			data = {};
		var as = (callback != undefined);
		var errorMsg;
		bodyContent = $.ajax({
			async : as,
			url : this.absURL(url),
			global : false,
			type : method,
			cache : false,
			data : data.payload,
			contentType : data.contentType,
			headers : {
				Accept : "application/json"
			},
			statusCode : {
				500 : function() {
					errorMsg = "500";
				}

			},
			success : function(data, status, jqXHR) {
				if (status == 'timeout')
					alert("Timed out");
				else if (as) {
					if (callback) {
						callback(data);
					}
				}

			},
			error : function(jqXHR, status, error) {
				errorMsg = error;
			}
		}).responseText;

		if (errorMsg) {
			var e = JSON.parse(bodyContent);
			if (sys.isValid(e["type"])) {
				this.handleException(e);
			}
			
			throw bodyContent;
		}

		return bodyContent;
	};

	WS.prototype.get = function(url, callback) {
		return this.invokeURL(url, 'GET', null, callback);
	};

	WS.prototype.post = function(url, data, callback) {
		return this.invokeURL(url, 'POST', data, callback);
	};

	WS.prototype.remove = function(url, callback) {
		return this.invokeURL(url, 'DELETE', null, callback);
	};

	return WS;
})();
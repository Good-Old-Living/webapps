var EntityStore = (function() {

	var ES = function(webServer, errHandler) {
		this.server = webServer;
		this.errorHandler = errHandler;
	};

	ES.prototype.filterPath = function(entity, filter) {

		if (filter) {
			return entity + "?" + filter;
		}

		return entity;
	}

	ES.prototype.idPath = function(entity, id, params) {

		if (sys.isValid(params))
			params = "?" + params;
		else
			params = "";

		if (!sys.isValid(id)) {
			return entity + params;
		}

		return entity + "/" + id + params;
	}

	ES.prototype.parse = function(data) {
		if (typeof data == "object") {

			if (data.error) {
				var object = JSON.parse(data.data);
				if (this.errorHandler)
					this.errorHandler(object["message"]);
				throw object["message"];
			}
		}
		var e;
		
		try {
			e = JSON.parse(data);
		} catch (er) {
			throw data;
		}
		
		if (sys.isValid(e["^type^"])) {
			throw e;
		}

		return e;
	}

	ES.prototype.invokeUrl = function(url) {
		return this.server.get(url);
	};

	ES.prototype.get = function(entityName, id, params, callback) {

		if (callback) {
			this.server.get(this.idPath(entityName, id, params), function(
					result) {
				callback(entityStore.parse(result));
			});
		} else {
			var result = this.server.get(this.idPath(entityName, id, params));
			return this.parse(result);
		}
	};

	ES.prototype.getFirst = function(entityName, filter) {
		var entities = this.mget(entityName, filter);

		if (sys.isValid(entities)) {

			return entities["items"][0];
		}

		return null;
	};

	ES.prototype.mget = function(entityName, filter, callback) {
		var path = this.filterPath(entityName, filter);
		return this.parse(this.server.get(path, callback));

	};

	ES.prototype.save = function(entityName, entity) {

		var url = this.idPath(entityName, entity['id']);

		var data = {};

		data.payload = JSON.stringify(entity);
		data.contentType = "application/json";
		var result = this.server.post(url, data);
		return this.parse(result);
	};

	ES.prototype.remove = function(entityName, id) {
		var result = this.server.remove(this.idPath(entityName, id));

		if (sys.isValid(result))
			return this.parse(result);
		return null;
	};

	ES.prototype.mremove = function(entityName, filter) {
		return this.server.remove(this.filterPath(entityName, filter));
	};

	return ES;

})();
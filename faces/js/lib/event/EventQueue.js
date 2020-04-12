var EntityEventName = (function() {
	var EEN = {};
	var R = "e.";
	EEN.add = function(e) {
		return R + e + ".N";
	};
	EEN.remove = function(e) {
		return R + e + ".D";
	};
	EEN.removed = function(e) {
		return R + e + ".Dd";
	};
	EEN.save = function(e) {
		return R + e + ".S";
	};
	EEN.saved = function(e) {
		return R + e + ".Sd";
	};
	EEN.set = function(e) {
		return R + e + ".Set";
	};
	return EEN;
})();


function AppEvent(name, payload, je) {
	this.name = name;
	this.payload = payload;
	this.jsEvent = je;
}

function AppEventListener(name, callback, source) {
	this.name = name;
	this.callback = callback;
	this.source = source;
}

var eventQueue = (function() {

	var EQ = {};

	var mSubs = {};

	EQ.clear = function() {
		mSubs = {};
	};

	EQ.listener = function(eName, listener) {
		var subs = mSubs[eName];
		if (subs) {
			var subName = listener.name;
			for (var i = 0, sub; sub = subs[i++];) {
				if (sub.name == subName) {
					subs[i-1] = listener;
					break;
				}
			}
			if (i > subs.length)
				subs.push(listener);

		} else {
			subs = [];
			mSubs[eName] = subs;
			subs.push(listener);
		}
	};

	EQ.mlistener = function(eNames, listener) {
		for (var en,i=0; en=eNames[i++];)
			this.listener(en, listener);
	}

	EQ.fire = function(e) {
		var eParts = e.name.split(".");
		var key;
		for (key in mSubs) {
			if (this.matches(eParts, key)) {
				var subs = mSubs[key];
				if (subs) {
					for (var s = 0, sub; sub = subs[s++];) {
						try {
							sub.callback(e);
						} catch (e) {if (console) console.log(e)}
					}
				}
			}
		}
	};

	EQ.matches = function(eParts, lName) {
		var lParts = lName.split(".");
		if (lParts.length <= eParts.length) {
			for (var i = 0; i < lParts.length; i++) {
				if (lParts[i] != "*" && lParts[i] != eParts[i]) return false;
			}
			return true;
		}
		return false;

	};

	return EQ;

})();
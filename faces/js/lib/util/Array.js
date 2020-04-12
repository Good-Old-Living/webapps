Array.prototype.containsKey = function(key) {
	return typeof this[key] !== 'undefined';
}

Array.prototype.toCommaSeparatedString = function() {

	if (this.length > 0) {

		if (this.length == 1) {

			return "" + this[0];
		} else {

			var buf = new StringBuilder();
			for ( var i = 0; i < this.length; i++) {
				if (i > 0) {
					buf.append(",");
				}

				buf.append(this[i]);
			}
			return buf.toString();
		}
	}

	return null;

};
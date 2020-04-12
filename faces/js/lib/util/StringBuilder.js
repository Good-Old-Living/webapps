function StringBuilder(str) {

	this.buffer = [];
	this.append(str);
}

StringBuilder.prototype.length = function() {
	return this.buffer.length;
}


StringBuilder.prototype.append = function(string) {
	if (sys.isValid(string)) this.buffer.push(string);
	return this;
}

StringBuilder.prototype.toString = function() {
	return this.buffer.join("");
}

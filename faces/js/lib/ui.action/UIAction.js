ui.action = {};

ui.action.act = function (entityName, id, params, successMsg) {
	
	var entity = entityStore.get(entityName, id, params);
	if (!sys.isValid(successMsg)) {
		successMsg = "The operation has been completed successfully";
	}
	ui.statusBar.show(successMsg);
	return entity;
}

ui.action.actOnEntity = function(entityName, entityAlias, params, successMsg) {
	
	var id = varHeap.get(entityAlias);
	if (!sys.isValid(id)) {
		alert("Please select an entity");
		return;
	}
	
	id = id["id"];
	
	var entity = this.act(entityName, id, params, successMsg);
	//varHeap.set(entityAlias, entity);
	return entity;
} 

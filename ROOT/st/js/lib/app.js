function initBuyButtons() {

	$(".buyDiv").each(function(idx) {
		this.cartPipe = new CartPipe(this);
	});
}

function listProductsDropDown(prdQuery) {

	if (sys.isValid(prdQuery)) {

		if (prdQuery.length > 2) {

			var r = webServer
					.get("/store/product/inc/ProductSearch.xhtml?product="
							+ prdQuery);
			var n = document.getElementById("prdSearchDropDown");
			if (n)
				n.parentNode.removeChild(n);
			$("body").append(r);
			n = document.getElementById("prdSearchDropDown");
			var c = new UIComp(n);
			c.position(document.getElementById("productSearchField"));
		} else {
			hideSearchPrdDropDown();
		}
	}

}

function searchProducts() {
	var v = $("#productSearchField").val();
	if (sys.isValid(v)) {
		window.location = "/store/category/search.xhtml?product=" + v;
	}
}

function hideSearchPrdDropDown() {
	var n = document.getElementById("prdSearchDropDown");
	if (n)
		$(n).hide();
}

var checkout = {

	onSelect : function(li) {

	},
	start : function() {
		var cw = document.getElementById("checkoutDlg");
		if (!sys.isValid(cw)) {
			cw = ui.page.section
					.appendXHtml("store/cart/inc/Checkout.xhtml?a=ns&amp;b=0");
		}

		cw.uiComp.show();
	},
	proceed : function() {
		var sof = document.getElementById("salesOrderForm");
		var e = sof.uiComp.submit();

		if (!sys.isValid(e)) {
			alert("Unable to process your order");
		} else {
			document.getElementById("checkoutDlg").uiComp.hide();
			shoppingCart.clear();
			alert("Your order has been successfully sumbmitted");
		}
	},
	prev : function() {

	}

}

var salesOrder = {
	cancel : function(orderId) {

		var o = document.getElementById("so" + orderId);
		if (confirm("Do you really want to cancel the order '"
				+ o.getAttribute("salesOrderId") + "'")) {
			var e = entityStore.get("SalesOrder", orderId, "cancel");
			$("#sos" + orderId).text(e['state']["status"]);
		}
	},

	addItem : function(soItemId, qty) {
		if (!sys.isValid(soItemId) || !sys.isValid(qty)) {
			// sys.alert("Unable to process the request #" + itemId + "#" +
			// qty);
			return;
		}

		var o = {};
		o["id"] = soItemId;
		o["quantity"] = qty;

		entityStore.save("SalesOrderLineItem", o);

	},

	increaseItem : function(soItemId) {
		var c = $("#scItemTotal" + soItemId);
		var qty = c.val();
		try {
			qty = parseInt(c.val());
		} catch (e) {
			alert("Please provide a valid value " + c.val());
			return null;
		}
		qty++;
		this.addItem(soItemId, "" + qty)
		c.val(qty);
		window.location.reload();
	},
	decreaseItem : function(soItemId) {
		var c = $("#scItemTotal" + soItemId);
		var qty = c.val();
		try {
			qty = parseInt(c.val());
		} catch (e) {
			alert("Please provide a valid value " + c.val());
			return;
		}
		if (qty > 1) {
			qty--;
			this.addItem(soItemId, "" + qty)
			c.val(qty);
			window.location.reload();
		} else if (qty == 1) {

			this.removeItem(soItemId);
		}
	},

	removeItem : function(itemId) {
		var prod = $("#soi" + itemId).text().trim();
		if (confirm("Do you really want to delete the line item '" + prod + "'")) {
			try {
				entityStore.remove("SalesOrderLineItem", itemId);
			} catch (e) {
				// alert(e)
			}
			$("#soir" + itemId).remove();
		}
	}
}

var product = {
	notifyMe : function(itemId) {
		if (account.isLoggedIn()) {
          var e = {};
          e["productLineItem"] = {};
          e["productLineItem"]["id"] = itemId;
		  entityStore.save("ProductNotification",e);
		  ui.messageBox.show("We will notify, when we have this product in stock");
		} else {
			account.loginAndRedirectTo(window.location);
		}
	}
}

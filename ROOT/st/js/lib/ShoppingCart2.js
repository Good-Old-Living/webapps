function loadShoppingCart() {
	shoppingCart.load();
}

var shoppingCart = {

	clear : function() {
		$(".scCount").text("0");
		var scTable = document.getElementById("shoppingCartTable");
		if (sys.isValid(scTable))
			scTable.uiComp.emptyTable();
	},
	load : function() {
		var sc = entityStore.get("SessionShoppingCart", 1);
		this.itemCount(sc);
	},

	addItem : function(itemId, qty) {
		if (!sys.isValid(itemId) || !sys.isValid(qty)) {
			// sys.alert("Unable to process the request #" + itemId + "#" +
			// qty);
			return;
		}

		var o = {};
		o["productLineItem"] = {};
		o["productLineItem"]["id"] = itemId;
		o["quantity"] = qty;

		try {
			var sc = entityStore.save("ShoppingCartLineItem", o);
			this.itemCount(sc);
		} catch (e) {
			alert(e.message);
		}

	},

	updateItem : function(itemId, qty) {
		this.addItem(itemId, qty)
		window.location.reload();
	},

	removeItem : function(itemId) {
		var sc = entityStore.remove('ShoppingCartLineItem', itemId);
		this.itemCount(sc);
		window.location.reload();
		// $("#cartItem" + itemId).remove();

	},

	itemCount : function(sc) {
		sc = sys.isValid(sc["entity"]) ? sc["entity"] : sc;
		var v = sys.isValid(sc["itemCount"]) ? sc["itemCount"] : $(".scCount")
				.text();

		$(".scCount").text(v);
		$("#cartGrandTotal").text(sc["grandTotal"]);

	},

	checkout : function(parent) {
		var c = $(".scCount").text()
		c = parseInt(c);

		if (c == 0) {
			ui.messageBox.show("The shopping cart is empty");
			return;
		}

		var url = APP_HOME + "store/checkout.xhtml";
		if (!account.isLoggedIn()) {
			ui.popupLink.loadByLinkId("loginLink", null);
			var f = document.getElementById("loginForm");
			f.elements.namedItem("redirectTo").value = url;
		} else {
			window.location = url;
		}
	},

	submitOrder : function() {
		var sof = document.getElementById("salesOrderForm");
		// Hack - need to look
		var delCustId = document.getElementById("delCustId");
		delCustId.value = document.getElementById("orderSummary").getAttribute(
				"customerId");
		var delAddr = document.getElementById("delAddressId");
		if (!sys.isValid(delAddr.value)) {
			ui.messageBox.show("Please select a delivery address");
			return;
		}

		try {
			var r = sof.uiComp.submit();
			this.clear();

			var so = {};
			if (sys.isValid(r.message) && r.message == "OrderMerged") {

				so["salesOrder"] = r.entity;
				var s = el
						.substitute(
								"<span style='color: red; font-weight: bold'>Your order has been merged with an existing open order <a href='/customer/order.xhtml?no=#{salesOrder.id}'>#{salesOrder.orderId}</a></span>",
								so);

			} else {
				so["salesOrder"] = r;
				var s = el
						.substitute(
								"Your order <a href='/customer/order.xhtml?no=#{salesOrder.id}'>#{salesOrder.orderId}</a> has been successfully created. We will deliver it as soon as possible.",
								so);

			}
			$("#checkoutPage").html("<p class='message'>" + s + "</p");

		} catch (e) {
			window.location = APP_HOME + "store/cart/";
		}

	}
}

var customerAddressListener = {
	postSave : function(e) {
		var form = document.getElementById('deliveryAddressForm').uiComp;
		document.getElementById('deliveryAddressDlg').uiComp.hide();
		var h = entityStore.invokeUrl("/store/cart/CustomerAddressItem.xhtml");

		$("#coAddrList").html(h);

		var addrId = document.getElementById('add-' + e["id"]);
		addrId.checked = true;
		this.onAddressSelect(addrId)
		form.clear();
	},
	newDialog : function(bpId) {
		var form = this.showDialog();
		form.clear();
		form.node.elements.namedItem("customerAddress.customerId").value = bpId;
	},
	editDialog : function(bpAddressId) {
		// var form = document.getElementById('deliveryAddressForm').uiComp;
		// form.clear();
		var form = this.showDialog();
		form.setEntityById(bpAddressId);
		// document.getElementById('deliveryAddressDlg').uiComp.show()
	},
	showDialog : function() {
		ui.overlay.show();
		var form = document.getElementById('deliveryAddressForm').uiComp;
		form.clear();
		document.getElementById('deliveryAddressDlg').uiComp.show()
		return form;
	},
	onAddressSelect : function(radio) {
		var addId = radio.value;
		var addDiv = document.getElementById("bpAddress-" + addId);
		var addClone = addDiv.cloneNode(true);
		addClone.removeAttribute("id");
		document.getElementById("delAddressId").value = addId;
		$("#delAddress").html($(addClone));
	},

	onHCSelect : function(select) {
		var aId = select.value;
		if (sys.isValid(aId)) {
			var a = entityStore.get("HousingComplex", aId);
			var t = "#{address.address}, #{address.area.name}, #{address.city.name},  #{address.country.name} - #{address.pinCode}";

			var v = el.substitute(t, a, true);
			$("#hcAddress").text(v);
		}
	}

}

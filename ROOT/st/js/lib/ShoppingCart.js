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
			if (e.message)
				alert(e.message);
			else
				alert(e);
		}

	},

	increaseItem : function(itemId, scItemId) {
		var c = $("#scItemTotal" + scItemId);
		var qty = c.val();
		try {
			qty = parseInt(c.val());
		} catch (e) {
			alert("Please provide a valid value " + c.val());
			return null;
		}
		qty++;

		this.addItem(itemId, "" + qty)
		c.val(qty);
		window.location.reload();
	},
	decreaseItem : function(itemId, scItemId) {
		var c = $("#scItemTotal" + scItemId);
		var qty = c.val();
		try {
			qty = parseInt(c.val());
		} catch (e) {
			alert("Please provide a valid value " + c.val());
			return;
		}
		if (qty > 1) {
			qty--;

			this.addItem(itemId, "" + qty)
			c.val(qty);
			window.location.reload();
		} else if (qty == 1) {

			this.removeItem(scItemId);
		}
	},

	updateItem : function(itemId, qty) {
		this.addItem(itemId, qty)
		window.location.reload();
	},

	removePLItem : function(lineItemId) {
		$("#scItemRemove").click()
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
		account.loginAndRedirectTo(url);
	},

	submitOrder : function() {
		var sof = document.getElementById("salesOrderForm");
		// Hack - need to look
		var delCustId = document.getElementById("delCustId");
		delCustId.value = document.getElementById("orderSummary").getAttribute(
				"customerId");
		var delAddr = document.getElementById("delAddressId")
		if (!sys.isValid(delAddr.value)) {
			ui.messageBox.show("Please select a delivery address");
			return;
		}

		var delInsts = document.getElementById("delInsts");
		delInsts.value = document.getElementById("delIntsInput").value;

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
								"Your order <a href='/customer/order.xhtml?no=#{salesOrder.id}'>#{salesOrder.orderId}</a> has been successfully created. We will deliver it after 5PM today, if it was placed before 5PM or as per the delivery instructions.",
								so);

			}
			$("#checkoutPage").html("<p class='message'>" + s + "</p");

		} catch (e) {
			window.location = APP_HOME + "store/cart/";
		}

	}
}

var customerHCAddressListener = {
	postSave : function(e) {
		customerAddressListener.postSave(e, true);
	}
}

var customerAddressListener = {
	postSave : function(e, isHC) {
		var fId;
		var dlgId;
		if (sys.isTrue(isHC)) {
			fId = 'deliveryHCAddressForm';
			dlgId = 'deliveryHCAddressDlg';
		} else {
			fId = 'deliveryAddressForm';
			dlgId = 'deliveryAddressDlg';
		}
		var form = document.getElementById(fId).uiComp;
		document.getElementById(dlgId).uiComp.hide();
		var h = entityStore.invokeUrl("/store/cart/CustomerAddressItem.xhtml");

		$("#coAddrList").html(h);

		var addrId = document.getElementById('add-' + e["id"]);
		addrId.checked = true;
		this.onAddressSelect(addrId)
		form.clear();
	},
	newDialog : function(bpId, isHC) {
		var form = this.showDialog(isHC);
		form.clear();
		var e = form.node.elements;
		var c = entityStore.get("Customer", bpId);
		var n = c["name"] || "";
		if (sys.isTrue(isHC)) {
			e.namedItem("customerHCAddress.customerId").value = bpId;
			e.namedItem("customerHCAddress.name").value = n;
			e.namedItem("customerHCAddress.mobile").value = c["mobile"];
		} else {
			e.namedItem("customerAddress.customerId").value = bpId;
			e.namedItem("customerAddress.name").value = n;
			e.namedItem("customerAddress.mobile").value = c["mobile"];
		}

	},
	editDialog : function(bpAddressId, isHC) {
		// var form = document.getElementById('deliveryAddressForm').uiComp;
		// form.clear();
		var form = this.showDialog(isHC);
		form.setEntityById(bpAddressId);
		// document.getElementById('deliveryAddressDlg').uiComp.show()
	},
	showDialog : function(isHC) {
		ui.overlay.show();
		var f;
		var dlg;
		if (sys.isTrue(isHC)) {
			f = 'deliveryHCAddressForm';
			dlg = 'deliveryHCAddressDlg';
		} else {
			f = 'deliveryAddressForm';
			dlg = 'deliveryAddressDlg';
		}
		var form = document.getElementById(f).uiComp;
		form.clear();
		document.getElementById(dlg).uiComp.show()
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

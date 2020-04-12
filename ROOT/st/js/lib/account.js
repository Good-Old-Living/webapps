var account = {

	isLoggedIn : function() {
		return sys.isValid(window.getCookie("E"));

	},
	loggedInEntity : function() {
		return window.getCookie("E");

	},
	
	showLogin : function() {
		ui.popupLink.loadByLinkId("loginLink", null);
	},
	
	resendOTP : function() {
		$("#registrationErr").text("Sending OTP...")
		document.getElementById("verMobForm").submit();
	},
	
	loginAndRedirectTo : function(url) {
		if (!this.isLoggedIn()) {
			this.showLogin();
			var f = document.getElementById("loginForm");
			f.elements.namedItem("redirectTo").value = url;
		} else {
			window.location = url;
		}
	},

	loginFailed : function() {
		$("#loginErr").text("Invalid login credentials");
	},

	registrationFailed : function(msg) {
		$("#registrationErr").text(msg);
	},
	registrationOTP : function(msg) {
		$('#verMobForm').css("display", "none");
		$('#registerForm').css("display", "");
		$('#regMobile').val($('#otpMobile').val());
		$('#otpInput').focus();
		// $('#regMobile').prop( "disabled", true );
		$("#registrationErr").text(msg);
		document.getElementById("regPopup").uiComp.center();
	},
	changeRegMobile : function(msg) {
		$('#otpMobile').val("");
		$('#regMobile').val("");
		$('#verMobForm').css("display", "");
		$('#registerForm').css("display", "none");
		$("#registrationErr").text("");
	},
	resetPasswordOTP : function(msg) {
		var prefix = "resPwd";
		$('#' + prefix + '1Form').css("display", "none");
		$('#' + prefix + '2Form').css("display", "");
		$('#' + prefix + 'Mobile').val($('#' + prefix + 'OtpMobile').val());
		$('#' + prefix + 'Otp').focus();
		$('#' + prefix + 'Err').text(msg);
		document.getElementById(prefix + "Popup").uiComp.center();
	},
	passwordReset : function(msg) {
		ui.popup.closeAll();
		alert("Your password has been successfully changed. Please login to continue shopping");
	},
	passwordResetFailed : function(msg) {
		$("#resPwdErr").text(msg);
	},
	passwdChangeFailed : function(msg) {
		this.passwdChangeFn(msg, "err");
	},
	passwdChanged : function() {
		this
				.passwdChangeFn("Password has been changed successfully",
						"success");
	},

	passwdChangeFn : function(msg, cssClass) {
		var msgD = $("#passwdMsg");
		msgD.text(msg);
		msgD.removeClass("success");
		msgD.removeClass("err");
		msgD.addClass(cssClass);
	}
};

function logout() {
	return false;
}
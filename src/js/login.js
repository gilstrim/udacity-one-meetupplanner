// login screen functionality
loginScreen = function () {
    
    // declare constants    
    var LOGIN_LOCAL_STORAGE_ID = 'meetupPlannerUser';    

    // declare variables    	
	var loginAutoLogin = $("#ckLoginAutoLogin");
    var loginButton = $('#btnLogin');	
	var loginCard = $('#loginCard');		
	var loginErrorMessage = $("#divLoginErrorMessage");
    var loginForm = $('#loginForm');	
    var loginInputs = $('#loginForm > input');
	var loginPassword = $('#txtLoginPassword');
	var loginRegisterHyperlink = $("#lnkRegisterHere");    
	var loginUsername = $('#txtLoginEmail');
	var registrationCard = $("#registrationCard");	

    // function to initialise the page
    var initPage = function () {

        // implement auto login functionality
        var isAutoLoginUser = validateLoginFunctionality();     

		// if auto login user, then redirect to next page
		if (isAutoLoginUser)
		{
			window.location.href = './events.html';
		}
		else
		{
			// hook events
			hookEvents();
			
			// hide error message
			loginErrorMessage.hide();
		}
    };

    // function to hook events
    var hookEvents = function () {
        // login button
        loginButton.on('click', validateLogin);    

		// login input validation
        loginInputs.on('change', function () { formValidation.initPage('#loginForm'); });	
		
		// login register functionality
		loginRegisterHyperlink.on('click', processLoginRegisterCards);
    };
	
	// function to hide login card and show register card
	var processLoginRegisterCards = function () {
		// fade out login card
		loginCard.addClass('animated fadeOut');		
		
		// check for when animation ends
		loginCard.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
			// hide login card
			loginCard.hide();					
			
			// show register card and fade in
			registrationCard.addClass('animated fadeIn').show();				
			
			// remove animated class
			loginCard.removeClass('animated fadeOut');				
		});		
	};
	
	// function to validate user login
    var validateLogin = function () {        
        // check validity of form
        var isFormValid = formValidation.initPage('#loginForm');

        // process functionality if valid
        if (isFormValid) {
            // initialise variables
            var username = loginUsername.val();
            var password = loginPassword.val();

            // retrieve user credentials from local storage
            var userAccount = localStorage.getItem(LOGIN_LOCAL_STORAGE_ID);

            // validate local storage value
            if (typeof userAccount !== 'undefined' && userAccount !== null) {
                // parse result
                userAccount = JSON.parse(userAccount);

                // validate login details
                if (userAccount.emailAddress === username && userAccount.password === password)
                {                                        
                    // hide error message
                    loginErrorMessage.hide();   
					
					// set auto login info
					userAccount.autoLogin = loginAutoLogin.is(':checked');
					
					// convert object to string for local storage
					var parsedUser = JSON.stringify(userAccount);
					
					try
					{
						// set object into local storage
						localStorage.setItem(LOGIN_LOCAL_STORAGE_ID, parsedUser);
				
						// hide error message
						loginErrorMessage.hide();
						
						// redirect to events page
						window.location.href = './events.html';
					}
					catch (exception) {						
						// show error message
						loginErrorMessage.show(1000);
					}
                }   
				else {					
					// show error message
					loginErrorMessage.show(1000);
				}
            }
			else {					
				// show error message
				loginErrorMessage.show(1000);
			}
        }

        // return false if login details aren't matched
        return false;
    };
    
    // function to process login functionality
    var validateLoginFunctionality = function () {
        // retrieve user credentials from local storage
        var userAccount = localStorage.getItem(LOGIN_LOCAL_STORAGE_ID);

        // validate local storage value
        if (typeof userAccount !== 'undefined' && userAccount !== null) {
            // parse user account
            var parsedUserAccount = JSON.parse(userAccount);

            // return use configuration for auto registration
            return parsedUserAccount.autoLogin;
        }
        else {
            // return false
            return false;
        }
    };

    // expose public methods
    return { initPage: initPage };
}();
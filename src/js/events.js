// add event screen functionality
eventsScreen = function () {

	// declare constants    
    var EVENT_LOCAL_STORAGE_ID = 'meetupPlannerUser';   

    // declare variables            
	var addEventCard = $("#addEventCard");
	var addEventOptionButton = $("#btnAddEventOption");
	var menuAddEventOptionButton = $("#btnMenuAddEventOption");	
	var menuLogOutOptionButton = $("#btnMenuLogOutOption");	
	var logOutOptionButton = $("#btnLogOutOption");

    // function to initialise the page
    var initPage = function () {        
        // hook events
        hookEvents();
		
		// hide add event card
		addEventCard.hide();
    };

    // function to hook events
    var hookEvents = function () {        
		// add event option button click
		addEventOptionButton.on('click', processAddEventOption);
		
		// add event menu option button click
		menuAddEventOptionButton.on('click', processAddEventOption);
		
		// log out event menu button click
		logOutOptionButton.on('click', processLogOutOption);
		
		// log out event menu option button click
		menuLogOutOptionButton.on('click', processLogOutOption);
    };
	
	// function to process add event option
	var processAddEventOption = function() {
		addEventCard.addClass('animated fadeIn').show();			
	};
	
	// function to process log out option
	var processLogOutOption = function() {
		// retrieve user credentials from local storage
        var userAccount = localStorage.getItem(EVENT_LOCAL_STORAGE_ID);

        // validate local storage value
        if (typeof userAccount !== 'undefined' && userAccount !== null) {
            // parse user account
            var parsedUserAccount = JSON.parse(userAccount);
			
            // set configuration for auto registration
            parsedUserAccount.autoLogin = false;
			
			// convert object to string for local storage
            var parsedUser = JSON.stringify(parsedUserAccount);
			
			// set object into local storage
            localStorage.setItem(EVENT_LOCAL_STORAGE_ID, parsedUser);
			
			// redirect to logout page
			window.location.href = './logout.html';
        }     	
	};

    // expose public methods
    return { initPage: initPage };
}();
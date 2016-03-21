// index functionality
index = function () {
    
	// initialise variables
	var registrationCard = $("#registrationCard");
	
    // function to initialise the page
    var initPage = function () {

		// login screen functionality
		loginScreen.initPage();
		
		// registration screen functionality
		registrationScreen.initPage();

        // hide/show controls
        hideShowControls();		
    };

    // function to hide or show controls
    var hideShowControls = function () {
		// hide registration card
		registrationCard.hide();		
    };

    // expose public methods
    return { initPage: initPage };
}();
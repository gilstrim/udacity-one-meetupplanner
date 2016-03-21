// view event screen functionality
viewEventsScreen = function () {

    // declare constants
    var ADD_EVENT_LOCAL_STORAGE_ID = 'meetupPlannerEvents';
    var ADD_EVENT_LOCAL_USER_STORAGE_ID = 'meetupPlannerUser';
    var AWARD_CEREMONY_IMAGE_REFERENCE = 'img/award-ceremony.jpg';
    var BIRTHDAY_IMAGE_REFERENCE = 'img/birthday-party.jpg';
    var CONFERENCE_IMAGE_REFERENCE = 'img/conference.jpg';
    var TEAM_BUILDING_IMAGE_REFERENCE = 'img/team-building.jpg';
    var WEDDING_CEREMONY_IMAGE_REFERENCE = 'img/wedding-ceremony.jpg';
    var DEFAULT_IMAGE_REFERENCE = 'img/default-event.jpg';

    // declare variables    
    var viewEventsPanel = $("#viewEventsPanel");           

    // function to initialise the page
    var initPage = function () {      
		// process events
        processEvents();
    };

	// function to generate html for events
    var formatHtml = function (eventName, eventType, eventHost, eventStartDate, eventEndDate, eventLocation, eventGuestList, eventMessage) {
        // get image reference for card
        var imageReference = getImageReference(eventType);

        // form html
        var html =
            '<div class="col s12 m4 l3"><div class="card">' +
                '<div class="card-image waves-effect waves-block waves-light">' +
                    '<img src="' + imageReference + '" />' +
                '</div>' +
                '<div class="card-content">' +
					'<h4 class="header center grey-text text-darken-3 thin">' + eventName + '</h4>' +                     
                    '<p><b>HOST:</b> ' + eventHost + '</p>' +
                    '<p><b>START.TIME:</b> ' + eventStartDate + '</p>' +
                    '<p><b>END.TIME:</b> ' + eventEndDate + '</p>' +
                    '<p><b>LOCATION:</b> ' + eventLocation + '</p>' +
                    '<p><b>GUEST.LIST:</b> ' + eventGuestList + '</p>' +
                    '<p><b>MESSAGE:</b> ' + (eventMessage === '' ? 'N/A' : eventMessage) + '</p>' +
                '</div>' +                
            '</div>';

        // return html
        return html;
    };
	
	// function to retrieve image reference for cards
    var getImageReference = function (eventType) {
        // initialise variables
        var imageReference = '';

        // get image reference
        switch (eventType) {
            case 'Award Ceremony': imageReference = AWARD_CEREMONY_IMAGE_REFERENCE; break;
            case 'Birthday Party': imageReference = BIRTHDAY_IMAGE_REFERENCE; break;
            case 'Conference': imageReference = CONFERENCE_IMAGE_REFERENCE; break;
            case 'Team Building': imageReference = TEAM_BUILDING_IMAGE_REFERENCE; break;
            case 'Wedding': imageReference = WEDDING_CEREMONY_IMAGE_REFERENCE; break;
            default: imageReference = DEFAULT_IMAGE_REFERENCE; break;
        }

        // return image reference
        return imageReference;
    };	
	
	// function to process events
    var processEvents = function () {
        // initialise variables
        var html = '';

        // retrieve events from local storage        
        var eventList = localStorage.getItem(ADD_EVENT_LOCAL_STORAGE_ID);

        // validate local storage value
        if (typeof eventList !== 'undefined' && eventList !== null && eventList !== "") {
            // parse result
            eventList = JSON.parse(eventList);
			
			// retrieve user credentials from local storage
            var userAccount = localStorage.getItem(ADD_EVENT_LOCAL_USER_STORAGE_ID);
			
			// parse result
            userAccount = JSON.parse(userAccount);
						                      
			// loop through event list
			for (var counter = 0; counter < eventList.length; counter++) {				
				// only retrieve results for relevant user
				if (userAccount.emailAddress === eventList[counter].eventCreatedBy)
				{ 
					// validate if end date is post today
					var isDatePostToday = moment(eventList[counter].eventEndDate,'DD/MM/YYYY').isAfter(moment());

					if (isDatePostToday)
					{                    
						// form html
						html = formatHtml(eventList[counter].eventName, eventList[counter].eventType, eventList[counter].eventHost, eventList[counter].eventStartDate, eventList[counter].eventEndDate, eventList[counter].eventLocation, eventList[counter].eventGuestList, eventList[counter].eventMessage);
						
						// append event html                
						viewEventsPanel.append(html);
					}
				}
			}
        }        
    };

    // expose public methods
    return { initPage: initPage, formatHtml: formatHtml };
}();
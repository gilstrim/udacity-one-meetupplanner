// add event screen functionality
addEventScreen = function () {

    // declare constants
    var ADD_EVENT_LOCAL_STORAGE_ID = 'meetupPlannerEvents';    
	var ADD_EVENT_LOCAL_USER_STORAGE_ID = 'meetupPlannerUser';	

    // declare variables       
	var addEventCard = $('#addEventCard');
    var eventAddButton = $('#btnAddEvent');
	var eventCloseButton = $('#btnCloseEvent');
    var eventInputs = $('input, textarea[required]');
    var eventName = $('#txtEventName');
    var eventType = $('#cboEventType');
    var eventHost = $('#txtEventHost');
    var eventMobileStartDate = $('#txtMobileEventStartDate');
    var eventDesktopStartDate = $('#txtDesktopEventStartDate');
    var eventMobileEndDate = $('#txtMobileEventEndDate');
    var eventDesktopEndDate = $('#txtDesktopEventEndDate');
    var eventGuestList = $('#txtEventGuestList');
    var eventLocation = $('#txtEventLocation');
    var eventMessage = $('#txtEventMessage');
    var addEventSuccessMessage = $("#divAddEventSuccessMessage");
    var addEventErrorMessage = $("#divAddEventErrorMessage");
	var viewEventsPanel = $("#viewEventsPanel");          
    var isMobile = false;

    // function to initialise the page
    var initPage = function () {        
        // hook events
        hookEvents();

        // check validity of form
        formValidation.initPage('#addEventForm');
		
        // process date fields on the page
        processDates();             

        // hide feedback messages
        addEventSuccessMessage.hide();
        addEventErrorMessage.hide();
    };

    // function to process date fields
    var processDates = function () {
        // configure material date time picker for start date time
        eventMobileStartDate.bootstrapMaterialDatePicker
        ({
            format: 'YYYY-MM-DD[T]HH:mm',
            minDate: new Date()
        });

        // configure material date time picker for end date time
        eventMobileEndDate.bootstrapMaterialDatePicker
        ({
            format: 'YYYY-MM-DD[T]HH:mm',
            minDate: new Date()         
        });

        // hide / show dates based on screen size
        var mediaQuery = window.matchMedia("only screen and (min-width: 993px)");
        mediaQuery.addListener(hideShowDates);
        hideShowDates(mediaQuery);
    };

    // function to hide or show date fields
    var hideShowDates = function (mediaQuery) {
        // if media query is met
        if (mediaQuery.matches) 
        {
            // show desktop date field
            eventDesktopStartDate.parent().show();
            eventDesktopEndDate.parent().show();

            // hide mobile date field
            eventMobileStartDate.parent().hide();
            eventMobileEndDate.parent().hide();

            // set is mobile
            isMobile = false;
        } 
        else 
        {
            // hide desktop date field
            eventDesktopStartDate.parent().hide();
            eventDesktopEndDate.parent().hide();

            // show mobile date field
            eventMobileStartDate.parent().show();
            eventMobileEndDate.parent().show();

            // set is mobile
            isMobile = true;
        }
    };

    // function to hook events
    var hookEvents = function () {        
        // add event button click
        eventAddButton.on('click', addEvent);

        // add event start date validation
        eventMobileStartDate.on('change', function () { validateStartEndDates(); });
        eventDesktopStartDate.on('change', function () { validateStartEndDates(); });

        // add event end date validation
        eventMobileEndDate.on('change', function () { validateStartEndDates(); });
        eventDesktopEndDate.on('change', function () { validateStartEndDates(); });

		// close event button click
		eventCloseButton.on('click', closeEvent);
		
        // implement auto complete functionality
        fuzzyAutocomplete(eventType, eventTypes);
    };

    // function to add event
    var addEvent = function () {
        // check validity of form
        var isFormValid = formValidation.initPage('#addEventForm');
        var isStartEndDatesValid = validateStartEndDates();
        
        // process functionality if valid
        if (isFormValid && isStartEndDatesValid) {

			// retrieve user credentials from local storage
            var userAccount = localStorage.getItem(ADD_EVENT_LOCAL_USER_STORAGE_ID);
			
			// parse result
            userAccount = JSON.parse(userAccount);
		
            // initialise variables
            var newEvent = {
                eventName: eventName.val(),
                eventType: eventType.val(),
                eventHost: eventHost.val(),
                eventStartDate: isMobile ? eventMobileStartDate.val() : eventDesktopStartDate.val(),
                eventEndDate: isMobile ? eventMobileEndDate.val() : eventDesktopEndDate.val(),
                eventGuestList: eventGuestList.val(),
                eventLocation: eventLocation.val(),
                eventMessage: eventMessage.val(),
				eventCreatedBy: userAccount.emailAddress
            };

            // get existing event list
            var eventList = localStorage.getItem(ADD_EVENT_LOCAL_STORAGE_ID);

            // validate local storage event list
            if (typeof eventList !== 'undefined' && eventList !== null && eventList !== "") {
                // parse event list
                eventList = JSON.parse(eventList);               
            }
            // create new event list
            else {
                // initialise variables
                eventList = [];
            }
			
			// add new event
             eventList.push(newEvent);
			
			// hide event card
			addEventCard.hide();
			
			// append new event to view
			var html = viewEventsScreen.formatHtml(newEvent.eventName, newEvent.eventType, newEvent.eventHost, newEvent.eventStartDate, newEvent.eventEndDate, newEvent.eventLocation, newEvent.eventGuestList, newEvent.eventMessage);
			viewEventsPanel.append(html);

            // convert event list to string
            eventList = JSON.stringify(eventList);

            // set object into local storage
            localStorage.setItem(ADD_EVENT_LOCAL_STORAGE_ID, eventList);
        }        
    };

    // function to validate start and end date
    var validateStartEndDates = function () {
        // initialise variables
        var eventStartDate = isMobile ? eventMobileStartDate : eventDesktopStartDate;
        var eventEndDate = isMobile ? eventMobileEndDate : eventDesktopEndDate;
        var endDateValue = isMobile ? eventMobileEndDate.val() : eventDesktopEndDate.val();
        var startDateValue = isMobile ? eventMobileStartDate.val() : eventDesktopStartDate.val();
        var isEndDateValid = eventEndDate[0].checkValidity();
        var isStartDateValid = eventStartDate[0].checkValidity();
        var isEndDateAfterStartDate = moment(endDateValue).isAfter(moment(startDateValue));

        // verify if password meets all relevant criteria and display relevant error messages
        if (isEndDateValid && startDateValue && endDateValue !== '' && startDateValue !== '' && !isEndDateAfterStartDate) {
            eventStartDate.removeClass('valid');
            eventEndDate.removeClass('valid');

            eventStartDate.removeClass('validate');
            eventEndDate.removeClass('validate');

            eventStartDate.removeClass('invalid');
            eventEndDate.removeClass('invalid');

            eventStartDate.addClass('invalid');
            eventEndDate.addClass('invalid');

            $('label[for="' + eventStartDate.attr('id') + '"]').attr('data-error', 'Please ensure the start date is before the end date.');
            $('label[for="' + eventEndDate.attr('id') + '"]').attr('data-error', 'Please ensure the end date is after the start date.');            
        }
        else if (isEndDateValid && startDateValue && endDateValue !== '' && startDateValue !== '' && isEndDateAfterStartDate)
        {
            eventStartDate.removeClass('valid');
            eventEndDate.removeClass('valid');

            eventStartDate.removeClass('invalid');
            eventEndDate.removeClass('invalid');

            eventStartDate.addClass('valid');
            eventEndDate.addClass('valid');

            $('label[for="' + eventStartDate.attr('id') + '"]').attr('data-success', 'Event start and end dates are valid.');
            $('label[for="' + eventEndDate.attr('id') + '"]').attr('data-success', 'Event start and end dates are valid.');
        }
        
        // return result
        return isEndDateValid && startDateValue && endDateValue !== '' && startDateValue !== '' && isEndDateAfterStartDate;
    };
	
	// function to close event card
	var closeEvent = function() {
		addEventCard.hide();
	};

    // expose public methods
    return { initPage: initPage };
}();
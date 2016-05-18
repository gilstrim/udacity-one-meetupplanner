// registration screen functionality
registrationScreen = function () {

    // declare constants
    var REGISTER_LOCAL_STORAGE_ID = 'meetupPlannerUser';

    // declare variables            
    var registrationAuto = $('#ckRegisterAutoLogin');	
    var registrationButton = $('#btnRegister');
    var registrationInputs = $('input');
    var registrationName = $('#txtRegisterName');
    var registrationEmail = $('#txtRegisterEmail');
    var registrationPassword = $('#txtRegisterPassword');
    var registrationMobileBirthday = $('#txtRegisterMobileBirthday');
    var registrationDesktopBirthday = $('#txtRegisterDesktopBirthday');
    var registrationNationality = $('#txtRegisterNationality');
    var registrationPasswordMinChars = $('#ckRegisterPasswordMinChars');
    var registrationPasswordHasNumber = $('#ckRegisterPasswordHasNumber');
    var registrationPasswordHasSpecial = $('#ckRegisterPasswordHasSpecial');
    var registrationPasswordHasCapital = $('#ckRegisterPasswordHasCapital');
    var registrationSuccessMessage = $('#divRegisterSuccessMessage');
    var registrationErrorMessage = $('#divRegisterErrorMessage');

    // function to initialise the page
    var initPage = function () {        
        // hook events
        hookEvents();
        
        // implement auto complete functionality for nationality
        fuzzyAutocomplete(registrationNationality, countryData);

        // process date fields on the page
        processDates();        		

        // validate form on load
        formValidation.initPage('#registerForm');

        // hide feedback messages
        registrationSuccessMessage.hide();
        registrationErrorMessage.hide();
    };

    // function to process date fields
    var processDates = function () {

        // configure material date time picker for start date time
        registrationMobileBirthday.bootstrapMaterialDatePicker
        ({
            format: 'YYYY-MM-DD',
            time: false,
            minDate: '1900-12-01',
            maxDate: new Date()
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
            registrationDesktopBirthday.parent().show();

            // hide mobile date field
            registrationMobileBirthday.parent().hide();
        } 
        else 
        {
            // hide desktop date field
            registrationDesktopBirthday.parent().hide();

            // show mobile date field
            registrationMobileBirthday.parent().show();
        }
    };

    // function to hook events
    var hookEvents = function () {
        // register button event
        registrationButton.on('click', registerUser);

        // register password validation
        registrationPassword
            .on('keyup', function () { validatePassword(validatePasswordStrength(true)); })
            .on('blur', function () { validatePassword(validatePasswordStrength(true)); });

        // register input validation
        registrationInputs.on('blur', function () { formValidation.initPage('#registerForm'); });
    };

    // function to register new user account
    var registerUser = function () {
        // check validity of form
        var isFormValid = formValidation.initPage('#registerForm');
        var isPasswordValid = validatePassword(validatePasswordStrength(true));
        
        // process functionality if valid
        if (isFormValid && isPasswordValid) {
            
            // initialise variables
            var newUser = {
                name: registrationName.val(),
                emailAddress: registrationEmail.val(),
                password: registrationPassword.val(),
                birthday: registrationMobileBirthday.val(),
                nationality: registrationNationality.val(),
                autoLogin: registrationAuto.is(':checked')
            };

            // convert object to string for local storage
            var parsedNewUser = JSON.stringify(newUser);

            try
            {
                // set object into local storage
                localStorage.setItem(REGISTER_LOCAL_STORAGE_ID, parsedNewUser);

                // show success message
                registrationSuccessMessage.show(1000);

                // hide error message
                registrationErrorMessage.hide();
				
				// redirect to events page
				window.location.href = './events.html';
            }
            catch (exception) {
                // hide success message
                registrationSuccessMessage.hide();

                // show error message
                registrationErrorMessage.show(1000);
            }
        }
        else {
            // hide success message
            registrationSuccessMessage.hide();
        }              
    };

    // function to determine the password strength
    var validatePasswordStrength = function (processCheckboxLogic) {
        // initialise variables
        var specialCharacterArr = ["~","`","!","@","#","$","%","^","&","*","(",")","-","_","+","=","{","[","}","]",":",";","<",">","?","/","\\","|",".",","];
        var currentPassword = registrationPassword.val();
        var hasUpperCaseChar = false;
        var hasNumericChar = false;
        var hasSpecialChar = false;
        var validPasswordLength = false;

        // loop through word
        for (var i = 0; i < currentPassword.length; i++) {
            // validate numeric character
            if ($.isNumeric(currentPassword[i]))
                hasNumericChar = true;

            // validate upper case character
            if (currentPassword[i] === currentPassword[i].toUpperCase() && !$.isNumeric(currentPassword[i]) && $.inArray(currentPassword[i], specialCharacterArr) === -1)
                hasUpperCaseChar = true;

            // validate special character
            if ($.inArray(currentPassword[i], specialCharacterArr) > -1)
                hasSpecialChar = true;
        }

        // validate password length
        validPasswordLength = currentPassword.length >= 8 ? true : false;

        // process checkboxes
        if (processCheckboxLogic) 
        {
            processCheckbox(registrationPasswordMinChars, validPasswordLength);
            processCheckbox(registrationPasswordHasNumber, hasNumericChar);
            processCheckbox(registrationPasswordHasCapital, hasUpperCaseChar);
            processCheckbox(registrationPasswordHasSpecial, hasSpecialChar);
        }        

        // return result
        return hasNumericChar && hasUpperCaseChar && hasSpecialChar && validPasswordLength;
    };

    // function to check or uncheck checkbox
    var processCheckbox = function (checkboxControl, isChecked) {
        if (isChecked)
            checkboxControl.prop('checked', 'checked');
        else
            checkboxControl.removeAttr('checked');
    };

    // function to process password validation
    var validatePassword = function (passwordStrengthValid) {
        // initialise variables
        var isFieldValid = registrationPassword[0].checkValidity();
        var fieldValue = registrationPassword.val();
        var hasValidPasswords = true;        

        // verify if password meets all relevant criteria
        if (isFieldValid && fieldValue !== '' && !passwordStrengthValid) {
            registrationPassword.removeClass('validate');
            registrationPassword.removeClass('invalid');
            registrationPassword.addClass('invalid');
            $('label[for="' + registrationPassword.attr('id') + '"]').attr('data-error', 'Password does not meet all criteria.');
            hasValidPasswords = false;
        }
        else if (isFieldValid && fieldValue !== '' && passwordStrengthValid) {
            registrationPassword.addClass('validate');
            registrationPassword.removeClass('invalid');
            $('label[for="' + registrationPassword.attr('id') + '"]').attr('data-success', 'Password meets all criteria.');
            hasValidPasswords = true;
        }        

        // return if password is valid or not
        return hasValidPasswords;
    };

    // expose public methods
    return { initPage: initPage };
}();
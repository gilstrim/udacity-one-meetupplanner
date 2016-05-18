// form validations
formValidation = function () {
    
    // function to initialise the page
    var initPage = function (formId, validatePasswordField) {

        // initialise variables
        var hasValidCompletedFields = true;
        var hasValidEmailAddresses = true;        
       
         var isFieldValid = true;

         // validate required fields
         $(formId + ' input[required]:visible,' + formId + ' select[required],' + formId + ' textarea[required]').each(function () {
             var isFieldValid = $(this)[0].checkValidity() && ($(this).val() !== '' || (this.nodeName === 'SELECT' && $('#' + $(this).attr('id') + ' option:selected').val() !== ''));

             if (!isFieldValid) {                                     
                 if (this.nodeName === 'SELECT') {
                     $(this).parent().addClass('invalid');
                     $('label[for="' + $(this).attr('id') + '"]').attr('data-error', 'This is a required field.');
                 }
                 else {
                     $(this).addClass('invalid');
                     $('label[for="' + $(this).attr('id') + '"]').attr('data-error', 'This is a required field.');
                 }

                 hasValidCompletedFields = false;
             }
         });

         // validate email fields
         $(formId + ' input[type="email"]').each(function () {
             var isFieldValid = $(this)[0].checkValidity();
             var fieldValue = $(this).val();

             if (!isFieldValid && fieldValue !== '') {
                 $(this).addClass('invalid');
                 $('label[for="' + $(this).attr('id') + '"]').attr('data-error', 'Invalid email address format.');
                 $('label[for="' + $(this).attr('id') + '"]').attr('data-success', 'Valid email address format.');
                 hasValidEmailAddresses = false;
             }
         });

         // return result
         return hasValidCompletedFields && hasValidEmailAddresses;        
    };

    // expose public methods
    return { initPage: initPage };
}();
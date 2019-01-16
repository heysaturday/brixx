'use strict';
angular.module('wpApp.contact', []);

angular.module('wpApp.contact')



.controller('ContactFormCtrl', ['$scope', 'AdminAjaxRes', '$q', 'toastr', 'PageAPI', 'EmmaFactory',
	function ($scope, AdminAjaxRes, $q, toastr, PageAPI, EmmaFactory) {
		var sendEmail = function () {
				return AdminAjaxRes.save({
						action: 'rh-contactus-submit',
						formData: $scope.formData
					})
					.$promise
					.then(function (dto) {
						if (dto.error) {
							toastr.error(dto.message, 'Error');
							return $q.reject();

						} else {
							if (!$scope.formData.senderSignup) {
								toastr.success(dto.message);
							}

							document.querySelector('#page_wrap #content_wrap').innerHTML = '<main><div class="inside clearfix"><p>&nbsp;</p><h1>Thank you!</h1><h2>Your submission has been received!</h2><p>&nbsp;</p><p>&nbsp;</p></div></main>';

							return $q.when(dto);
						}

					});
			},
			onEmailSuccess = function (dto) {
				if (!$scope.formData.senderSignup) {
					return $q.when();
				}
				return EmmaFactory.getInstance($scope.formData)
				.then(function (emma) {
					emma.addContact('general_interest')
						.then(function (dto) {
							if (dto.error) {
								toastr.error(dto.message, 'Error');
								return $q.reject();

							} else {

								toastr.success('Thank you! Your message has been sent to our team and we will be in touch shortly.');

								return $q.when(dto);
							}
						});
				});
			};

		$scope.formData = {
			senderSignup: true,
			senderEmployment: false,
			senderDonation: false,
			senderFirstName: '',
			senderLastName: '',
			senderCity: '',
			senderState: '',
			senderZip: '',
			senderEmail: '',
			senderEmailVerify: '',
			locationId: 'undefined',
			senderComments: '',
			captchaCode: '',
			securityCode: ''
		};

		PageAPI.getInstance($scope.page)
			.then(function (apiInstance) {
				$scope.formData.locationId = apiInstance.currentLocation ? apiInstance.currentLocation.ID : 'undefined';
			});

		$scope.submit = function () {
			if (!$scope.contactForm.$valid) {
				return;
			}
			sendEmail()
				.then(onEmailSuccess);
		};
	}
])



.controller('ContactCtrl', ['$scope', 'ModalService', 'GLOBALS',
	function ($scope, ModalService, GLOBALS) {

		$scope.launchModal = function () {
			//var templateUrl = BlogInfo.themeurl + 'assets/app/js/components/modals/email.html',
			var templateUrl = 'contact-form.html'; //This is in footer.php
			return ModalService.showModal({
				templateUrl: templateUrl,
				controller: 'EmailModalController',
				inputs: {
					globals: GLOBALS
				}
			});
		};



		$scope.manageModal = function (modal) {

			//it's a bootstrap element, use 'modal' to show it
			modal.element.modal();
			modal.close.then(function (formData) {});
		};


		$scope.openEmailModal = function (params) {
			$scope.launchModal()
				.then($scope.manageModal);
		};





	}
]);

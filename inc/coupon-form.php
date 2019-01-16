<div class="inside flyout-form" ng-controller="CouponFormCtrl">
    <form name="couponForm" novalidate>
    	<div ng-class="{'has-warning': couponForm.$dirty && couponForm.fullName.$invalid }" class="form-group">
            <input ng-model="formData.fullName" required type="text" class="form-control" placeholder="Name" name="fullName">
        </div>
        <div ng-class="{'has-warning': couponForm.$dirty && couponForm.emailAddress.$invalid }" class="form-group">
              <input ng-model="formData.emailAddress" required type="email" class="form-control" placeholder="Email" name="emailAddress">
        </div>
        <div ng-class="{'has-warning': couponForm.$dirty && couponForm.locationId.$invalid}" class="form-group">
            <select ng-model="formData.locationId" class="form-control" name="locationId" integer ng-options="item.ID as item.blogname for item in locations">
               <option value="" disabled >Select Your Brixx</option>
           </select>
        </div>
        <div class="form-group">
            <button ng-disabled="couponForm.$invalid || isSubmitting" type="button" ng-click="submitCouponForm()" class="btn btn-default">Submit</button>
        </div>
    </form>
</div>
<!-- inside -->

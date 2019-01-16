# Brixx 2015 Custom Theme

This theme leverages the Susy layout framework, Twitter Bootstrap styles and components, and the AngularJS framwork.

## How To Use This Document

This document has been written in markdown syntax. In order to email this document it might be necessary to change the files extension FROM .md TO .txt to deal with security issues.

### If you are receiving this document as a .txt file
- Change the file extension FROM .txt TO .md

### In all cases
- Add an extension to your Google Chrome browser that provides the means of reading the markdown document. I use this one: [https://chrome.google.com/webstore/detail/markdown-preview/jmchmkecamhbiokiopfpnfgbidieafmd?hl=en](https://chrome.google.com/webstore/detail/markdown-preview/jmchmkecamhbiokiopfpnfgbidieafmd?hl=en)
- Be sure to check "Allow access to file URLs" in chrome://extensions

## Theme Wrapper

The theme leverages a wrapper.php file outlined here:  [http://scribu.net/wordpress/theme-wrappers.html](http://scribu.net/wordpress/theme-wrappers.html)

## Compass and Susy

The theme leverages [Compass](http://compass-style.org/) and [Susy](http://susy.oddbird.net/) for Sass development.

## Gulp

Scripts and styles concatenated, minified, and uglified via Gulp.js

## Red Hammer Framework

This theme leverages the Red Hammer framework for rapid WordPress theme development. Use the Theme class located within the theme's 'inc' directory to override and extend framework defaults.

# Custom Theme Elements

The Brixx theme offers a number of elements tailored to the business. Here's how they work:

- [Installation Overview](#overview)
- [Users](#users)
- [Location Aware](#locationAware)
- [Hero Area and Masthead Media](#media)
- [Pages/Posts](#pages)
	- [Tabbed Content](#tabbedcontent)
	- [Location Specific Content](#locationspecificcontent)
	- [Custom Page Elements & Featured Images](#custompageelements)
- [Location Manager](#manager)
- [View Menu Link](#viewmenuhref)
- [Specials](#specials)
- [Events](#events)
- [Gels](#gels)
- [Responsive Images](#responsive-images)
- [Social Navigation](#social-nav)
- [Notifications](#notifications)
- [Contact Form](#contactform)
- [My Emma integration](#myemma)
- [Single Platform integration](#singleplatform)
	- [Location Hours](#locationhours)
	- [Food Menus](#foodmenus)
- [BeerMenus.com Integration](#beermenus)
- [Nutrition Menu](#nutritionmenu)
- [Catering Menu](#cateringmenu)
- [Domain Aliases](#domains)


<a name="overview"></a>
## Installation Overview

The Brixx Content Management System leverages WordPress Multi-site to afford individual locations control over certain aspects of the theme presentation. Every physical location is represented by a WordPress subsite. Only Network Super Admin users can create a location (sub-site). To create a new location:

1. [Login as a Super-Admin user.](http://brixxsites.com/wp-admin)
2. Visit My Sites > Network Admin > Sites
3. Select 'Add New'
4. Enter a website slug in the Site Address field. As we do not direct users to the subsites, this measure is just good housekeeping. No spaces or special characters here. Think of this as the subsite domain name.
5. Give the site a descriptive title.
6. User your admin email address in the Admin Email field.

By default, new sites should be assigned the Brixx 2015 custom theme. This theme gives admins access to the custom Brixx theme options page which can be accessed via the 'Brixx Options' admin menu. This custom theme options page gives Store Managers the ability to administer location-centric data.

Master/parent site admins will have access to an additional submenu named 'Admin Options'. This is where global data is administered for all subsites.

<em>In some instances, when you create a new subsite, the Brixx Options menu may not be immediately available. Refreshing your browser should reveal it.</em>

<a name="users"></a>
## Users Overview

WordPress Multi-site provides for adding Admin Users for a given subsite. While Admin Users have access to most of the WordPress backend for the site to which they are assigned, this is largely innocuous as only location-specific data is displayed on the front-end. <em>The Brixx 2015 theme will redirect users to the parent site if they attempt to visit any subsite directly.</em> Various restrictions can be applied via the Multi-site network settings. At the time of this writing, settings are such that a Store Manager can be assigned an admin role for their location's sub-site. That Store Manager then has the ability to add additional users to the sub-site. This is ideal where a store manager wishes to delegate administration of content to a staff member. They can simply add the new user and assign them a lesser WordPress role,  perhaps Editor or Contributor, to limit access to backend features. Further information on user roles [here](https://codex.wordpress.org/Roles_and_Capabilities).


<a name="locationAware"></a>
## Location Aware

The application is location aware. Meaning it takes into account a user's location to supply information relevant to the nearest Brixx location.

As a security measure, all browsers first seek permission to track a user's location. If permission is allowed, we use Haversine algorithm to identify a Brixx location nearest the user 'as the crow flies'.

Default data is retrieved from a default site. In the WordPress backend a Brixx Options panel has been provided that includes an Admin Options section. Here is where you set the default location ID. At the time of this writing the Master/Parent site is the default site.

Once a user has established a location, the location ID is set in their browsers Local Storage. If available, the stored location's data will be used for subsequent site visits rather than requesting geolocation. This approach endeavors to reduce the annoyance associated with location requests for repeat visitors.

<a name="pages"></a>
## Pages &amp; Posts

All page content is administered at the Master/Parent page level. Custom fields and templates are available to customize the look and feel of the various pages

<a name="tabbedcontent"></a>
### Tabbed Content Page
A custom page template is available that displays content as two tabbed columns. Choose this for any page you want to have tabbed.

<a name="locationspecificcontent"></a>
### Location Specific Content
An option custom field is available that will restrict content to only display for select locations.

<a name="custompageelements"></a>
### Custom Page Elements &amp; Featured Images

- An optional Header Image can be populated using the provided custom field.
- The Featured Image is displayed just above the page footer.
- Page Display Title provides a location for an optional display title for a given page. Default is the Page Title.
- A radio button is available to toggle the color scheme of a given page.
- Flyout menus are available for display on pages. They can be selected from the list of those available.
- Select Locations meta box is provided to allow page display for select locations only. Here's how it works:
	- If populated, navigation to this content will be concealed for all locations except those selected.
	- If populated, and visitor attempts to access the page directly from an excluded location, visitor will be redirected to the site homepage.


<a name="manager"></a>
## Manager
Information for location managers is administered via each sub-site's theme options. The application expects the manager photo to respect a 1080px x 771px ratio.

<a name="viewmenuhref"></a>
## View Menu Link
You will find a custom field within Super Admin Theme Options for setting the link value of the View Menu button located on the homepage.

<a name="specials"></a>
## Specials

- Specials are displayed on the homepage in a definition list. There a different displays for desktop and mobile.
- Specials are location dependent. If no specials are populated for a given location, the parent site's specials are displayed.

### For Mobile
For mobile, specials are listed for today, and the next day. There are forward/back nav icons that allow users to navigate to additional specials. This listing of specials is controlled via the 'Specials' menu. This menu is automatically generated with each new location. It is preformatted to display the days of the week as top level menu items. The content for specials is managed via the Specials custom post type. To create/modify specials...you simply add a special...then add a link to the special as a sub-item of the corresponding day of the week in the Specials Menu.

Specials are a two-step operation:

1. To create a special, go to the Specials tab and click Add New.

2. Visit Appearance > Menus and select the 'Specials' menu. Create a link to the new special as a sub-item of the corresponding day. Order the link among the subitems for the day as desired.



<a name="events"></a>
## Events

Events are location-specific content. Meaning events for the user's selected location/microsite are displayed on the front-end. Events leverage an off-the-shelf plugin named ['Event List'](https://wordpress.org/plugins/event-list/). The plugin provides a simple backend UI for managing events.

To manage events, navigate to the desired microsite, then select Event List from the dashboard menu. Add your new event.

On the front-end, the theme will present to users the soonest upcoming event on page load. Users may then navigation events. If no future events exists, a default message is displayed.

<a name="gels"></a>
## Gels

Gels are the little bubbles with vertically centered text and colored backgrounds. This theme is equipped with shortcode to allow quick and easy generation of these gels. Here's how:

- A custom WordPress Quicktag can be found in the Text editor (NOT the WYSIWYG editor...make sure you are in the Text view).
- The Quicktag button is labeled 'Gels'.
- Position your cursor within the content where you would like the gels to appear.
- Click the 'Gels' button.
- You should now have a block of shortcode as a starting point for your work.
- Populate the 'color' attribute with one of the following: red, blue, yellow. This will produce the desired background color of the circle.
- Html tags are allowed within the individual [gel][/gel] elements. Feel free to use strong elements, or em elements. But note that on devices there is not a lot of room for content.


<a name="responsive-images"></a>
## Responsive Images

Any image added to the WordPress editor can be made responsive to various screen sizes. To do some, we simply remove the height/width attributes from the img tag, and add a classname of 'img-responsive' to the image. The finished product will look something like this:

	<div><img class="img-responsive size-full wp-image-155 aligncenter" src="http://brixxsites.com/wp-content/uploads/2015/05/mba-logo.png" alt="mba-logo" /></div>

The Brixx theme has custom filters installed that will insert images with the responsive tags shown above automatically.

<a name="social-nav"></a>
## Social Navigation

- Social navigation is displayed in the footer with a series of icons.
- Social navigation emulates the setup for specials. Social navigation items are location dependent but will default to the parent site if links are not populated.
- As with Specials, The links to social media sites are controlled via the 'Social' menu. This menu is automatically generated with each new location.
- Default navigation items are Facebook, Twitter, and Instagram.
- Links to additional social media sites can be added, but proper classnames must be used for icon display. Here's how:
	- The icons are font-awesome icon fonts. You can view the library here: [http://fortawesome.github.io/Font-Awesome/icons/](http://fortawesome.github.io/Font-Awesome/icons/)
	- Using Facebook as an example, note the pre-existing classname in the generated menu = 'facebook'. This ties to "facebook" class in the font-awsome library.
	- As an example, if you wanted to add your "linkedIn" page as a social item, simply created a new menu item, give it a title, and give it a classname of "linkedin".

To add links to social media sites:

1. Visit Appearance > Menus and select the 'Social' menu.
2. Create a link to the social media site.
3. Add the appropriate font-awesome classname.
3. If no links are populated, the parent site links are displayed.

<a name="notifications"></a>
## Notifications

Notifications are managed via Brixx Options theme options page. Click on the Notifications tab and enter a notification. The master site notifications take precendence over location specific notifications.



<a name="contactform"></a>
## Contact Form
The theme integrates the Red Hammer Contact Us plugin with ajax options to generate an email form that can be added to any page via shortcode. The form has been heavily customized using the plugins built-in filters. Customization code can be found in functions.php and includes changes to available fields as well as form validation. Additionally, the email form recipients are determined as follows:

- If the Employment Interest checkbox is selected, the application looks to see if Recipients for employment inquires option is populated and uses these emails if available.
- The scripts then look for email addresses within the selected location's general interest recipients options fields. If these fields are populated, they are used.
- If the location options has no contact emails, the form will default to the recipients populated within the plugin's settings.
- Optionally, CC and BCC fields are available within the plugin settings.
- Finally...if the sender signup checkbox is selected, Contact information is pushed to Emma.

<a name="myemma"></a>
## My Emma
The theme has been developed to communicate with the My Emma API for contact management. There are three forms within the theme that leverage the My Emma api. All communication with the api is managed via the EmmaPHP wrapper located within wp-content/src directory and the MyEmmaAPI.php file located within the wp-content/services directory.

Communication with the API relies on an Account ID, Private API Key, Public API Key, Corresponding Form Fields, and Mailing List Group ID's. The values for these properties can be found within Account Settings for a given account within the My Emma web application.

It is a limitation of My Emma that contact fields must be the same for all submissions to the My Emma API regardless of group ID. For this reason, a hack is in place within the processing of the footer area Local News &amp; Specials (aka Coupon) form that attempts to create a first AND last name from the full name field.

Within theme options, each location has the ability to enter their own unique API account credentials. If no credentials exist for a given location, the system will default to the account settings for the default brixx site.

At the time of this writing, there are three mailing list 'Groups' with unique id's within the My Emma account: Beer News, General Interest, and Specials. Location selections are stored with the contacts for segregating groups within My Emma.

__NOTE: The ID's for mailing list groups MUST be populated within the WordPress admin options panel. This is how the application knows to which group a given form submission will be assigned. Additionally, the forms displayed on the Brixx website must correspond to the My Emma contact fields or an error will occur.__

At the time of this writing, There are 3 forms within the site that are communicating with the MyEmma API:

- The form on the Contact Us page which syncs to the 'General Interest' audience group within My Emma. This form has been tested and works as expected.
- The form on the Loyalty page which syncs to the 'Beer News' audience group within My Emma. This form has been tested and works as expected.
- The form located in the site footer which syncs with the 'Specials' audience group within My Emma. This form was not designed with the corresponding number of contact fields required by My Emma. A hack is in place to endeavor to split the full name into first and last names. This form has been tested and works as expected.

__NOTE: Our forms assume that Groups are defined within My Emma and the Group ID numbers are properly populated on the location options page.__

- Contact Form: Within functions.php we use the custom success hook provided by the Red Hammer contact form plugin to push information to My Emma on a successful form submission.

### Steps for creating a new mailing list
- Create a new custom field for the mailing list group ID within the WordPress admin options panel.
- Refactor the MyEmmaAPI.php file to process the submission to the correct group ID.
- Make sure submission form contact fields match up as required by My Emma.

### Import from Constant Contact
- Reference [https://support.e2ma.net/Resource_Center/Account_how-to/importing-audience-members](https://support.e2ma.net/Resource_Center/Account_how-to/importing-audience-members)


<a name="singleplatform"></a>
## Single Platform
The theme has been developed to communicate with the Single Platform api for much of the information displayed for specific locations.

<a name="locationhours"></a>
### Location Hours
Single Platform provides the theme the data for location hours. Within Single Platform, Double-click a location, then under Setup...populate 'Hours'.

<a name="foodmenus"></a>
### Food Menus

The approach to food menu rendering was refactored 10/24/2015 to allow placement of unique masthead media on each food category section of the menus. A 'Menu' page template was created and an associated custom field that provides a means of mapping a given WordPress menu page to a Single Platform menu. Here's how:

- The <code>order_num</code> field in the Single Platform backend is what we use to map menus to a given page.
- Locations can choose whatever order_num they wish for a given menu...and it will be mapped accordingly.
- The <code>order_num</code> field is located next to each menu title field in the Single Platform backend.

The pages using the custom Menu template should be assigned as child elements in the main navigation under the Menu top level parent.

Additionally, a new WordPress menu theme location has been defined for the Full Menu flyout. A menu needs to be created and assigned to this theme location for the Full Menu flyout to work properly.


<s>At the time of this writing, food menu items in all of our navigation systems are dynamically generated from calls to the Single Platform subscription service. Here's how it works:

- The code looks for a primary menu item named 'Menu'.
- The code then inserts the Single Platform menu items as a submenu of the 'Menu' nav item

This allows us to change the location of the Menu parent nav item....and the food submenu will move along with it.

__It is imperative the name of the parent item remain 'Menu'...otherwise the code will not work.__

The Full Menu flyout is also generated dynamically from the Single Platform menu items. But it does not rely on any parent menu items for proper insertion. This nav is generated directly from the data and placed where it belongs on the page. </s>

<a name="beermenus"></a>
## BeerMenus.com
The approach to beer menu rendering was refactored 8/20/2016 to serve data for beer menus from the BeerMenus.com api via embed tags vs. the pre-existing feed from [Single Platform](#foodmenus). Nothing has changed about the menu page setup with the following exceptions:

- Beer menus are location specific and the associated embed code can be found by visiting 'Brixx Options > Beer Menu' in the WordPress backend.
- Beer menu pages must be denoted in the WordPress backend via the Brixx master site.

Here's how it works:

- In the WordPress backend, for a given Brixx location subsite, got to 'Brixx Options > Beer Menus';
- Copy and paste embed code for the subject Brixx location into the field provided. Here is a sample snippet that was successfully tested as a reference. According to the folks at BeerMenus.com this is the snippet corresponding to the Asheville location:

```
<div id="menu_widget">
	 <div id="menu_widget_31419">
	   <a href="https://www.beermenus.com/?ref=widget">Powered by BeerMenus</a>
	 </div>
</div>
<script src="https://www.beermenus.com/menu_widgets/31419" type="text/javascript" charset="utf-8"></script>
```


- In the WordPress backend, visit Brixx Sites > Dashboard > Pages and locate the Brixx 'Beer' menu page.
- Select the Beer Menu page and locate the 'Custom Page Elements' panel. Select the 'Is this the beer menu?' checkbox. Selecting this checkbox will override the Single Platform settings for this page and employ the embed code for the given location.
- By default, if no embed code is in place for a given location, the Single Platform settings (if any) will be employed. Here is the fallback strategy employed for menu pages:
	- Is this a beer menu pages?
		- No: Display Single Platform data
		- Yes: Is the current location set ?
			- Yes: Is there embed code defined for the location?
				- Yes: Display beermenus.com snippet
				- No: Is there embed code defined for the default location?
					- Yes: Display it.
					- No: Display Single Platform data.
			- No: Grab location id=1 (the base site);
				- Is there embed code defined?
					- Yes: Display beermenus.com snippet
					- No: Display Single Platform data.


<a name="media"></a>
## Hero Area and Masthead Media

### Desktop
For desktop, media in these display areas are expected to be provided at a 16/9 width to height ratio:

- If video is provided...the video will be displayed for desktop monitors. Video is hidden on mobile device sizes.
- If fallback images are provided they will be displayed for desktop if no video is available.

### Device
For Mobile, a custom field is provided for media exclusive to mobile device sizes. The application expects these images to respect a 1920px by 720px ratio.

Note that custom fields are provided in the WordPress backend for each media type per page.

<a name="nutritionmenu"></a>
## Nutrition Menu
Visit 'Brixx Options > Location' in the WordPress backend. Look for 'Nutrition PDF' form field. This is where nutrition menus can be loaded.

<a name="cateringmenu"></a>
## Catering Menu
Visit 'Brixx Options > Location' in the WordPress backend. Look for 'Catering PDF' form field. This is where catering menus can be loaded.

In order to associated catering menus with the proper location, custom shortcode has been provided to facilitate placing a link to the catering menu within the WordPress editor. Use the following shortcode to place your link:

		[catering_menu label="whatever your want to see in the link. Mind special characters. They could cause problems."]

<a name="domains"></a>
## Domain Aliases
As of 4/25/2016, The site installation supports the use of subdomains and domain aliases to establish visitors preferred Brixx location. Simply visit one of the location subdomains, such as charlotte-blakeney.brixxpizza.com, and the page will be refreshed with blakeney as the preferred location.

**_Note: The location selection tab takes precedence. If a user has previously visited the site via brixxpizza.com, and selected a preferred location, this selection is stored and will take precedence if user visits using a subdomain. This is important to note during testing._**

Domain aliases require some additional steps:

1. The desired domain alias, example: brixxatthebeach.com, must be purchased and directed to brixxpizza.com web hosting servers. At the time of this writing, the site is hosted at asmallorange.com and the DNS (or Nameserver) settings are:
	- ns1.asmallorange.com (67.228.207.194)
	- ns2.asmallorange.com (67.19.36.196)
	- these settings can be found within the Customer Login area at aso.

2. Create the domain alias with the web hosting service. This is done by visiting the CPanel at asmallorange and locating the **_Aliases_** tab. Within the Aliases section you will find instructions for entering domain name aliases.

3. Finally, We must associate the new domain alias to the appropriate brixx location. The is done using the pre-existing Domain Mapping plugin within the WordPress backend. Login to WordPress and visit the Dashboard for the site representing the location of interest. Once in the location dashboard visit Tools > Domain Mapping. Enter the domain in the field provided and click save.

You're done.

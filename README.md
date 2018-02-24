# Safe CMS

Safe CMS is a content management system for the [SAFE Network](https://maidsafe.net/)

Features include (but are not limited to) the creation of:

* PublicNames (domains) and services (subdomains)
* Blog posts
* Custom blog templates
* Uploading of arbitrary files

## Supporting the project

By default, the template `Whisper` comes with a "Built with SafeCMS" advert button pointing to the [safe://blog.safecms](Safe CMS blog page) at the bottom of each page. This advert is designed to inform people about the Safe CMS project but is optional.

Removing the advert can be done by disabling the feature on the settings page of the application or removing the HTML from the `Whisper` template. After this, your template must be re-published to all effected services.

## Installation

Download the latest release here: [https://github.com/badcodeltd/safecms/releases](https://github.com/badcodeltd/safecms/releases)

* `Windows`: Run `safe-cms.exe` within the unzipped directory
* `Linux`: Run `./safe-cms` within the unzipped directory
* `Mac`: A build of the Mac application will be included with the `1.0.0` release and these instructions will be updated

## Running locally

After cloning the repository and running `npm install`, the following commands will become available:

* `npm run start` - Run a local version of the SAFE CMS
* `npm package` - Build an installable version of the app for the current operating system / architecture

Developing for / building the application from scratch requires `Python (2)`, `NPM 5` and `Node 8+`. Building the SAFE toolset (for example, mock routing) requires `Cargo`, more information can be found here: [https://github.com/maidsafe/safe_app_nodejs](https://github.com/maidsafe/safe_app_nodejs)

## Contributing

The source code included is licensed using the MIT license (check the LICENSE file for more information). All contributions will also be bound by that same license unless explicitly stated by the copyright holder.

To contribute code, simple create a pull-request aimed at the `master` branch of this repository.
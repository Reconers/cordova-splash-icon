# cordova-splash-icon

Automatic splash screen and icon generator for Cordova. 
Create a splash screen (2208x2208) and icon (1024x1024) once in the root folder of your Cordova project and use cordova-splash to automatically crop and copy it for all the platforms your project supports (currenty works with iOS and Android).

### Installation

     $ sudo npm install https://github.com/reconers/cordova-splash-icon -g

### Usage

Create a ```splash.png```, ```icon.png``` files in the root folder of your cordova project and run:

     $ cordova-splash-icon

### Requirements

- ImageMagick

Install on a Mac:

     $ brew install imagemagick

- At least one platform was added to your project ([cordova platforms docs](http://cordova.apache.org/docs/en/3.4.0/guide_platforms_index.md.html#Platform%20Guides))
- Cordova's config.xml file must exist in the root folder ([cordova config.xml docs](http://cordova.apache.org/docs/en/3.4.0/config_ref_index.md.html#The%20config.xml%20File))

### License

MIT

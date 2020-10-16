import { Component } from '@angular/core';
// import { DocumentViewerOptions } from '@ionic-native/document-viewer';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';

declare var openwith: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  responseData: any = [];
  sizeOfFirst :any = '';
  constructor(private document: DocumentViewer) {
    this.setupOpenwork()
  }

  setupOpenwork() {

    // Increase verbosity if you need more logs
    //cordova.openwith.setVerbosity(cordova.openwith.DEBUG);

    // Initialize the plugin
    (<any>window).plugins.openwith.init(() => {
      console.log('init success!');
    }, (err) => {
      console.log('init failed: ' + err);
    });

    // function initSuccess()  { console.log('init success!'); }
    // function initError(err) { console.log('init failed: ' + err); }

    // Define your file handler
    (<any>window).plugins.openwith.addHandler((intent) => {
      console.log('intent received');

      console.log('  action: ' + intent.action); // type of action requested by the user
      console.log('  exit: ' + intent.exit); // if true, you should exit the app after processing

      this.responseData = intent.items;
      console.log(this.responseData);
      for (var i = 0; i < intent.items.length; ++i) {
        var item = intent.items[i];
        console.log('  type: ', item.type);   // mime type
        console.log('  uri:  ', item.uri);     // uri to the file, probably NOT a web uri

        // some optional additional info
        console.log('  text: ', item.text);   // text to share alongside the item, iOS only
        console.log('  name: ', item.name);   // suggested name of the image, iOS 11+ only
        console.log('  utis: ', item.utis);
        console.log('  path: ', item.path);   // path on the device, generally undefined
      }

      // ...
      // Here, you probably want to do something useful with the data
      // ...
      // An example...

      if (intent.items.length > 0) {
        (<any>window).plugins.openwith.load(intent.items[0], function (data, item) {

          // data is a long base64 string with the content of the file
          console.log("the item weights ", item);
          console.log("the item weights " + data.length + " bytes");
          // uploadToServer(item);

          // "exit" when done.
          // Note that there is no need to wait for the upload to finish,
          // the app can continue while in background.
          if (intent.exit) { (<any>window).plugins.openwith.exit(); }
        });
      }
      else {
        if (intent.exit) { (<any>window).plugins.openwith.exit(); }
      }
    });

  // function myHandler(intent) {
  //   console.log('intent received');

  //   console.log('  action: ' + intent.action); // type of action requested by the user
  //   console.log('  exit: ' + intent.exit); // if true, you should exit the app after processing

  //    this.responseData = intent.items;
  //   for (var i = 0; i < intent.items.length; ++i) {
  //     var item = intent.items[i];
  //     console.log('  type: ', item.type);   // mime type
  //     console.log('  uri:  ', item.uri);     // uri to the file, probably NOT a web uri

  //     // some optional additional info
  //     console.log('  text: ', item.text);   // text to share alongside the item, iOS only
  //     console.log('  name: ', item.name);   // suggested name of the image, iOS 11+ only
  //     console.log('  utis: ', item.utis);
  //     console.log('  path: ', item.path);   // path on the device, generally undefined
  //   }

  //   // ...
  //   // Here, you probably want to do something useful with the data
  //   // ...
  //   // An example...

  //   if (intent.items.length > 0) {
  //     (<any>window).plugins.openwith.load(intent.items[0], function (data, item) {

  //       // data is a long base64 string with the content of the file
  //       console.log("the item weights ", item);
  //       console.log("the item weights " + data.length + " bytes");
  //        this.sizeOfFirst = data.length;
  //       // uploadToServer(item);

  //       // "exit" when done.
  //       // Note that there is no need to wait for the upload to finish,
  //       // the app can continue while in background.
  //       if (intent.exit) { (<any>window).plugins.openwith.exit(); }
  //     });
  //   }
  //   else {
  //     if (intent.exit) { (<any>window).plugins.openwith.exit(); }
  //   }
  // }
}

openObject(single){

  console.log(single);
  const options: DocumentViewerOptions = {
    title: 'My Document'
  }
  
  this.document.viewDocument(single.uri, single.type, options);
}

}

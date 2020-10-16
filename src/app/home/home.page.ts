import { Component, NgZone } from '@angular/core';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';



// declare var openwith: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  responseData: any = [];
  sizeOfFirst: any = '';
  sampleData = {
    name: '',
    path: '',
    actual: '',
    type: '',
  }
  constructor(private document: DocumentViewer, 
    private filePath: FilePath,
    private zone : NgZone) {

    ////Wait to Load Plugin Completely.....
    setTimeout(() => { this.setupOpenwork(); }, 3000);


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

      // this.responseData = intent.items;

      for (var i = 0; i < intent.items.length; ++i) {
        var item = intent.items[i];
        console.log('  type: ', item.type);   // mime type
        console.log('  uri:  ', item.uri);     // uri to the file, probably NOT a web uri



        this.zone.run(() => {
          this.sampleData.name = item.uri.split("/").pop();
          this.sampleData.path = item.path;
          this.sampleData.actual = item.uri;
          this.sampleData.type = item.type;
        });

        // some optional additional info
        console.log('  text: ', item.text);   // text to share alongside the item, iOS only
        console.log('  name: ', item.name);   // suggested name of the image, iOS 11+ only
        console.log('  utis: ', item.utis);
        console.log('  path: ', item.path);   // path on the device, generally undefined
      }
      console.log(this.responseData);
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


  }

  openObject() {

    // console.log(single);
    const options: DocumentViewerOptions = {
      title: 'My Document'
    }


    this.document.viewDocument(this.sampleData.actual, this.sampleData.type, options);
    this.document.viewDocument(this.sampleData.path, this.sampleData.type, options);

    this.filePath.resolveNativePath(this.sampleData.actual)
      .then(filePath => {
        this.document.viewDocument(this.sampleData.path, this.sampleData.type, options);
        console.log(filePath);
      })
      .catch(err => console.log(err));
  }

}

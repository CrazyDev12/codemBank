import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { UserProvider } from './../../providers/user/user';
import { Storage } from '@ionic/storage';

declare var cordova: any;


/**
 * Generated class for the ShowCustomerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-show-customer',
  templateUrl: 'show-customer.html',
})
export class ShowCustomerPage {

	private key: string = '2aadf6440fa96846';
  	ret: string = "";
  	isCustomer:boolean=false;
  	loading:boolean=true;
  	CustomerDetails:any;
  	user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public storage: Storage, public userProvider: UserProvider) {
  	this.user = userProvider.getUser();
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.showCustomerDetails();
    }, 300);
  }

  showCustomerDetails(){
  	let login='';
  	let phone='';
  	let customerid='';
  	this.storage.get('login').then((val) => {
  		console.log("login "+val);
      if(val!==null){
        login=val;
      }
    });
    this.storage.get('phone').then((val) => {
    	console.log("phone "+val);
      if(val!==null){
        phone=val;
      }
    });
    this.storage.get('customerid').then((val) => {
    	console.log("customerid "+val);
      if(val!==null){
        customerid=val;
      }
    });

  	let data = JSON.stringify({"phone":phone,"login":login,"customerid":customerid,"method": "getcustomerdetails" });
  	this.loading=false;
    cordova.plugins.aesEnc(data, this.key).then((data_) => {
    	console.log("data_ "+data_);
      this.api.query(data_, null, 'getcustomerdetails', false).then(data__ => {

        let dt: any = data__;
        console.log("dt "+JSON.stringify(dt));
        if (dt.kbankResponse.retcode === 0) {
          	cordova.plugins.aesDec(dt.kbankResponse.reply, this.key).then((data___) => {
           	console.log(data___);          		
  			this.isCustomer=true;
           	this.CustomerDetails = JSON.stringify(data___);
          }).catch((err) => {
            this.ret = 'Unknown error!';
          });
        } else {
          this.ret = dt.kbankResponse.reply;
        }

      }).catch(error => {
        this.ret = 'An error occurred!';
      });
    }).catch((err) => {
      this.ret = 'Unknown error!';
    });
  }

}

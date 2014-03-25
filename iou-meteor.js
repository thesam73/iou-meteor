Depenses = new Meteor.Collection('depenses');


if (Meteor.isClient) {
  Session.set('show_dialog', false);

  Template.depenses.depenses = function() {
    return Depenses.find({}, {sort: {timestamp: -1}});
  }

  Template.debt.samDebt = function(){
    var Items = Depenses.find({sam: {$ne: true}});
    var sum = 0;
    Items.forEach(function(item){
      sum += Math.round(item.amount);
    })
    return sum/2;
  }
  Template.debt.marionDebt = function(){
    var Items = Depenses.find({marion: {$ne: true}});
    var sum = 0;
    Items.forEach(function(item){
      sum += Math.round(item.amount);
    })
    return sum/2;
  }
  Template.entrydetail.isVisible = function(){
    if(Session.get('show_dialog')){
        return true;
    } else {
        return false;
    }
  }

  Template.depenses.events = {
    'click .sambtn': function(){
      var c = confirm("Update depense?");
      if (c == true) {
        //console.log(!this.sam);
        var value = !this.sam;
        Depenses.update(this._id, { $set:{"sam": value}});
      };
    },
    'click .marionbtn': function(){
      var c = confirm("Update depense?");
      if (c == true)  {
        //console.log(!this.marion);
        var value = !this.marion;
        Depenses.update(this._id, { $set:{"marion": value}});
      };
    },
    'click button.update': function(){
      var c = confirm("Delete depense?");
        if (c == true) {
          //console.log(this._id);
          //confirm("Would you like to delete this element");
          Depenses.remove(this._id);
        };
    }
  }
  
  Template.entryfield.events = {
    // "keydown #depense": function(event) {
    //   if (event.which == 13) {
    //     //submit the form
    //     var amount = document.getElementById('amount');
    //     var category = document.getElementById('category');
    //     //var sam = document.getElementById('sam');
    //     //var marion = document.getElementById('category');

    //     if (amount.value != '' && category.value != '') {
    //       Depenses.insert({
    //         amount: amount.value,
    //         category: category.value,
    //         //sam: sam.checked,
    //         //marion: marion.checked,
    //         time: Date.Now()
    //       });
    //       amount.value = '';
    //       category.value = '';
    //     };
    //   }
    // }
    'click #submit': function(){
        //submit the form
        var amount = document.getElementById('amount');
        var category = document.getElementById('category');
        var sam = document.getElementById('sam');
        var marion = document.getElementById('marion');
        var date_html = document.getElementById('timestamp');
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var date = '' + curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-' + (curr_date <= 9 ? '0' + curr_date : curr_date);
        if (Date.parse(date_html.value)) { 
          date = date_html.value;
        };
        //console.log(amount + category);
        if (amount.value != '' && category.value != '') {
          Depenses.insert({
            amount: amount.value,
            category: category.value,
            sam: sam.checked,
            marion: marion.checked,
            timestamp: date,
            time: Date()
          });
          amount.value = '';
          //category.value = '';
        };
      }
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

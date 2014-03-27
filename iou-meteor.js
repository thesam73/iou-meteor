Depenses = new Meteor.Collection('depenses');

function totalCat(Items) {
    var total = 0;
    Items.forEach(function(item){
          total += Math.round(item.amount);
    });
    return total;
}
function ratioCat(allItems, selectedItems) {
  var ratio = 0; 
  var totalForCat = 0;
  var total = 0;
  allItems.forEach(function(item){
          total += Math.round(item.amount);
  });
  selectedItems.forEach(function(item){
          totalForCat += Math.round(item.amount);
  });
  if (totalForCat == 0) {return 0;}
  else if (total != 0) {
    var ratio = totalForCat / total * 100;
    return ratio;
  }
}

if (Meteor.isClient) {
  Session.set('show_dialog', false);

  Template.depenses.depenses = function() {
    return Depenses.find({}, {sort: {timestamp: -1}});
  }
  Template.summary.totalAmount = function() {
    return totalCat(Depenses.find());
  }
  Template.summary.rentAmount = function() {
    return totalCat(Depenses.find({category: 'rent'}));
  }
  Template.summary.billsAmount = function() {
    return totalCat(Depenses.find({category: 'bills'}));
  }
  Template.summary.foodAmount = function() {
    return totalCat(Depenses.find({category: 'food'}));
  }
  Template.summary.shoppingAmount = function() {
    return totalCat(Depenses.find({category: 'shopping'}));
  }
  Template.summary.activityAmount = function() {
    return totalCat(Depenses.find({category: 'activity'}));
  }
  Template.summary.carAmount = function() {
    return totalCat(Depenses.find({category: 'car'}));
  }

  Template.summary.rentratio = function() {
    return ratioCat(Depenses.find(), Depenses.find({category: 'rent'}));
  }
  
  Template.summary.billsratio = function() {
    return ratioCat(Depenses.find(), Depenses.find({category: 'bills'}));
  }
  
  Template.summary.foodratio = function() {
    return ratioCat(Depenses.find(), Depenses.find({category: 'food'}));
  }

  Template.summary.shoppingratio = function() {
    return ratioCat(Depenses.find(), Depenses.find({category: 'shopping'}));
  }
  
  Template.summary.activityratio = function() {
    return ratioCat(Depenses.find(), Depenses.find({category: 'activity'}));
  }

  Template.summary.carratio = function() {
    return ratioCat(Depenses.find(), Depenses.find({category: 'car'}));
  }
  
  Template.action.amountDebt = function(){
    var samItems = Depenses.find({payeur: 'sam'});
    var samSum = 0;
    samItems.forEach(function(item){
      samSum += Math.round(item.amount);
    })
    var marionItems = Depenses.find({payeur: 'marion'});
    var marionSum = 0;
    marionItems.forEach(function(item){
      marionSum += Math.round(item.amount);
    })
    var sum = marionSum-samSum;
    if (sum < 0){
      return -sum/2;
    }
    else {
      return sum/2;
    }
  }
  Template.action.nameDebt = function(){
    var samItems = Depenses.find({payeur: 'sam'});
    var samSum = 0;
    samItems.forEach(function(item){
      samSum += Math.round(item.amount);
    })
    var marionItems = Depenses.find({payeur: 'marion'});
    var marionSum = 0;
    marionItems.forEach(function(item){
      marionSum += Math.round(item.amount);
    })
    var sum = marionSum-samSum;
    if (sum < 0){
      return "Marion";
    }
    else {
      return "Sam";
    }
  }
  Template.action.events = {
    'click #updatedebt': function(){
      var c = confirm("Reset debt?");
      if (c == true) {
        var Items = Depenses.find({payeur: { $ne: 'both' }});
        Items.forEach(function(item){
          Depenses.update(item._id, { $set:{"payeur": "both"}});
        })
      };
    }
  }
  Template.depenses.events = {
    'click button.remove': function(){
      var c = confirm("Delete depense?");
        if (c == true) {
          Depenses.remove(this._id);
        };
    }
  }
  
  Template.entryfield.events = {

    'click #submit': function(){
        //submit the form
        var amount = document.getElementById('amount');
        var category = document.getElementById('category');
        var payeur = document.getElementById('payeur');
        //var sam = document.getElementById('sam');
        //var marion = document.getElementById('marion');
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
            //sam: sam.checked,
            //marion: marion.checked,
            payeur: payeur.value,
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

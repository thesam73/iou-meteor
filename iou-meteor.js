Depenses = new Meteor.Collection('depenses');

function totalmonthCat(Items) {
	var ds = new Date();
	var curr_date = ds.getFullYear();
	var curr_month = ds.getMonth() + 1; //Months are zero based
	var curr_date = curr_year + ',' + (curr_month<=9 ? '0' + curr_month : curr_month);

	//Items.find({timestamp: { $lt: new Date(), $gt: new Date(curr_date+','+curr_month) }});
	
  var total = 0;
  Items.forEach(function(item){
    total += Math.round(item.amount);
  });
  return total;
}

function totalCat(Items) {
  var total = 0;
  Items.forEach(function(item){
    total += Math.round(item.amount);
  });
  return total;
}

function monthlytotalCat(cat){
    var d = new Date();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var startmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var endmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-31';
    curr_month = curr_month - 1;
    var startlastmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    return totalCat(Depenses.find({
      category: cat,
      timestamp: {$gte: startmonth, $lte: endmonth}
    }));
}
function monthlyratioCat(cat){
    var d = new Date();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var startmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var endmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-31';
    curr_month = curr_month - 1;
    var startlastmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var previous = totalCat(Depenses.find({
      category: cat,
      timestamp: {$gte: startlastmonth, $lte: startmonth}
    }));
    var current = totalCat(Depenses.find({
      category: cat,
      timestamp: {$gte: startmonth, $lte: endmonth}
    }));
    var ratio = Math.round(current / previous * 100);
    if (ratio > 100) ratio = 100;
    return ratio;
}
//.class__rent {
//	background-color: #7f8c8d;
//}
//.class__bills {
//	background-color: #2ecc71;
//}
//.class__food {
//	background-color: #3498db;
//}
//.class__shopping {
//	background-color: #9b59b6;
//}
//.class__activity {
//	background-color: #e67e22;
//}
//.class__car {
//	background-color: #34495e;
//}
function drawChartCurrent(){
  var d = new Date();
  var curr_month = d.getMonth() + 1; //Months are zero based
  var curr_year = d.getFullYear();
  var startmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
  var endmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-31';
  curr_month = curr_month - 1;
  var startlastmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';

  var data = {
    labels : ["Rent", "Bills", "Food", "SuperMarket", "Shopping", "Activity", "Car"],
    datasets : [
    {
      fillColor : "#9b59b6",
      strokeColor : "#7f8c8d",
      data: [
      totalCat(Depenses.find({
        category: 'rent',
        timestamp: {$gte: startmonth, $lte: endmonth}
      })),
      totalCat(Depenses.find({
        category: 'bills',
        timestamp: {$gte: startmonth, $lte: endmonth}
      })),
      totalCat(Depenses.find({
        category: 'food',
        timestamp: {$gte: startmonth, $lte: endmonth}
      })),
      totalCat(Depenses.find({
        category: 'supermarket',
        timestamp: {$gte: startmonth, $lte: endmonth}
      })),
      totalCat(Depenses.find({
        category: 'shopping',
        timestamp: {$gte: startmonth, $lte: endmonth}
      })),
      totalCat(Depenses.find({
        category: 'activity',
        timestamp: {$gte: startmonth, $lte: endmonth}
      })),
      totalCat(Depenses.find({
        category: 'car',
        timestamp: {$gte: startmonth, $lte: endmonth}
      }))
      ]
    },
    {
      fillColor : "#2ecc71",
      strokeColor : "#7f8c8d",
      data: [
      totalCat(Depenses.find({
        category: 'rent',
        timestamp: {$gte: startlastmonth, $lte: startmonth}
      })),
      totalCat(Depenses.find({
        category: 'bills',
        timestamp: {$gte: startlastmonth, $lte: startmonth}
      })),
      totalCat(Depenses.find({
        category: 'food',
        timestamp: {$gte: startlastmonth, $lte: startmonth}
      })),
      totalCat(Depenses.find({
        category: 'supermarket',
        timestamp: {$gte: startlastmonth, $lte: startmonth}
      })),
      totalCat(Depenses.find({
        category: 'shopping',
        timestamp: {$gte: startlastmonth, $lte: startmonth}
      })),
      totalCat(Depenses.find({
        category: 'activity',
        timestamp: {$gte: startlastmonth, $lte: startmonth}
      })),
      totalCat(Depenses.find({
        category: 'car',
        timestamp: {$gte: startlastmonth, $lte: startmonth}
      }))
      ]
    }
    ]
  };
  var ctx = $("#chartCurrent").get(0).getContext("2d");
  var myNewChart = new Chart(ctx);
  new Chart(ctx).Bar(data);
}

function drawChart(){        
  var data = [
  {
    value: totalCat(Depenses.find({category: 'rent'})),
    color:"#7f8c8d"
  },
  {
    value : totalCat(Depenses.find({category: 'bills'})),
    color : "#2ecc71"
  },
  {
    value : totalCat(Depenses.find({category: 'food'})),
    color : "#3498db"
  },
  {
    value : totalCat(Depenses.find({category: 'supermarket'})),
    color : "#00CCC1"
  },
  {
    value : totalCat(Depenses.find({category: 'shopping'})),
    color : "#9b59b6"
  },
  {
    value : totalCat(Depenses.find({category: 'activity'})),
    color : "#e67e22"
  }
  ,
  {
    value : totalCat(Depenses.find({category: 'car'})),
    color : "#34495e"
  }     
  ]
        //console.log(data);
        //Get context with jQuery - using jQuery's .get() method.
        var ctx = $("#myChart").get(0).getContext("2d");
          //This will get the first returned node in the jQuery collection.
          var myNewChart = new Chart(ctx);
          new Chart(ctx).Doughnut(data);
          
        }
        function groupBy(input, xCol, yCol) {

          var output = {};

    // This function can be easily changed to do max, min, avg, sum.
    var sum = function(row, idx) {
      if (!(row[xCol] in output)) {
        output[row[xCol]] = +row[yCol];
      }
      else {
        output[row[xCol]] += +row[yCol];         
      }
    };
    _.each(input, sum);

    return output;
  }

  function drawChartMonthly() {
    var depenses = Depenses.find().fetch();
//    var groupedDates = _.groupBy(_.pluck(customers, 'timestamp'), function (date) {return date.split("-",2);});
var monthlyDepenses = _.groupBy(depenses, function(depense) {
  return depense.timestamp.split("-",2);
});

var dataMonthly  = new Array();
var DCA = new Array();
for (var month in monthlyDepenses) {
  var monthquote = "'"+month+"'";
  var monthlySum = groupBy(monthlyDepenses[month], "category", "amount");
  monthlySum.Date = monthquote;
  dataMonthly.push(monthlySum);

  var groups = _(monthlyDepenses[month]).groupBy('category');
    //groups : Object {bills: Array[1], rent: Array[1]}
    for (var category in groups) {
      var DCA_cat = new Object();
      DCA_cat.Date = month;
      DCA_cat.Category = category;
      
      var DCASum = groupBy(groups[category], "category", "amount");
      DCA_cat.Amount = monthlySum[category];
      //console.log('here');
      DCA.push(DCA_cat);
    }
  }


  var d = new Date();
   var curr_month = d.getMonth() + 1; //Months are zero based
   var curr_year = d.getFullYear();
   var curr_date = curr_year + ',' + (curr_month<=9 ? '0' + curr_month : curr_month);
   var DCA_without_current = _.filter(DCA, function(item) {
     return item.Date !== curr_date
   });
   var DCA_only_current = _.filter(DCA, function(item) {
     return item.Date == curr_date
   });
   var DCA_monthgroup = _(DCA_without_current).groupBy('Date');
  //console.log(DCA_catgroup);
  var DCA_average = _.chain(DCA_monthgroup)
  .flatten()
  .groupBy(function(value) { return value.Category; })
  .map(function(value, key) {
    var sum = _.reduce(value, function(memo, val) { return memo + val.Amount; }, 0);
    return {Category: key, Amount: sum / value.length};
  })
  .value();
  console.log(DCA_only_current);

  var svgC = dimple.newSvg("#chartCurrentMonth", 400, 400);
  var myChartC = new dimple.chart(svgC, DCA_only_current);
  myChartC.addMeasureAxis("x", "Amount");
  myChartC.addCategoryAxis("y", "Category");
  myChartC.addSeries(null, dimple.plot.bar);
  //var mySeriesC = myChartC.addSeries("Category", dimple.plot.bar);
  myChartC.draw();


  var svg = dimple.newSvg("#chartMonthly", 400, 400);
  var myChart = new dimple.chart(svg, DCA);
  var x = myChart.addCategoryAxis("x", "Date");
  x.addOrderRule("Date");
  myChart.addMeasureAxis("y", "Amount");
  var mySeries = myChart.addSeries("Category", dimple.plot.bar);
  myChart.draw();
}

if (Meteor.isClient) {

  Template.depenses.depenses = function() {
    return Depenses.find({}, {sort: {timestamp: -1}});
  }
  Template.submitmessage.message = function () {
  	return "All good keep spending!";
  }
  Template.summary.rendered = function () {
  	drawChart();
  }
  Template.summary.totalAmount = function() {
    var d = new Date();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var startmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var endmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-31';
    curr_month = curr_month - 1;
    var startlastmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    return totalCat(Depenses.find({timestamp: {$gte: startlastmonth, $lte: startmonth}}));
  } 
  Template.summary.rentAmount = function() {
    return monthlytotalCat('rent');
  }
  Template.summary.billsAmount = function() {
    return monthlytotalCat('bills');
  }
  Template.summary.foodAmount = function() {
    return monthlytotalCat('food');
  }
  Template.summary.shoppingAmount = function() {
    return monthlytotalCat('shopping');
  }
  Template.summary.supermarketAmount = function() {
    return monthlytotalCat('supermarket');
  }
  Template.summary.activityAmount = function() {
    return monthlytotalCat('activity');
  }
  Template.summary.carAmount = function() {
    return monthlytotalCat('car');
  }
  Template.summary.totalRatio = function() {
    var d = new Date();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var startmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var endmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-31';
    curr_month = curr_month - 1;
    var startlastmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var previous = totalCat(Depenses.find({
      timestamp: {$gte: startlastmonth, $lte: startmonth}
    }));
    var current = totalCat(Depenses.find({
      timestamp: {$gte: startmonth, $lte: endmonth}
    }));
    var ratio = Math.round(current / previous * 100);
    if (ratio > 100) ratio = 100;
    return ratio;
} 
Template.summary.rentRatio = function() {
  return monthlyratioCat('rent');
} 
Template.summary.billsRatio = function() {
  return monthlyratioCat('bills');
} 
Template.summary.foodRatio = function() {
  return monthlyratioCat('food');
} 
Template.summary.shoppingRatio = function() {
  return monthlyratioCat('shopping');
} 
Template.summary.supermarketRatio = function() {
  return monthlyratioCat('supermarket');
} 
Template.summary.activityRatio = function() {
  return monthlyratioCat('activity');
} 
Template.summary.carRatio = function() {
  return monthlyratioCat('car');
} 
Template.summaryall.rendered = function() {
  drawChartCurrent();
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

Template.navmenu.events = {
  'click #btn__add': function(e){
    $("#btn__add").addClass("tab-current");
    $("#btn__current").removeClass("tab-current");
    $("#btn__stats").removeClass("tab-current");
    $("#btn__data").removeClass("tab-current");

    $("#section__add").addClass("current");
    $("#section__current").removeClass("current");
    $("#section__stats").removeClass("current");
    $("#section__data").removeClass("current");
  },
  'click #btn__current': function(e){
      //drawChart();
      $("#btn__current").addClass("tab-current");
      $("#btn__stats").removeClass("tab-current");
      $("#btn__add").removeClass("tab-current");
      $("#btn__data").removeClass("tab-current");

      $("#section__add").removeClass("current");
      $("#section__current").addClass("current");
      $("#section__stats").removeClass("current");
      $("#section__data").removeClass("current");
    },
    'click #btn__data': function(e){
      $("#btn__add").removeClass("tab-current");
      $("#btn__current").removeClass("tab-current");
      $("#btn__stats").removeClass("tab-current");
      $("#btn__data").addClass("tab-current");

      $("#section__add").removeClass("current");
      $("#section__current").removeClass("current");
      $("#section__stats").removeClass("current");
      $("#section__data").addClass("current");
    },
    'click #btn__stats': function(e){
      $("#btn__stats").addClass("tab-current");
      $("#btn__current").removeClass("tab-current");
      $("#btn__add").removeClass("tab-current");
      $("#btn__data").removeClass("tab-current");

      $("#section__add").removeClass("current");
      $("#section__current").removeClass("current");
      $("#section__stats").addClass("current");
      $("#section__data").removeClass("current");
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
          $("#confirm").show().delay(700).fadeOut();
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

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

function average (arr)
{
  return _.reduce(arr, function(memo, num)
  {
    return memo + num;
  }, 0) / arr.length;
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
  function previousmonthmonthlytotalCat(cat){
    var d = new Date();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var startmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var endmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-31';
    curr_month = curr_month - 1;
    var startlastmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    return totalCat(Depenses.find({
      category: cat,
      timestamp: {$gte: startlastmonth, $lte: startmonth}
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
    //get older value en set first day of month
    if (Depenses.find().count() > 0) {
       var firstmonth_start = Depenses.find({},{sort: {timestamp: 1}}).fetch()[0].timestamp.slice(0,-2) + '01';
       var firstmonth_end = Depenses.find({},{sort: {timestamp: 1}}).fetch()[0].timestamp.slice(0,-2) + '31';
       var m_month_start = moment(firstmonth_start, "YYYY-MM-DD");
       var m_firstmonth = moment(firstmonth_start, "YYYY-MM-DD");
       var m_month_end = moment(firstmonth_end, "YYYY-MM-DD");
       var lasttmonth_start = Depenses.find({},{sort: {timestamp: -1}}).fetch()[0].timestamp.slice(0,-2) + '01';
       var m_lasttmonth = moment(lasttmonth_start, "YYYY-MM-DD");
       var howmanymonth = m_lasttmonth.diff(m_firstmonth, 'months');
       var monthlyPrevious = new Array();
       for (i = 0; i < howmanymonth; i++) {
         var month_start = m_month_start.add('M', i).format("YYYY-MM-DD");
         var month_end = m_month_end.add('M', i).format("YYYY-MM-DD");
         monthlyPrevious[i] = totalCat(Depenses.find({
           category: cat,
           timestamp: {$gte: month_start, $lte: month_end}
         }));
       }
      // console.log(monthlyPrevious);
      // var previous = totalCat(Depenses.find({
      //   category: cat,
      //   timestamp: {$gte: startlastmonth, $lte: startmonth}
      // }));
      var previous = average(monthlyPrevious);
      //console.log(cat + ":cat,   " + previous);
      var current = totalCat(Depenses.find({
        category: cat,
        timestamp: {$gte: startmonth, $lte: endmonth}
      }));
      var ratio = Math.round(current / previous * 100);
      if (ratio > 100) ratio = 100;
      return ratio;
    }
  }
  function monthlyMratioCat(cat){
    var d = new Date();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var startmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var endmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-31';
    curr_month = curr_month - 1;
    var startlastmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var current = totalCat(Depenses.find({
      category: cat,
      timestamp: {$gte: startmonth, $lte: endmonth}
    }));
    var total = totalCat(Depenses.find({
      timestamp: {$gte: startmonth, $lte: endmonth}
    }));
    var ratio = Math.round(current / total * 100);
    if (ratio > 100) ratio = 100;
    return ratio;
  }

  function drawChartCurrent(){
    var d = new Date();
  var curr_month = d.getMonth() + 1; //Months are zero based
  var curr_year = d.getFullYear();
  var startmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
  var endmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-31';
  curr_month = curr_month - 1;
  var startlastmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';


  var dataDimple = [
  { Month: "Last Month", Category: "Rent", Amount: monthlytotalCat('rent') },
  { Month: "Last Month", Category: "Bills", Amount: monthlytotalCat('bills') },
  { Month: "Last Month", Category: "Food", Amount:  monthlytotalCat('food') },
  { Month: "Last Month", Category: "Supermarket", Amount: monthlytotalCat('superMarket') },
  { Month: "Last Month", Category: "Shopping", Amount: monthlytotalCat('shopping') },
  { Month: "Last Month", Category: "Activity", Amount:  monthlytotalCat('activity') },
  { Month: "Last Month", Category: "Car", Amount:  monthlytotalCat('car') },

  { Month: "This Month", Category: "Rent", Amount: previousmonthmonthlytotalCat('rent') },
  { Month: "This Month", Category: "Bills", Amount: previousmonthmonthlytotalCat('bills') },
  { Month: "This Month", Category: "Food", Amount:  previousmonthmonthlytotalCat('food') },
  { Month: "This Month", Category: "Supermarket", Amount: previousmonthmonthlytotalCat('superMarket') },
  { Month: "This Month", Category: "Shopping", Amount: previousmonthmonthlytotalCat('shopping') },
  { Month: "This Month", Category: "Activity", Amount:  previousmonthmonthlytotalCat('activity') },
  { Month: "This Month", Category: "Car", Amount:  previousmonthmonthlytotalCat('car') }
  ];

  var svg = dimple.newSvg("#chartContainer", 250, 350);

  var myChart = new dimple.chart(svg, dataDimple);
  myChart.setBounds("20%", 1, "80%", "90%");
  myChart.defaultColors = [
  new dimple.color("#7f8c8d"),
  new dimple.color("#2ecc71"),
  new dimple.color("#3498db"),
  new dimple.color("#00CCC1"),
  new dimple.color("#9b59b6"),
  new dimple.color("#e67e22"),
  new dimple.color("#34495e")
  ]; 
  var x = myChart.addCategoryAxis("x", "Month");
  x.addOrderRule("Month");
  var y = myChart.addMeasureAxis("y", "Amount");
  y.tickFormat = function(d) { return Math.round(d / 1e6) + "$"; };
  var mySerie = myChart.addSeries("Category", dimple.plot.bar);
  mySerie.barGap = 0.05;
  myChart.draw();
  y.titleShape.remove();
  x.titleShape.remove();
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
   console.log(DCA_monthgroup);
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
    //console.log(Depenses.find({}, {sort: {timestamp: -1}}));
    return Depenses.find({}, {sort: {timestamp: -1}});
  }
  Template.submitmessage.message = function () {
    return "All good keep spending!";
  }
  Template.monthly__sal.monthlyTotal = function() {
    var d = new Date();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var startmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var endmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-31';
    curr_month = curr_month - 1;
    var startlastmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var current = totalCat(Depenses.find({
      timestamp: {$gte: startmonth, $lte: endmonth}
    }));
    return current;
  } 
  Template.monthly__sal.monthlyRatio = function() {
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
    var ratio = Math.round(current / 4300 * 100);
    if (ratio > 100) ratio = 100;
    return ratio;
  } 
  Template.summary.rendered = function () {
    //drawChart();
  }

  Template.summary.totalAmount = function() {
    var d = new Date();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var startmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    var endmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-31';
    curr_month = curr_month - 1;
    var startlastmonth = curr_year + '-' + (curr_month<=9 ? '0' + curr_month : curr_month) + '-01';
    return totalCat(Depenses.find({timestamp: {$gte: startmonth, $lte: endmonth}}));
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
    if (Depenses.find().count() > 0) {
       var firstmonth_start = Depenses.find({},{sort: {timestamp: 1}}).fetch()[0].timestamp.slice(0,-2) + '01';
       var firstmonth_end = Depenses.find({},{sort: {timestamp: 1}}).fetch()[0].timestamp.slice(0,-2) + '31';
       var m_month_start = moment(firstmonth_start, "YYYY-MM-DD");
       var m_firstmonth = moment(firstmonth_start, "YYYY-MM-DD");
       var m_month_end = moment(firstmonth_end, "YYYY-MM-DD");
       var lasttmonth_start = Depenses.find({},{sort: {timestamp: -1}}).fetch()[0].timestamp.slice(0,-2) + '01';
       var m_lasttmonth = moment(lasttmonth_start, "YYYY-MM-DD");
       var howmanymonth = m_lasttmonth.diff(m_firstmonth, 'months');
       var monthlyPrevious = new Array();
       for (i = 0; i < howmanymonth; i++) {
         var month_start = m_month_start.add('M', i).format("YYYY-MM-DD");
         var month_end = m_month_end.add('M', i).format("YYYY-MM-DD");
         monthlyPrevious[i] = totalCat(Depenses.find({
           timestamp: {$gte: month_start, $lte: month_end}
         }));
       }
      var previous = average(monthlyPrevious);
      var current = totalCat(Depenses.find({
        timestamp: {$gte: startmonth, $lte: endmonth}
      }));
      var ratio = Math.round(current / previous * 100);
      if (ratio > 100) ratio = 100;
      return ratio;
    }
    // var previous = totalCat(Depenses.find({
    //   timestamp: {$gte: startlastmonth, $lte: startmonth}
    // }));
    // var current = totalCat(Depenses.find({
    //   timestamp: {$gte: startmonth, $lte: endmonth}
    // }));
    // var ratio = Math.round(current / previous * 100);
    // if (ratio > 100) ratio = 100;
    // return ratio;
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

  Template.summary.rentMRatio = function() {
    return monthlyMratioCat('rent');
  } 
  Template.summary.billsMRatio = function() {
    return monthlyMratioCat('bills');
  } 
  Template.summary.foodMRatio = function() {
    return monthlyMratioCat('food');
  } 
  Template.summary.shoppingMRatio = function() {
    return monthlyMratioCat('shopping');
  } 
  Template.summary.supermarketMRatio = function() {
    return monthlyMratioCat('supermarket');
  } 
  Template.summary.activityMRatio = function() {
    return monthlyMratioCat('activity');
  } 
  Template.summary.carMRatio = function() {
    return monthlyMratioCat('car');
  } 
  Template.summaryall.rendered = function() {
  //drawChartMonthly()
  //var depenseloaded = Depenses.find({}, {sort: {timestamp: -1}});
  //console.log(depenseloaded);
  Deps.autorun(function () { 
    drawChartCurrent();
  });
}
Template.summaryall.Mdepenses = function() {
    //return Depenses.find({}, {sort: {timestamp: -1}});
    var depenses = Depenses.find().fetch();
    var monthlyDepenses = _.groupBy(depenses, function(depense) {
      return depense.timestamp.split("-",2);
    });
    console.log(monthlyDepenses);
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
        //var payeur = document.getElementById('payeur');
        var sam = document.getElementById('payeur_sam').checked;
        var marion = document.getElementById('payeur_marion').checked;
        var payeur = 'both';
        if (sam == true && marion == false) payeur = 'sam';
        if (sam == false && marion == true) payeur = 'marion';
        console.log
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
            payeur: payeur,
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

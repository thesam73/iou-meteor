Depenses = new Meteor.Collection('depenses');

function totalmonthCat(Items) {
	var ds = new Date();
	var curr_date = ds.getFullYear();
	var curr_month = ds.getMonth() + 1; //Months are zero based
	
	//Items.find({timestamp: { $lt: new Date(), $gt: new Date(curr_date+','+curr_month) }});
	//created: { $lt: new Date(), $gt: new Date(year+','+month) } // Get results from start of current month to current time.
	
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

function drawChartMonthly(monthlyDepenses) {
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
			console.log('here');
			DCA.push(DCA_cat);
		}
	}
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
  
  var ds = new Date();
  var curr_dates = ds.getDate();
  var curr_months = ds.getMonth() + 1; //Months are zero based
  var curr_years = ds.getFullYear();
  var dates = '' + curr_years + ', ' + (curr_months<=9 ? '0' + curr_months : curr_months) + ', ' + '00';
  
  //Items.find({timestamp: { $lt: new Date(), $gt: new Date(curr_date+','+curr_month) }});
//    return totalmonthCat(Depenses.find({timestamp: { $lt: new Date(), $gte: new Date(curr_years, curr_months, 0) }}));
	return totalCat(Depenses.find({}));
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
  Template.summary.supermarketAmount = function() {
    return totalCat(Depenses.find({category: 'supermarket'}));
  }
  Template.summary.activityAmount = function() {
    return totalCat(Depenses.find({category: 'activity'}));
  }
  Template.summary.carAmount = function() {
    return totalCat(Depenses.find({category: 'car'}));
  }
  
  Template.summaryall.rendered = function() {
    var depenses = Depenses.find().fetch();
//    var groupedDates = _.groupBy(_.pluck(customers, 'timestamp'), function (date) {return date.split("-",2);});
	var monthlyDepenses = _.groupBy(depenses, function(depense) {
		return depense.timestamp.split("-",2);
		});
	
    _.each(_.values(monthlyDepenses), function(dates) {
      console.log(dates);
    });
    console.log(depenses);
    drawChartMonthly(monthlyDepenses);
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
          $("#confirm").show().delay(1000).fadeOut();
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

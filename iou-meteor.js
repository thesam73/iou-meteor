Depenses = new Meteor.Collection('depenses');
Monthlydepenses = new Meteor.Collection('monthlydepenses');

function anymonthmonthlytotalCat(cat, startmonth, endmonth) {
    return totalCat(Depenses.findFaster({
        category: cat,
        timestamp: {
            $gte: startmonth,
            $lte: endmonth
        }
    }, {fields: {amount: 1}}));
}
function anymonthmonthlytotal(startmonth, endmonth) {
    return totalCat(Depenses.findFaster({
        timestamp: {
            $gte: startmonth,
            $lte: endmonth
        }
    }, {fields: {amount: 1}}));
}

function totalCat(Items) {
    var total = 0;
    Items.forEach(function (item) {
        total += Math.round(item.amount);
    });
    return total;
}

function monthlyCat(cat) {
  var curr_month = Session.get("current_month");
  var current = Monthlydepenses.findOne(
    { month: curr_month }
  );
  var total = 0;
  if (current != undefined) { total = current[String(cat)]; }
  return total;
}

function monthlyCatRatio(cat) {
  var curr_month = Session.get("current_month");
  var total = monthlyCat(cat);
  var otherMonth = Monthlydepenses.find({
    month: {$not: curr_month}
  });
  var totalOtherMonth = 0;
  if (otherMonth.count() > 0 ) {
    otherMonth.forEach(function (item){
      totalOtherMonth += Math.round(item[String(cat)]);
    });
    totalOtherMonth = totalOtherMonth / otherMonth.count();
  }
  var ratio = Math.round(total / totalOtherMonth * 100);
  if (ratio > 100) ratio = 100;
  return ratio;
}

function monthlyMratioCat(cat) {
    var current = monthlyCat(cat);
    var total = monthlyCat("total");
    var ratio = Math.round(current / total * 100);
    if (ratio > 100) ratio = 100;
    return ratio;
}

function drawHelper(cat, month) {
  var current = Monthlydepenses.findOne( { month: month });
  var total = 0;
  if (current != undefined) { total = current[String(cat)]; }
  return total;
}

function drawChartCurrent() {
  $('#chartContainer').html('');
  var curr_month = Session.get("current_month");
  var howmanymonth = Monthlydepenses.find({}).count();
  var dataDimple = new Array();
  if (howmanymonth > 6) howmanymonth = 6;
  var m_currentmonth = moment(curr_month, "YYYY-MM");

  for (i = 0; i < howmanymonth; i++) {
    var month = m_currentmonth.format("YYYY-MM");
    if (i>0) {
      month = m_currentmonth.subtract('M', 1).format("YYYY-MM");
    }
    dataDimple.push(
      { Month: month, Category: "Rent", Amount: drawHelper('rent', month) },
      { Month: month, Category: "Bills", Amount: drawHelper('bills', month) },
      { Month: month, Category: "Food", Amount:  drawHelper('food', month) },
      { Month: month, Category: "Supermarket", Amount: drawHelper('supermarket', month) },
      { Month: month, Category: "Shopping", Amount: drawHelper('shopping', month) },
      { Month: month, Category: "Activity", Amount:  drawHelper('activity', month) },
      { Month: month, Category: "Car", Amount:  drawHelper('car', month) });
  }
  var svg = dimple.newSvg("#chartContainer", 250, 500);
  var myChart = new dimple.chart(svg, dataDimple);
  myChart.setBounds("50px", "20px", "200px", "300px");
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
  y.tickFormat = function (d) {
    return Math.round(d / 1e6) + "$";
  };
  var mySerie = myChart.addSeries("Category", dimple.plot.bar);
  myChart.addLegend(60, 400, 300, 200);
  myChart.draw();
  y.titleShape.remove();
  x.titleShape.remove();
}


if (Meteor.isClient) {
    Meteor.subscribe("Depenses");
    Meteor.subscribe("Monthlydepenses");

    Deps.autorun(function () {
      var d = new Date();
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      var current_month = curr_year + '-' + (curr_month <= 9 ? '0' + curr_month : curr_month);
      Session.set("current_month", current_month);
    });


    Template.depenses.depenses = function () {
        return Depenses.findFaster({}, {
            sort: {
                timestamp: -1
            },
            limit: 45
        });
    }
    Template.depenses.events = {
        'click button.remove': function () {
            var c = confirm("Delete depense?");
            if (c == true) {
                Depenses.remove(this._id);
                consolidateMonth();
            };
        },
        'click #consolidatemonthly': function () {
          //consolidateMonth();
          Meteor.call('consolidateMonthly');
        },
        'click #cleanmonthly': function () {
          Meteor.call('removeAllMonthly');
        }
    }

    Template.login__screen.events = {
        'click #login__button': function () {
            //var pass = document.getElementById('pass');
            //if (pass.value == '7374') {
                $('#login__fullscreen').fadeOut();
                $('#tabs').fadeIn();
            //}
        }
    }

    Template.submitmessage.message = function () {
        return "All good keep spending!";
    }
    Template.action.events = {
        'click #updatedebt': function () {
            var c = confirm("Reset debt?");
            if (c == true) {
                var Items = Depenses.findFaster({
                    payeur: {
                        $ne: 'both'
                    }
                });
                Items.forEach(function (item) {
                    Depenses.update(item._id, {
                        $set: {
                            "payeur": "both"
                        }
                    });
                })
            };
        }
    }

    Template.entryfield.events = {
        'click #submit': function () {
            //submit the form
            var amount = document.getElementById('amount');
            var category = document.getElementById('category');
            var sam = document.getElementById('payeur_sam').checked;
            var marion = document.getElementById('payeur_marion').checked;
            var payeur = 'both';
            if (sam == true && marion == false) payeur = 'sam';
            if (sam == false && marion == true) payeur = 'marion';
            var date_html = document.getElementById('timestamp');
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth() + 1; //Months are zero based
            var curr_year = d.getFullYear();
            var date = '' + curr_year + '-' + (curr_month <= 9 ? '0' + curr_month : curr_month) + '-' + (curr_date <= 9 ? '0' + curr_date : curr_date);
            if (Date.parse(date_html.value)) {
                date = date_html.value;
            };
            if (amount.value != '' && category.value != '') {
                Depenses.insert({
                    amount: amount.value,
                    category: category.value,
                    payeur: payeur,
                    timestamp: date,
                    time: Date()
                });
                Meteor.call('consolidateMonthly');
                $("#confirm").show().delay(700).fadeOut();
                amount.value = '';
            };
        }
    }
    Template.action.amountDebt = function () {
        var samItems = Depenses.findFaster({
            payeur: 'sam'
        });
        var samSum = 0;
        samItems.forEach(function (item) {
            samSum += Math.round(item.amount);
        })
        var marionItems = Depenses.findFaster({
            payeur: 'marion'
        });
        var marionSum = 0;
        marionItems.forEach(function (item) {
            marionSum += Math.round(item.amount);
        })
        var sum = marionSum - samSum;
        if (sum < 0) {
            return -sum / 2;
        } else {
            return sum / 2;
        }
    }
    Template.action.nameDebt = function () {
        var samItems = Depenses.findFaster({
            payeur: 'sam'
        });
        var samSum = 0;
        samItems.forEach(function (item) {
            samSum += Math.round(item.amount);
        })
        var marionItems = Depenses.findFaster({
            payeur: 'marion'
        });
        var marionSum = 0;
        marionItems.forEach(function (item) {
            marionSum += Math.round(item.amount);
        })
        var sum = marionSum - samSum;
        if (sum < 0) {
            return "Marion";
        } else {
            return "Sam";
        }
    }

    Template.monthly__sal.monthlyTotal = function () {
      return monthlyCat("total");
    }




    Template.monthly__sal.monthlyRatio = function () {
      var total = monthlyCat("total");

      var ratio = Math.round(total / 4300 * 100);
      if (ratio > 100) ratio = 100;
      return ratio;
    }
    Template.summary.totalAmount = function () {
        return monthlyCat("total");
    }
    Template.summary.totalRatio = function () {
      if (Monthlydepenses.findFaster().count() > 0) {
        //console.log(Monthlydepenses);
        var total = monthlyCat("total");

        var current_m = moment(Session.get("current_month"), "YYYY-MM");
        var prev_month = current_m.subtract('M', 1).format("YYYY-MM");
        var prev = Monthlydepenses.findOne(
          { month: prev_month }
        );
        var prev_total = 0;
        if (prev != undefined) { prev_total = prev.total; }
        var ratio = Math.round(total / prev_total * 100);
        if (ratio > 100) ratio = 100;
        return ratio;
      }
      else {
        return [];
      }
    }

    Template.summary.helpers({
      expensesentries: function() {
        var results = [];
        results.push({
            icon: "icon-home",
            table__name: "table__rent",
            amount: monthlyCat('rent'),
            category: "rent",
            ratio: monthlyCatRatio('rent')
        });
        results.push({
            icon: "icon-setting-1",
            table__name: "table__bills",
            amount: monthlyCat('bills'),
            category: "bills",
            ratio: monthlyCatRatio('bills')
        });
        results.push({
            icon: "icon-fast-food",
            table__name: "table__food",
            amount: monthlyCat('food'),
            category: "food",
            ratio: monthlyCatRatio('food')
        });
        results.push({
            icon: "icon-shopping-cart",
            table__name: "table__shopping",
            amount: monthlyCat('shopping'),
            category: "shopping",
            ratio: monthlyCatRatio('shopping')
        });
        results.push({
            icon: "icon-tshirt",
            table__name: "table__supermarket",
            amount: monthlyCat('supermarket'),
            category: "supermarket",
            ratio: monthlyCatRatio('supermarket')
        });
        results.push({
            icon: "icon-ticket",
            table__name: "table__activity",
            amount: monthlyCat('activity'),
            category: "activity",
            ratio: monthlyCatRatio('activity')
        });
        results.push({
            icon: "icon-boat",
            table__name: "table__car",
            amount: monthlyCat('car'),
            category: "car",
            ratio: monthlyCatRatio('car')
        });
        return results;
    }
    });


    Template.summary.rentMRatio = function () {
        return monthlyMratioCat('rent');
    }
    Template.summary.billsMRatio = function () {
        return monthlyMratioCat('bills');
    }
    Template.summary.foodMRatio = function () {
        return monthlyMratioCat('food');
    }
    Template.summary.shoppingMRatio = function () {
        return monthlyMratioCat('shopping');
    }
    Template.summary.supermarketMRatio = function () {
        return monthlyMratioCat('supermarket');
    }
    Template.summary.activityMRatio = function () {
        return monthlyMratioCat('activity');
    }
    Template.summary.carMRatio = function () {
        return monthlyMratioCat('car');
    }

    Template.summaryall.Mdepenses = function () {
        //return Depenses.findFaster({}, {sort: {timestamp: -1}});
        var depenses = Depenses.findFaster().fetch();
        var monthlyDepenses = _.groupBy(depenses, function (depense) {
            return depense.timestamp.split("-", 2);
        });
        //console.log(monthlyDepenses);
    }



    Template.navmenu.events = {
        'click #btn__add': function (e) {
            $("#btn__add").addClass("tab-current");
            $("#btn__current").removeClass("tab-current");
            $("#btn__stats").removeClass("tab-current");
            $("#btn__data").removeClass("tab-current");

            $("#section__add").addClass("current");
            $("#section__current").removeClass("current");
            $("#section__stats").removeClass("current");
            $("#section__data").removeClass("current");
        },
        'click #btn__current': function (e) {
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
        'click #btn__data': function (e) {
            $("#btn__add").removeClass("tab-current");
            $("#btn__current").removeClass("tab-current");
            $("#btn__stats").removeClass("tab-current");
            $("#btn__data").addClass("tab-current");

            $("#section__add").removeClass("current");
            $("#section__current").removeClass("current");
            $("#section__stats").removeClass("current");
            $("#section__data").addClass("current");
        },
        'click #btn__stats': function (e) {
            $("#btn__stats").addClass("tab-current");
            $("#btn__current").removeClass("tab-current");
            $("#btn__add").removeClass("tab-current");
            $("#btn__data").removeClass("tab-current");

            $("#section__add").removeClass("current");
            $("#section__current").removeClass("current");
            $("#section__stats").addClass("current");
            $("#section__data").removeClass("current");

            drawChartCurrent();
        }
    }

}

if (Meteor.isServer) {
    Meteor.startup(function () {
      return Meteor.methods({
        removeAllMonthly: function() {
          return Monthlydepenses.remove({});
        },
        consolidateMonthly: function() {
          var firstmonth_start = Depenses.findFaster({}, {sort: {timestamp: 1}}).fetch()[0].timestamp.slice(0, -2) + '01';
          var firstmonth_end = Depenses.findFaster({}, {sort: {timestamp: 1}}).fetch()[0].timestamp.slice(0, -2) + '01';
          var lasttmonth_start = Depenses.findFaster({}, {sort: {timestamp: -1}}).fetch()[0].timestamp.slice(0, -2) + '01';
          var lasttmonth_end = Depenses.findFaster({}, {sort: {timestamp: -1}}).fetch()[0].timestamp.slice(0, -2) + '31';
          var lasttmonth = Depenses.findFaster({}, {sort: {timestamp: -1}}).fetch()[0].timestamp.slice(0, -2);
          var m_firstmonth_start = moment(firstmonth_start, "YYYY-MM-DD");
          var m_firstmonth_end = moment(firstmonth_end, "YYYY-MM-DD");
          var m_lasttmonth_start = moment(lasttmonth_start, "YYYY-MM-DD");
          var m_lasttmonth_end = moment(lasttmonth_end, "YYYY-MM-DD");
          var m_lastmonth = moment(lasttmonth, "YYYY-MM");
          var howmanymonth = m_lasttmonth_start.diff(m_firstmonth_start, 'months') + 1;
          //Loop all months
          for (i = 0; i < howmanymonth; i++) {
            var month_start = m_lasttmonth_start.format("YYYY-MM-DD");
            var month_end = m_lasttmonth_end.format("YYYY-MM-DD");
            var month_value = m_lastmonth.format("YYYY-MM");
            if (i>0) {
              month_start = m_lasttmonth_start.subtract('M', 1).format("YYYY-MM-DD");
              month_end = m_lasttmonth_end.subtract('M', 1).format("YYYY-MM-DD");
              month_value = m_lastmonth.subtract('M', 1).format("YYYY-MM");
            }
            //Grab existing data
            var monthly_data = Monthlydepenses.findFaster({
              month: month_value
            }).fetch()[0];
            //console.log(monthly_data);
            //If not existing data, insert new one, else update
            if (monthly_data == undefined) {
              Monthlydepenses.insert({
                month: month_value,
                rent: anymonthmonthlytotalCat('rent', month_start, month_end),
                bills: anymonthmonthlytotalCat('bills', month_start, month_end),
                food: anymonthmonthlytotalCat('food', month_start, month_end),
                supermarket: anymonthmonthlytotalCat('supermarket', month_start, month_end),
                shopping: anymonthmonthlytotalCat('shopping', month_start, month_end),
                activity: anymonthmonthlytotalCat('activity', month_start, month_end),
                car: anymonthmonthlytotalCat('car', month_start, month_end),
                total: anymonthmonthlytotal(month_start, month_end)
              });
            }
            else {
              Monthlydepenses.update(monthly_data._id, {
                month: month_value,
                rent: anymonthmonthlytotalCat('rent', month_start, month_end),
                bills: anymonthmonthlytotalCat('bills', month_start, month_end),
                food: anymonthmonthlytotalCat('food', month_start, month_end),
                supermarket: anymonthmonthlytotalCat('supermarket', month_start, month_end),
                shopping: anymonthmonthlytotalCat('shopping', month_start, month_end),
                activity: anymonthmonthlytotalCat('activity', month_start, month_end),
                car: anymonthmonthlytotalCat('car', month_start, month_end),
                total: anymonthmonthlytotal(month_start, month_end)
              });
            }
          }
        }
      });
        //$('#tabs').style.visibility = 'hidden';
        // code to run on server at startup
    });
}

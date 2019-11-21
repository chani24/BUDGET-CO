//BUDGET CONTROLLER
var budgetController = (function () {

  var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };

    var Income = function(id, description, value) {
          this.id = id;
          this.description = description;
          this.value = value;

      };

      var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
      };

    var data = {
      allItems: {
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      },
      budget: 0,
      percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function(type, id)
        {
          var ids, index;
          //data.allItems[type][];

          var ids = data.allItems[type].map(function(current){
            return current.id;
          });

          index = ids.indexOf(id);

          //delete item from the array
          if (index !== -1) {
            data.allItems[type].splice(index, 1);
          }
        },
        calculateBudget: function(){

          //calculate the total income and expenses
          calculateTotal('exp');
          calculateTotal('inc');

          //calculate the budget : income - expenses
          data.budget = data.totals.inc - data.totals.exp;

          //calculate the % of income spent

          if(data.totals.inc > 0){
          this.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
          }
          else {
            this.percentage = -1;
          }
        },

        getBudget: function(){
        return{
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.percentage
        };
        },

        testing: function () {
          console.log(data);
        }

      };


})();


//UI CONTROLLER
var UIController = (function(){



  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.inc-label',
    expensesLabel: '.exp-label',
    container:'.left-side',
    month: '.current-month'

  };

  var formatNumber= function(num, type){
    var numSplit, int, dec;
  //  + or - before the number, 2 decimal places and comma seperating the thousands

    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.');

    int = numSplit[0];
    if(int.length > 3){
    int =  int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length)
    }

   dec = numSplit[1];

    return (type === 'exp' ? '-': '+')+''+ int +'.'+ dec;
  };

  var nodeListForEach = function(list, callback) {
      for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
      }};

  //some code
  return {
    getInput: function(){
      return {
         type : document.querySelector(DOMstrings.inputType).value,//either inc or exp
         description : document.querySelector(DOMstrings.inputDescription).value,
        value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type){

      var html, newHtml, element;
      //create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type ==='exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      ///replace placeholder witha ctual data

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


      //insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
     },

     deleteListItem: function(selectorID){
       var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
     },

    clearFields: function(){

      var fields, fieldsArr;

    fields =  document.querySelectorAll(DOMstrings.inputDescription + ',' +
    DOMstrings.inputValue);

     fieldsArr = Array.prototype.slice.call(fields);

     fieldsArr.forEach(function(cur, i, array){
       cur.value = '';
     });

     fieldsArr[0].focus();
  },

  displayBudget: function(obj){
    var type;

    obj.budget > 0 ? type = 'inc': type = 'exp';

    document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
    document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
    document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');


  },

  displayMonth : function(){
    var now, year, month, months;

    var now = new Date();

    year = now.getFullYear();
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    month = now.getMonth();

    document.querySelector(DOMstrings.month).textContent = months[month] +' ' + year;
  },


  changedType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },


        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

var setupEventListeners = function() {


  var DOM = UICtrl.getDOMstrings();

  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event){
  if(event.KeyCode === 13 || event.which === 13){

  }
  });

  document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

  document.querySelector(DOM.inputType).addEventListener('click', UICtrl.changedType);
};


   var updateBudget = function(){
     // calculate budget
     budgetCtrl.calculateBudget();


     //return the budget
     var budget = budgetCtrl.getBudget();

     //display the budget on the ui
     UICtrl.displayBudget(budget);
   };

  var ctrlAddItem = function(){
   var input, newItem;

    //1 get field input data
    input = UICtrl.getInput();
    console.log(input);

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {



    //2 add item to budget CONTROLLER
     newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //3 Add the item to the Ui
    UICtrl.addListItem(newItem, input.type);


    // clear the fields

    UICtrl.clearFields();
    //4 calculate the budget
    updateBudget();



  }
  };


  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

   if(itemID){
     //inc-1
     splitID = itemID.split('-');
     type= splitID[0];
     ID = parseInt(splitID[1]);


     // delete item from data structure
     budgetCtrl.deleteItem(type, ID);
     //delete the item from ui
    UICtrl.deleteListItem(itemID);
     //update and show the new budget
     updateBudget();


   }
  };

  return {
    init: function(){
      console.log('Application don start');
      setupEventListeners();
      UICtrl.displayMonth();
    }
  };




//some code
})(budgetController, UIController);




controller.init();

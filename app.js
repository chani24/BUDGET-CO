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
    container:'.left-side'

  };

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
      newHtml = newHtml.replace('%value%', obj.value);


      //insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
     },

     deleteListItem: function(selectorID){

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

    document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
    document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
    document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;


  },


    getDOMstrings: function(){
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

     //update and show the new budget


   }
  };

  return {
    init: function(){
      console.log('Application don start');
      setupEventListeners();
    }
  };




//some code
})(budgetController, UIController);




controller.init();

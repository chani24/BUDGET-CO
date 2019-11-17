//BUDGET CONTROLLER
var budgetController = (function () {



})();


//UI CONTROLLER
var UIController = (function () {




  var DOMstrings = {
    inputDescription: '.add__description',
    inputValue: 'add__value',
    inputBtn: '.add__btn'
  }


  return {
    getInput: function(){
      return {
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function(){
      return DOMstrings;
    }
  }



})();



//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

var setupEventListeners = function(){


var DOM = UICtrl.getDOMstrings();

document.querySelectorAll(DOM.inputBtn).forEach(item => {item.addEventListener('click', ctrlAddItem)});

document.addEventListener('keypress', function(event){
  if (event.keycode === 13 || event.which === 13) {


  }
});
};




var ctrlAddItem = function(){
  //1 get input field data

console.log(4);
  //2 add item to budget CONTROLLER


  //3 add item to ui

  //4 calculate budgetCtrl


  //5 display budget on ui
};


return {
  init: function(){
    console.log('e gba mi');
    setupEventListeners();
  }
}

})(budgetController, UIController);




controller.init();

//WRAP IN STRICT FUNCTION
(function () {
    'use strict';

    //function formatQueryParams () {
        //const queryItems = Object.keys(params)
            //.map(key => `${key}=${params[key]}`);
        //return queryItems.join('&');
    //}

    const mealType = $(`input[name=mealType]:checked`).val();
    const allergens = $(`input[name=intolerance]:checked`).map((index,checkbox) => $(checkbox).val()).get();
    

    function handleSearch () {  
        //listens to meal form for when Search button is pressed {
        $('form').submit( event => {
            event.preventDefault();
            //calls functions to get recipes show drink choices
            getMealRecipe (allergens, mealType);
            getWinePairings ();
            getDrinkRecipe ();
            //shows drink form previously hidden
            showDrinkChoices ();
        });
        
    }

    //build comma seperated string of allergens

    function handleDrinkChoice () {
        $('main').on('submit', '#drinkChoice', function(event) {
            event.preventDefault();
            let drinkChoice = $(`input[name=drinkType]:checked`).val();
            if (drinkChoice == $(`input[value=wine]:checked`).val()) {
                $('#drinkResults').html(generateWinePairingsHTML());
            }
            else {
                $('#drinkResults').html(generateDrinkRecipeHTML());
            }
        })
    }

    function getMealRecipe() {
        const apiKEY = 'f8ce37b549224d84a98a622cf58e012a';
        const searchURL = 'https://api.spoonacular.com/recipes/random';
        const params = {
            apiKey: apiKEY,
            tags: mealType + allergens,
        }
        const queryString = formatQueryParams(params)
        const url = searchURL + '?' + queryString;
        //searches spoonacular API for random food recipe
        fetch(url)
            .then(response => {
            if (response.ok) {
                //updates STORE w recipe details
                STORE.mealRecipe = response.json();
            }
            //??.then(() => generateMealRecipeHTML(STORE.mealRecipe))
            //??.catch(err => {
            //??$('#js-error-message').text(`Something went wrong: ${err.message}`);
            //})
            })
        //calls generateMealRecipeHTML()
    }

    //function getWinePairings() {
        //searches spoonacular API for wine pairings {
            //updates STORE w wine pairings
        //}
    //}

    //function getDrinkRecipe () {
        //searches the cocktail db API for ramdon drink recipe {
            //updates STORE w recipe details
        //}
    //}

    //function generateMealRecipeHTML () {
        //looks at meal recipe data in STORE and returns HTML
    //}

    //function generateWinePairingsHTML () {
        //loops through wine pairings in STORE and creates HTML
        //
    //}

    //function generateDrinkRecipeHTML () {
        //creates HTML for drink recipe
    //}

    //function showDrinkChoices () {
        //shows drinks form previously hidden
    //}

    //function handleNewSearch() {
        // brings back to homepage and clears all previous inputs and STORE
    //}

    //READY FUNCTION
    $(function () {
        console.log('App loaded! Waiting for submit!');
        handleSearch();
        handleDrinkChoice ();
    });

}());
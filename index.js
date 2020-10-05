//WRAP IN STRICT FUNCTION
(function () {
    'use strict';

    function formatQueryParams (params) {
        const queryItems = Object.keys(params)
            .map(key => `${key}=${params[key]}`);
        return queryItems.join('&');
    }

    function handleSearch () {  
        //listens to meal form for when Search button is pressed {
        $('form').submit( event => {
            event.preventDefault();
            //calls functions to get recipes show drink choices
            $('.cook').addClass('hidden');
            getMealRecipe ();
            getWinePairings ();
            getDrinkRecipe ();
            //shows drink form previously hidden
            showDrinkChoices ();
        });
        
    }

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
        const mealType = $(`input[name=mealType]:checked`).val();
        const tags = $(`input[name=intolerance]:checked`).map((index,checkbox) => $(checkbox).val()).get();
        tags.push(mealType);
        const params = {
            apiKey: apiKEY,
            tags: tags.join(',')
        };
        const queryString = formatQueryParams(params);
        const url = searchURL + '?' + queryString;
        //searches spoonacular API for random food recipe
        fetch(url)
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            })
            .then(responseJson => generateMealRecipeHTML(responseJson))
            .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
            });
            //???update store w meal recipe details??
            STORE.mealRecipe = response.json;
    }

    function getWinePairings() {
        const apiKEY = 'f8ce37b549224d84a98a622cf58e012a';
        const searchURL = 'https://api.spoonacular.com/food/wine/pairing';
        const params = {
            apiKey: apiKEY,
            //correct way to access this value????
            tag: $(STORE.mealRecipe.recipes[0].extendedingredients[0].name).value()
        }
        const queryString = formatQueryParams(params);
        const url = searchURL + '?' + queryString;
        //searches spoonacular API for wine pairings
        fetch(url)
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            })
            .then(responseJson => generateMealRecipeHTML(responseJson))
            .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
            });
            //updates STORE w wine pairings????
            STORE.winePairings = responseJson;

            console.log(STORE.winePairings);
            console.log(responseJson);
            console.log(tag);
    }

    function getDrinkRecipe () {
        //searches the cocktail db API for ramdon drink recipe
        const url = `https://www.thecocktaildb.com/api/json/v1/1/random.php`
        fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(responseJson => generateDrinkRecipeHTML(responseJson))
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
        //update STORE w recipe details??
        STORE.drinkChoice = responseJson
    }

    function generateMealRecipeHTML (mealRecipe) {
        //looks at meal recipe data in STORE and returns HTML
        console.log(mealRecipe);
    }

    //function generateWinePairingsHTML () {
        //loops through wine pairings in STORE and creates HTML
        //
    //}

    function generateDrinkRecipeHTML (drinkRecipe) {
        //creates HTML for drink recipe
        console.log(drinkRecipe);
    }

    function showDrinkChoices () {
        //shows drinks form previously hidden
        $('.drink').removeClass('hidden');
    }

    function handleNewSearch() {
        // brings back to homepage and clears all previous inputs and ??STORE
        $('main').on('click', '.newRecipe', function (event) {
            $('[name="mealType"] input:radio').removeAttr('checked');
            $('[name="intolerance"] input:checkbox').removeAttr('checked');
            $('[name="drinkType"] input:radio').removeAttr('checked');
            $('.cook').removeClass('hidden');
            $('.drink').addClass('hidden');
            $('.newRecipe').addClass('hidden');
        })
    }

    //READY FUNCTION
    $(function () {
        console.log('App loaded! Waiting for submit!');
        handleSearch();
        handleDrinkChoice ();
    });

}());
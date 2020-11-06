(function () {
    'use strict';

    function formatQueryParams(params) {
        const queryItems = Object.keys(params)
            .map(key => `${key}=${params[key]}`);
        return queryItems.join('&');
    }

    function handleSearch () {  
        $('body').on('submit', '.cook', function(event) {
            event.preventDefault();
            $('.cook').addClass('hidden');
            getMealRecipe ();
            showDrinkChoices ();
            handleNewSearch ();
        });
    }

    function handleDrinkChoice () {
        $('body').on('submit', '#drinkChoice', function(event) {
            event.preventDefault();
            let drinkChoice = $('input[name=drinkType]:checked').val();
            if (drinkChoice == $('input[value=wine]:checked').val()) {
                $('#drinkResults').html(getWinePairings());
            }
            if (drinkChoice == $('input[value=mixedDrink]:checked').val()) {
                $('#drinkResults').html(getDrinkRecipe());
            }
        });
    }

    function getMealRecipe() {
        const apiKEY = 'f8ce37b549224d84a98a622cf58e012a';
        const searchURL = 'https://api.spoonacular.com/recipes/random';
        const mealType = $(`input[name=mealType]:checked`).val();
        const tags = $(`input[name=intolerance]:checked`).map((index,checkbox) => $(checkbox).val()).get();
        const diet = $(`input[name=diet]:checked`).map((index,checkbox) => $(checkbox).val()).get();
        tags.push(mealType);
        tags.push(diet);
        const params = {
            apiKey: apiKEY,
            tags: tags.join(','),
        };
        const queryString = formatQueryParams(params);
        const url = searchURL + '?' + queryString;
        console.log(url);
        fetch(url)
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            })
            .then(responseJson => {
                STORE.mealRecipe = responseJson;
                console.log(STORE.mealRecipe);
                $('.mealRecipeResults').removeClass('hidden');
                $('.mealRecipeResults').html(generateMealRecipeHTML(responseJson));
            })
            .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
            });
    }

    function determineFoodForWinePairing() {
        let food = '';
            for (let i=0; i<STORE.mealRecipe.recipes[0].extendedIngredients.length; i++) {
                if (STORE.mealRecipe.recipes[0].extendedIngredients[i].aisle == "Meat") {
                    food = STORE.mealRecipe.recipes[0].extendedIngredients[i].name;
                }
        }
        return food;
    }

    function getWinePairings() {
        const apiKEY = 'f8ce37b549224d84a98a622cf58e012a';
        const searchURL = 'https://api.spoonacular.com/food/wine/pairing';
        const params = {
            apiKey: apiKEY,
            food: determineFoodForWinePairing(),
        };
        console.log (params.food);
        const queryString = formatQueryParams(params);
        const url = searchURL + '?' + queryString;
        if ( !params.food) {
            $('#drinkResults').html(`<p>Sorry no wine pairing found.<br>Perhaps try a mixed drink :-)</p>`);
        }
        else {
            fetch(url)
                .then(response => {
                if (response.ok) {
                    return response.json();
                }
                })
                .then(responseJson => {
                    STORE.winePairings = responseJson;
                    console.log (responseJson);
                    $("#drinkResults").html(generateWinePairingsHTML(responseJson));
                })
                .catch(err => {
                $('#js-error-message').text(`Something went wrong: ${err.message}`);
                });
        }
        
    }

    function getDrinkRecipe () {
        const url = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
        fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(responseJson => {
            STORE.drinkChoice = responseJson;
            console.log (responseJson);
            $("#drinkResults").html(generateDrinkRecipeHTML(responseJson));
        })
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
    }

    function generateMealRecipeHTML (mealRecipe) {
        let ingredientList = '';
        let recipeInstructions = mealRecipe.recipes[0].instructions;
        for (let i=0; i<mealRecipe.recipes[0].extendedIngredients.length; i++) {
            ingredientList += `<li>${mealRecipe.recipes[0].extendedIngredients[i].original}</li>`;
        }
        return `<p class="title bold"> Meal Name: ${mealRecipe.recipes[0].title}</p>
            <div class="row">
                <div class="ingredients">
                    <p class="title bold"> Ingredients: </p>
                    <ul id="ingredients">${ingredientList}</ul>
                </div>
                <div class="title recipe">
                    <p class="bold"> Recipe: </p>
                    <div class="instructions">${recipeInstructions.replace('\n', '<br>')}</div>
                </div>
            </div>`
    }

    function generateWinePairingsHTML () {
        let pairingText = STORE.winePairings.pairingText;
        if (pairingText === "") {
            return `<p>Sorry no wine pairing found.<br>Perhaps try a mixed drink :-)</p>`;
        } else {
            return `<p>Suggested wine pairings: ${pairingText}</p>`;
        }
    }

    function generateDrinkRecipeHTML (drinkRecipe) {
        let ingredientList = '';
        let recipeInstructions = drinkRecipe.drinks[0].strInstructions;
        for (let i=1; i<=15; i++) {
            let ingredient = drinkRecipe.drinks[0]["strIngredient" + i];
            let measurement = drinkRecipe.drinks[0]["strMeasure" + i];
            if (ingredient !== null) {
                ingredientList += `<li>${ingredient}, ${measurement}</li>`;
            }
        }
        return `<p class="title bold"> Cocktail Name: ${drinkRecipe.drinks[0].strDrink}</p>
            <p class="bold"> Ingredients: </p>
            <ul id="ingredients center">${ingredientList}</ul>
            <p> ${recipeInstructions}</p>`
    }

    function showDrinkChoices () {
        $('.drink').removeClass('hidden');
        $('.newRecipe').removeClass('hidden');
        handleDrinkChoice();
    }

    function handleNewSearch() {
        $('body').on('click', '.newRecipe', function (event) {
            $('input[type=checkbox]').prop('checked',false);
            $('input[type=radio]').prop('checked',false);
            $('.mealRecipeResults').addClass('hidden');
            $('.cook').removeClass('hidden');
            $('.drink').addClass('hidden');
            $('.newRecipe').addClass('hidden');
            $('#drinkResults').html('');
        })
    }

    $(function () {
        console.log('App loaded! Waiting for submit!');
        handleSearch();
    });

}());
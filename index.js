(function () {
    'use strict';

    function formatQueryParams(params) {
        const queryItems = Object.keys(params)
            .map(key => `${key}=${params[key]}`);
        return queryItems.join('&');
    }

    function handleSearch () {  
        $('.cook').on('click', '#recipeSearch', function(event) {
            event.preventDefault();
            $('.cook').addClass('hidden');
            getMealRecipe ();
            showDrinkChoices ();
            handleNewSearch ();
        });
        
    }

    function handleDrinkChoice () {
        $('body').on('click', '#drinkSearch', function(event) {
            event.preventDefault();
            let drinkChoice = $(`input[name=drinkType]:checked`).val();
            if (drinkChoice == $(`input[value=wine]:checked`).val()) {
                $('#drinkResults').html(getWinePairings());
            }
            if (drinkChoice == $(`input[value=mixedDrink]:checked`).val()) {
                $('#drinkResults').html(getDrinkRecipe());
            }
        });
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
        fetch(url)
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            })
            .then(responseJson => {
                STORE.mealRecipe = responseJson;
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
        const queryString = formatQueryParams(params);
        const url = searchURL + '?' + queryString;
        if ( !params.food) {
            $('#drinkResults').html(`<p>Sorry no wine pairing found. Perhaps try a mixed drink :-)</p>`);
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
                    $("#drinkResults").html(generateWinePairingsHTML(responseJson));
                    console.log(responseJson);
                })
                .catch(err => {
                $('#js-error-message').text(`Something went wrong: ${err.message}`);
                });
                console.log(params.food);
        }
    }

    function getDrinkRecipe () {
        //searches the cocktail db API for ramdon drink recipe
        const url = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
        fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(responseJson => {
            STORE.drinkChoice = responseJson;
            $("#drinkResults").html(generateDrinkRecipeHTML(responseJson));
        })
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
            console.log(err.message);
        });
    }

    function generateMealRecipeHTML (mealRecipe) {
        let ingredientList = '';
        let recipeInstructions = mealRecipe.recipes[0].instructions;
        console.log(recipeInstructions);
        console.log(mealRecipe.recipes[0].title);
        console.log(mealRecipe.recipes[0]);
        for (let i=0; i<mealRecipe.recipes[0].extendedIngredients.length; i++) {
            ingredientList += `<li>${mealRecipe.recipes[0].extendedIngredients[i].original}</li>`;
        }
        console.log(ingredientList);
        return `<p> Meal Name: ${mealRecipe.recipes[0].title}</p>
            <p> Ingredients: </p>
            <ul id="ingredients">${ingredientList}</ul>
            ${recipeInstructions}`
    }

    function generateWinePairingsHTML () {
        let pairingText = STORE.winePairings.pairingText;
        return `<p>Suggested wine pairings: ${pairingText}</p>`;
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
        console.log(ingredientList);
        return `<p> Cocktail Name: ${drinkRecipe.drinks[0].strDrink}</p>
            <p> Ingredients: </p>
            <ul id="ingredients">${ingredientList}</ul>
            <p> ${recipeInstructions}</p>`
    }

    function showDrinkChoices () {
        $('.drink').removeClass('hidden');
        $('.newRecipe').removeClass('hidden');
        handleDrinkChoice();
    }

    function handleNewSearch() {
        $('body').on('click', '.newRecipe', function (event) {
            $('[name="mealType"] input:radio').removeAttr('checked');
            $('[name="intolerance"] input:checkbox').removeAttr('checked');
            $('[name="drinkType"] input:radio').removeAttr('checked');
            $('.mealRecipeResults').addClass('hidden');
            $('.cook').removeClass('hidden');
            $('.drink').addClass('hidden');
            $('.newRecipe').addClass('hidden');
        })
    }

    $(function () {
        console.log('App loaded! Waiting for submit!');
        handleSearch();
    });

}());
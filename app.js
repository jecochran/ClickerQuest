document.addEventListener('DOMContentLoaded', function () {
    const hero = {
        currency: 0,
        facilityLevel: 1,
        level: 1,
        passiveIncome: 0,
        image: '',
        backstory: ''
    };

    const heroSRC = "";
    const facilityCost = 100;
    const forgeCost = 200;

    const buyFacilityButton = document.getElementById('buy-facility');
    const buyForgeButton = document.getElementById('buy-forge');

    // Declare and Initialize Silhouette and heroLevelDiv
    const heroLevelDiv = document.querySelector('.hero-level');
    const silhouette = document.getElementById('silhouette');

    //Initialize Images
    const facilityIMG = document.querySelector('.Facility');


    // Add event listener to the scroll icon to open the shop
    const scrollIcon = document.querySelector('.scroll-icon');
    scrollIcon.addEventListener('click', openShop);

    // Add event listener to the close button in the shop modal to close the shop
    const shopCloseButton = document.querySelector('#shopModal .close');
    shopCloseButton.addEventListener('click', closeShop);

    function openShop() {
        console.log(hero.currency);
        document.getElementById('shopModal').style.display = 'block';
    }

    function closeShop() {
        document.getElementById('shopModal').style.display = 'none';
    }


    buyFacilityButton.addEventListener('click', function () {
        if (hero.currency >= facilityCost) {
            hero.currency -= facilityCost;
            hero.facilityLevel = 1; // Start the facility at level 1
            updateCurrencyDisplay();
            updateFacilityLevel();
            startPassiveIncome(); // Start generating passive currency
            buyFacilityButton.disabled = true; // Disable the buy button
            facilityIMG.style.display = 'block'; // Show the Facility
        } else {
            alert('Not enough Gold!');
        }
    });

    buyForgeButton.addEventListener('click', function () {
        if (hero.currency >= forgeCost) {
            hero.currency -= forgeCost;
            updateCurrencyDisplay();
            // Show the Forge in the game
            document.querySelector('.Forge').style.display = 'block';
            // Disable the buy button
            buyForgeButton.disabled = true;
        } else {
            alert('Not enough Gold!');
        }
    });

    const gameplayElements = document.querySelectorAll('.gameplay, .upgrades, .hero-level, .leaderboard');
    const heroForm = document.getElementById('hero-form');
    const heroModal = document.getElementById('heroModal');
    const heroImage = document.getElementById('hero-image');

    const closeSpan = document.getElementsByClassName('close')[0];

    function toggleGameplayElements(display) {
        gameplayElements.forEach(element => element.style.display = display);
    }

    function showModal() {
        heroImage.src = heroSRC;
        heroModal.style.display = 'block';
    }

    function startGame() {
        toggleGameplayElements('block');
        document.querySelector('.blur-background').style.filter = 'none';
        document.querySelector('.hero-creation').style.display = 'none';
        addEventListeners();
    }


    silhouette.addEventListener('click', function () {
        const levelUpCost = getHeroLevelUpCost();
        if (hero.currency >= levelUpCost) {
            hero.level++;
            hero.currency -= levelUpCost;
            updateHeroLevel();
            updateCurrencyDisplay();
        } else {
            alert("Insufficient currency to level up!");
        }
    });

    function startWalking() {

        silhouette.style.display = 'block'; // Show the silhouette
        let position = 0;
        let direction = 1; // 1 for right, -1 for left
        let isMoving = true;

        silhouette.addEventListener('mouseover', function () {
            isMoving = false;
        })

        silhouette.addEventListener('mouseout', function () {
            isMoving = true;
        })



        function move() {
            if (isMoving) {
                position += 2 * direction; // Adjust the speed as needed
                silhouette.style.left = position + 'px';

                // Apply the bobbing animation when moving
                silhouette.style.animation = 'walking 0.5s infinite';

                // Randomly change direction
                if (Math.random() < 0.001) { // Adjust probability as needed
                    direction *= -1;
                    silhouette.style.transform = `scaleX(${direction})`; // Flip the image
                }
            } else {
                // Remove the bobbing animation when stopped
                silhouette.style.animation = 'none';
            }

            // Randomly stop and start moving
            if (Math.random() < 0.005) { // Adjust probability as needed
                isMoving = !isMoving;
            }

            // Keep the silhouette within the screen bounds
            if (position < 0) {
                position = 0;
                direction = 1;
                silhouette.style.transform = 'scaleX(1)';
            } else if (position > window.innerWidth - silhouette.offsetWidth) {
                position = window.innerWidth - silhouette.offsetWidth;
                direction = -1;
                silhouette.style.transform = 'scaleX(-1)';
            }

            heroLevelDiv.style.left = (position + silhouette.offsetWidth / 2) + 'px';

            requestAnimationFrame(move);
        }

        move();
    }





    // Submit the Hero
    heroForm.addEventListener('submit', function (event) {
        event.preventDefault();
        generateHero();
        generateBackstory();
        startWalking();
        const wordOne = document.getElementById('word-one').value.trim();
        const wordTwo = document.getElementById('word-two').value.trim();

        hero.image = '';
        hero.backstory = '';

        showModal();
        startGame();
    });

    closeSpan.onclick = function () {
        heroModal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === heroModal) {
            heroModal.style.display = 'none';
        }
    };

    function addEventListeners() {
        const upgradeFacilityButton = document.getElementById('upgrade-facility');
        const levelUpButton = document.getElementById('level-up');
        const phoneBooth = document.querySelector('.phoneBooth');

        facilityIMG.addEventListener('click', function () {
            const upgradeCost = getUpgradeCost();
            if (hero.currency >= upgradeCost) {
                hero.facilityLevel++;
                hero.currency -= upgradeCost;
                updateCurrencyDisplay();
                updateFacilityLevel();
                if (hero.facilityLevel > 1) {
                    startPassiveIncome();
                }
            } else {
                alert("Insufficient currency to upgrade!");
            }
        });


        phoneBooth.addEventListener('mousedown', function () {
            phoneBooth.classList.add('darken');
            hero.currency += calculateClickCurrency();
            updateCurrencyDisplay();
        });

        phoneBooth.addEventListener('mouseup', function () {
            phoneBooth.classList.remove('darken');
        });
    }

    function calculateClickCurrency() {
        return hero.level * 2;
    }

    function updateCurrencyDisplay() {
        const currencyDisplay = document.getElementById('currency-display');
        currencyDisplay.innerText = hero.currency;
    }

    function updateFacilityLevel() {
        const facilityLevelDisplay = document.getElementById('facility-level');
        facilityLevelDisplay.innerText = hero.facilityLevel;
    }

    function updateHeroLevel() {
        const heroLevelDisplay = document.getElementById('hero-level');
        heroLevelDisplay.innerText = hero.level;
    }

    function startPassiveIncome() {
        stopPassiveIncome();
        hero.passiveIncome = Math.ceil(hero.facilityLevel / 2);
        hero.passiveIncomeIntervalId = setInterval(function () {
            hero.currency += hero.passiveIncome;
            updateCurrencyDisplay();
        }, 1000);
    }

    function stopPassiveIncome() {
        if (hero.passiveIncomeIntervalId) {
            clearInterval(hero.passiveIncomeIntervalId);
            hero.passiveIncomeIntervalId = null;
        }
    }

    function getUpgradeCost() {
        return hero.facilityLevel * 20;
    }

    function getHeroLevelUpCost() {
        return hero.level * 10;
    }

    // Initialize the game interface
    toggleGameplayElements('none');
    updateFacilityLevel();
    updateCurrencyDisplay();
    updateHeroLevel();
});

async function generateHero() {
    const wordOne = document.getElementById('word-one').value.trim();
    const wordTwo = document.getElementById('word-two').value.trim();
    const prompt = `Create an 8-bit hero based on the words ${wordOne} and ${wordTwo}. I want this to be a simple image, just include one picture of the full hero with a background, do not include any text or words, make them look powerful`;

    try {
        const response = await fetch('http://localhost:3000/generate-hero', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });
        const data = await response.json();
        const heroImage = document.getElementById('hero-image');
        const heroDisplay = document.getElementById('hero-display');
        heroImage.src = data.imageUrl;
        heroDisplay.src = data.imageUrl;
        heroImage.style.display = 'block';
    } catch (error) {
        console.error('Error generating hero:', error);
    }
}

async function generateBackstory() {
    const wordOne = document.getElementById('word-one').value.trim();
    const wordTwo = document.getElementById('word-two').value.trim();
    const prompt = `Create a superhero origin backstory, this superhero is based on the words ${wordOne} and ${wordTwo}. Keep it under 200 words`;

    try {
        const response = await fetch('http://localhost:3000/generate-backstory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });
        const data = await response.json();
        const heroBackstory = document.getElementById('hero-backstory');
        heroBackstory.innerText = data.backstory;
    } catch (error) {
        console.error('Error generating hero:', error);
    }
}

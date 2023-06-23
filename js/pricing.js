document.addEventListener( 'DOMContentLoaded', function () {
	fetchPlans();
} );

/* Default to monthly pricing */
let selectedTab = 'monthly';

async function fetchPlans() {
	try {
		const response = await fetch('plans.json');
		const plans = await response.json();
		generatePricingTable(plans);

		/* Initially toggle the tab based on selectedTab variable */
		toggleTab();

		/* Add event listeners to the tabs */
		addTabEventListeners();
	} catch (error) {
		console.error('Error fetching plans:', error);
	}
}

function generatePricingTable(plans) {
	const pricingTable = document.getElementById('pricingTable');

	/* Clear existing pricing table */
	pricingTable.innerHTML = '';

	plans.forEach( plan => {
		const pricingCard = document.createElement('div');
		pricingCard.className = 'pricingCard mb-lg';

		const title = document.createElement('div');
		title.className = 'title';
		title.textContent = plan.name;

		const price = document.createElement('div');
		price.className = 'price';
		price.textContent = getPriceText(plan.price);

		let duration = '';
		if (typeof plan.price === 'object') {
			duration = document.createElement('div');
			duration.className = 'duration';
			duration.textContent = selectedTab === 'monthly' ? 'per month' : 'per year';
			pricingCard.appendChild(duration);
		}

		const featuresList = document.createElement('ul');
		featuresList.className = 'features';
		plan.features.forEach( feature => {
			const featureItem = document.createElement('li');
			const featureText = document.createElement('span');
			featureText.textContent = feature;
			featureItem.appendChild(featureText);

			if (plan.extraCosts && feature in plan.extraCosts) {
				const extraCost = document.createElement('span');
				extraCost.textContent = plan.extraCosts[feature];
				extraCost.className = 'extraCost';
				featureItem.appendChild(extraCost);
			}

			featuresList.appendChild(featureItem);
		} );

		const infoText = document.createElement('div');
		infoText.className = 'infoText';
		infoText.textContent = plan.info;

		pricingCard.appendChild(title);
		pricingCard.appendChild(price);

		if (duration) {
			pricingCard.appendChild(duration);
		}

		pricingCard.appendChild(featuresList);
		pricingCard.appendChild(infoText);

		pricingTable.appendChild(pricingCard);
	} );
}

function toggleTab() {
	const monthlyTab = document.getElementById('monthlyTab');
	const yearlyTab = document.getElementById('yearlyTab');

	if (selectedTab === 'monthly') {
		monthlyTab.classList.add('active');
		yearlyTab.classList.remove('active');
	} else {
		monthlyTab.classList.remove('active');
		yearlyTab.classList.add('active');
	}
}

function addTabEventListeners() {
	const monthlyTab = document.getElementById('monthlyTab');
	const yearlyTab = document.getElementById('yearlyTab');

	monthlyTab.addEventListener( 'click', function () {
		selectedTab = 'monthly';
		toggleTab();
		updatePrices();
	} );

	yearlyTab.addEventListener( 'click', function () {
		selectedTab = 'yearly';
		toggleTab();
		updatePrices();
	} );
}

function updatePrices() {
	const pricingCards = document.querySelectorAll('.pricingCard');
	pricingCards.forEach( card => {
		const priceElement = card.querySelector('.price');
		const durationElement = card.querySelector('.duration');
		const planIndex = Array.from(pricingCards).indexOf(card);

		if (planIndex >= 0) {
			const plan = plans[planIndex];
			priceElement.textContent = getPriceText(plan.price);

			if (typeof plan.price === 'object' && durationElement) {
				durationElement.textContent = selectedTab === 'monthly' ? 'per month' : 'per year';
			}
		}
	} );
}

function getPriceText(price) {
	if (typeof price === 'object') {
		return selectedTab === 'monthly' ? `Starting at $${price.monthly}` : `Starting at $${price.yearly}`;
	} else {
		return price;
	}
}

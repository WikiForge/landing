document.addEventListener( 'DOMContentLoaded', function () {
	fetchPlans();
} );

async function fetchPlans() {
	try {
		const response = await fetch('plans.json');
		const plans = await response.json();
		generatePricingTable(plans);
	} catch (error) {
		console.error('Error fetching plans:', error);
	}
}

function generatePricingTable(plans) {
	const pricingTable = document.getElementById('pricingTable');

	plans.forEach( plan => {
		const pricingCard = document.createElement('div');
		pricingCard.className = 'pricingCard mb-lg';

		const title = document.createElement('div');
		title.className = 'title';
		title.textContent = plan.name;

		const price = document.createElement('div');
		price.className = 'price';
		if (Number.isInteger(plan.price) || Number(plan.price) === parseFloat(plan.price)) {
			price.textContent = `$${plan.price}`;
		} else {
			price.textContent = plan.price;
		}

		const duration = document.createElement('div');
		duration.className = 'duration';
		duration.textContent = `per ${plan.duration}`;

		const featuresList = document.createElement('ul');
		featuresList.className = 'features';
		plan.features.forEach( feature => {
			const featureItem = document.createElement('li');
			featureItem.textContent = feature;
			featuresList.appendChild(featureItem);
		} );

		const infoText = document.createElement('div');
		infoText.className = 'infoText';
		infoText.textContent = plan.info;

		pricingCard.appendChild(title);
		pricingCard.appendChild(price);
		pricingCard.appendChild(duration);
		pricingCard.appendChild(featuresList);
		pricingCard.appendChild(infoText);

		pricingTable.appendChild(pricingCard);
    } );
}

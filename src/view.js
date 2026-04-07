function initBeforeAfter() {
	// 1. Pagination
	const wrappers = document.querySelectorAll('.ss-before-after-wrapper');
	
	wrappers.forEach(wrapper => {
		const items = Array.from(wrapper.querySelectorAll('.ss-before-after-item'));
		const paginationContainer = wrapper.querySelector('.ss-ba-pagination');
		const itemsPerPage = 6;
		let currentPage = 1;

		if (!items.length) return;

		const renderPage = (page) => {
			items.forEach((item, index) => {
				if (index >= (page - 1) * itemsPerPage && index < page * itemsPerPage) {
					item.style.display = 'block';
				} else {
					item.style.display = 'none';
				}
			});
			
			if (paginationContainer) {
				const dots = paginationContainer.querySelectorAll('.ss-ba-page-dot');
				dots.forEach((dot, index) => {
					if (index === page - 1) dot.classList.add('active');
					else dot.classList.remove('active');
				});
			}
		};

		if (items.length > itemsPerPage && paginationContainer) {
			const totalPages = Math.ceil(items.length / itemsPerPage);
			paginationContainer.innerHTML = ''; // clear
			for (let i = 1; i <= totalPages; i++) {
				const dot = document.createElement('div');
				dot.className = 'ss-ba-page-dot' + (i === 1 ? ' active' : '');
				dot.addEventListener('click', () => {
					currentPage = i;
					renderPage(currentPage);
					
					// Scroll to wrapper top if needed:
					// wrapper.scrollIntoView({behavior: 'smooth', block: 'start'});
				});
				paginationContainer.appendChild(dot);
			}
		}
		renderPage(1);
	});

	// 2. Before-After Slider
	const sliders = document.querySelectorAll('.ss-ba-slider');
	sliders.forEach(slider => {
		let isDown = false;
		const handle = slider.querySelector('.ss-ba-handle');
		const beforeLayer = slider.querySelector('.ss-ba-before');
		if (!handle || !beforeLayer) return;

		let startX = 0;
		let diff = 0;

		const updateSlider = (percent) => {
			percent = Math.max(0, Math.min(100, percent));
			handle.style.left = `${percent}%`;
			beforeLayer.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
			beforeLayer.style.webkitClipPath = `inset(0 ${100 - percent}% 0 0)`;
		};

		const onMove = (e) => {
			if (!isDown) return;
			
			const rect = slider.getBoundingClientRect();
			const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
			let x = clientX - rect.left;
			x = Math.max(0, Math.min(rect.width, x));
			let percent = (x / rect.width) * 100;
			updateSlider(percent);

			const centerX = rect.width / 2;
			if (x > centerX + 5) {
				slider.classList.add('no-blur'); // Remove blur only when moved right from center + 5px
			} else {
				slider.classList.remove('no-blur'); // Keep blur in all positions from 0 to center + 5px
			}
		};

		const onUp = () => {
			isDown = false;
		};

		const onDown = (e) => {
			isDown = true;
			slider.classList.add('is-active');
			const rect = slider.getBoundingClientRect();
			const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
			startX = clientX;
			diff = 0;
			onMove(e); // Move immediately
		};

		slider.addEventListener('mousedown', onDown);
		slider.addEventListener('touchstart', onDown, { passive: true });

		window.addEventListener('mousemove', onMove);
		window.addEventListener('touchmove', onMove, { passive: true }); // Keep passive: true for vertical scrolling on mobile

		window.addEventListener('mouseup', onUp);
		window.addEventListener('touchend', onUp);
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initBeforeAfter);
} else {
	initBeforeAfter();
}

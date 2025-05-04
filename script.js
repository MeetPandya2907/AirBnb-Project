document.addEventListener('DOMContentLoaded', function() {
  // Variable to track login state - initially not logged in
  let isLoggedIn = false;
  
  // Get login modal elements
  const loginModal = document.getElementById('loginModal');
  const closeBtn = document.querySelector('.login-close');
  const continueBtn = document.querySelector('.continue-btn');
  const socialBtns = document.querySelectorAll('.social-btn');
  
  // Get dropdown menu elements
  const userMenu = document.querySelector('.user-menu');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const loginTriggers = document.querySelectorAll('.login-trigger');

  // Mobile responsiveness enhancements
  const headerContainer = document.querySelector('.header-container');
  const scrollThreshold = 50;
  
  // Create scrolled search element for mobile
  if (window.innerWidth <= 767 && headerContainer) {
    const scrolledSearch = document.createElement('div');
    scrolledSearch.className = 'scrolled-search';
    scrolledSearch.style.display = 'none';
    
    scrolledSearch.innerHTML = `
      <div class="scrolled-search-icon">
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="display:block;fill:none;height:16px;width:16px;stroke:currentColor;stroke-width:3;overflow:visible">
          <circle cx="14" cy="14" r="9"></circle>
          <path d="M20 20L25 25"></path>
        </svg>
      </div>
      <div>Where to?</div>
    `;
    
    const userNav = document.querySelector('.user-nav');
    if (userNav) {
      userNav.insertBefore(scrolledSearch, userNav.firstChild);
      
      scrolledSearch.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
      });
    }
  }
  
  // Handle scroll for mobile header
  function handleScroll() {
    if (window.innerWidth <= 767 && headerContainer) {
      if (window.scrollY > scrollThreshold) {
        headerContainer.classList.add('scrolled');
        document.body.classList.add('fixed-header');
        
        const scrolledSearch = document.querySelector('.scrolled-search');
        if (scrolledSearch) {
          scrolledSearch.style.display = 'flex';
        }
      } else {
        headerContainer.classList.remove('scrolled');
        document.body.classList.remove('fixed-header');
        
        const scrolledSearch = document.querySelector('.scrolled-search');
        if (scrolledSearch) {
          scrolledSearch.style.display = 'none';
        }
      }
    }
  }
  
  // Optimize property image galleries for mobile
  function setupMobileGalleries() {
    if (window.innerWidth <= 767) {
      const propertyImgContainers = document.querySelectorAll('.property-img-container');
      
      propertyImgContainers.forEach(container => {
        // Create mobile gallery navigation dots
        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-gallery-nav';
        
        // Create 5 dots (typical number of images per property)
        for (let i = 0; i < 5; i++) {
          const dot = document.createElement('div');
          dot.className = i === 0 ? 'mobile-gallery-dot active' : 'mobile-gallery-dot';
          mobileNav.appendChild(dot);
        }
        
        container.appendChild(mobileNav);
        
        // Add touch swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;
        
        container.addEventListener('touchstart', e => {
          touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        container.addEventListener('touchend', e => {
          touchEndX = e.changedTouches[0].screenX;
          handleSwipe(container);
        }, {passive: true});
        
        function handleSwipe(container) {
          const threshold = 50;
          const img = container.querySelector('img');
          const dots = container.querySelectorAll('.mobile-gallery-dot');
          let currentIndex = [...dots].findIndex(dot => dot.classList.contains('active'));
          
          if (touchEndX < touchStartX - threshold) {
            // Swipe left, show next image
            const nextArrow = container.querySelector('.next-arrow');
            if (nextArrow) {
              nextArrow.click();
              updateDots(dots, currentIndex + 1 >= dots.length ? 0 : currentIndex + 1);
            }
          } else if (touchEndX > touchStartX + threshold) {
            // Swipe right, show previous image
            const prevArrow = container.querySelector('.prev-arrow');
            if (prevArrow) {
              prevArrow.click();
              updateDots(dots, currentIndex - 1 < 0 ? dots.length - 1 : currentIndex - 1);
            }
          }
        }
        
        function updateDots(dots, newIndex) {
          dots.forEach((dot, index) => {
            if (index === newIndex) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
        }
        
        // Update dots when clicking arrows
        const arrows = container.querySelectorAll('.arrow');
        arrows.forEach(arrow => {
          arrow.addEventListener('click', () => {
            setTimeout(() => {
              const img = container.querySelector('img');
              const dots = container.querySelectorAll('.mobile-gallery-dot');
              let currentDotIndex = parseInt(img.dataset.index || 0);
              updateDots(dots, currentDotIndex);
            }, 50);
          });
        });
      });
    }
  }
  
  // Fix for mobile viewport issues (100vh)
  function setMobileViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // Handle mobile booking bar interactions
  function setupMobileBookingBar() {
    const mobileBookingBar = document.querySelector('.mobile-booking-bar');
    const mobileReserveBtn = document.querySelector('.mobile-reserve-btn');
    
    if (mobileBookingBar && mobileReserveBtn) {
      mobileReserveBtn.addEventListener('click', () => {
        alert('Reservation process would start here');
      });
    }
  }
  
  // Call mobile enhancement functions
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', function() {
    handleScroll();
    setMobileViewportHeight();
  });
  
  // Initialize mobile enhancements
  setupMobileGalleries();
  setMobileViewportHeight();
  setupMobileBookingBar();

  // Make categories interactive
  const categories = document.querySelectorAll('.category');
  const propertiesContainers = document.querySelectorAll('.properties');

  // Category properties with each property having a unique name
  const categoryProperties = {
    'Farms': [
      { id: 1, image: 'img1.jpg', location: 'Farm Estate, Maharashtra', description: 'Scenic farmhouse with open fields', price: '₹75,500', rating: '4.91', dates: '16-21 Jun' },
      { id: 2, image: 'img2.jpg', location: 'Organic Farm, Punjab', description: 'Working farm with traditional stay', price: '₹62,800', rating: '4.87', dates: '3-8 Jul' },
      { id: 3, image: 'img3.avif', location: 'Green Valley, Himachal', description: 'Mountain farm with apple orchards', price: '₹89,200', rating: '4.95', dates: '12-17 Aug' },
      { id: 4, image: 'img4.avif', location: 'Rural Retreat, Karnataka', description: 'Coffee plantation with guest house', price: '₹95,500', rating: '4.89', dates: '5-10 Sep' },
      { id: 5, image: 'img5.avif', location: 'Lavender Farm, Ooty', description: 'Aromatic lavender fields and cottage', price: '₹82,300', rating: '4.92', dates: '7-12 Jun' },
      { id: 6, image: 'img6.jpg', location: 'Rice Fields, Kerala', description: 'Traditional house amid paddy fields', price: '₹68,750', rating: '4.88', dates: '14-19 Jul' },
      { id: 7, image: 'img7.avif', location: 'Tea Gardens, Darjeeling', description: 'Colonial cottage in tea plantation', price: '₹91,200', rating: '4.93', dates: '21-26 Aug' },
      { id: 8, image: 'img8.avif', location: 'Spice Farm, Goa', description: 'Aromatic spice garden with villa', price: '₹84,800', rating: '4.86', dates: '9-14 Sep' },
      { id: 9, image: 'img9.jpg', location: 'Fruit Orchard, Maharashtra', description: 'Mango and cashew plantation home', price: '₹72,600', rating: '4.89', dates: '18-23 Jun' },
      { id: 10, image: 'img10.jpg', location: 'Dairy Farm, Gujarat', description: 'Working dairy with luxury accommodation', price: '₹79,300', rating: '4.91', dates: '11-16 Jul' },
      { id: 11, image: 'img11.jpg', location: 'Vegetable Farm, Himachal', description: 'Organic vegetables and herb garden', price: '₹65,900', rating: '4.87', dates: '25-30 Aug' },
      { id: 12, image: 'img12.jpg', location: 'Horse Ranch, Rajasthan', description: 'Marwari horses and desert views', price: '₹96,400', rating: '4.94', dates: '13-18 Sep' },
      { id: 13, image: 'img13.jpg', location: 'Sunflower Fields, Karnataka', description: 'Cottage surrounded by sunflowers', price: '₹78,200', rating: '4.90', dates: '2-7 Jun' },
      { id: 14, image: 'img14.jpg', location: 'Honey Farm, Uttarakhand', description: 'Beekeeping experience and mountain views', price: '₹83,500', rating: '4.89', dates: '19-24 Jul' },
      { id: 15, image: 'img15.jpg', location: 'Wheat Fields, Punjab', description: 'Traditional farmhouse with golden fields', price: '₹70,800', rating: '4.85', dates: '28-3 Aug' },
      { id: 16, image: 'img16.jpg', location: 'Tulip Gardens, Kashmir', description: 'Seasonal tulip views with cottage', price: '₹98,700', rating: '4.96', dates: '10-15 Apr' },
      { id: 17, image: 'img17.jpg', location: 'Almond Farm, Kashmir', description: 'Cottage amid blooming almond trees', price: '₹92,300', rating: '4.92', dates: '8-13 May' },
      { id: 18, image: 'img1.avif', location: 'Coffee Estate, Coorg', description: 'Working coffee plantation with homestay', price: '₹86,400', rating: '4.93', dates: '17-22 Jun' },
      { id: 19, image: 'img2.avif', location: 'Saffron Fields, Kashmir', description: 'Rare saffron farm experience', price: '₹1,05,800', rating: '4.95', dates: '20-25 Oct' },
      { id: 20, image: 'img3.avif', location: 'Vineyard, Nashik', description: 'Wine estate with luxury cottage', price: '₹97,600', rating: '4.91', dates: '22-27 Nov' },
      { id: 21, image: 'img4.avif', location: 'Mustard Fields, Rajasthan', description: 'Vibrant yellow fields with farmhouse', price: '₹73,200', rating: '4.87', dates: '15-20 Jan' },
      { id: 22, image: 'img5.avif', location: 'Bamboo Farm, Assam', description: 'Bamboo cottage in sustainable farm', price: '₹67,900', rating: '4.86', dates: '3-8 Aug' },
      { id: 23, image: 'img6.avif', location: 'Coconut Plantation, Kerala', description: 'Traditional home amid coconut trees', price: '₹81,300', rating: '4.88', dates: '12-17 Sep' },
      { id: 24, image: 'img7.avif', location: 'Silk Farm, Karnataka', description: 'Mulberry plantation with silk production', price: '₹79,800', rating: '4.85', dates: '25-30 Jul' },
      { id: 25, image: 'img8.avif', location: 'Flower Farm, Ooty', description: 'Colorful flower fields with cottage', price: '₹84,500', rating: '4.92', dates: '9-14 Jun' }
    ],
    'Icons': [
      { id: 26, image: 'img9.jpg', location: 'Taj View, Agra', description: 'Historic home with monument view', price: '₹1,24,500', rating: '4.98', dates: '10-15 Jun' },
      { id: 27, image: 'img10.jpg', location: 'Gateway Apartment, Mumbai', description: 'Luxury stay near Gateway of India', price: '₹1,56,800', rating: '4.92', dates: '22-27 Jul' },
      { id: 28, image: 'img11.jpg', location: 'Victoria Villa, Kolkata', description: 'Colonial home with historic charm', price: '₹98,200', rating: '4.85', dates: '8-13 Aug' },
      { id: 29, image: 'img12.jpg', location: 'Qutub View, Delhi', description: 'Modern apartment with monument views', price: '₹1,12,500', rating: '4.89', dates: '15-20 Sep' },
      { id: 30, image: 'img13.jpg', location: 'Mysore Palace Stay', description: 'Heritage home near royal palace', price: '₹1,08,700', rating: '4.91', dates: '5-10 Oct' }
    ],
    'Amazing Pools': [
      { id: 31, image: 'img12.jpg', location: 'Infinity Edge, Goa', description: 'Beachfront home with infinity pool', price: '₹2,15,000', rating: '4.99', dates: '5-10 Jun' },
      { id: 32, image: 'img13.jpg', location: 'Hillside Retreat, Lonavala', description: 'Mountain villa with private pool', price: '₹1,78,600', rating: '4.93', dates: '15-20 Jul' },
      { id: 33, image: 'img14.jpg', location: 'Royal Resort, Udaipur', description: 'Lake view with traditional pool', price: '₹1,56,200', rating: '4.95', dates: '12-17 Aug' },
      { id: 34, image: 'img15.jpg', location: 'Modern Oasis, Bangalore', description: 'Contemporary home with lap pool', price: '₹1,32,500', rating: '4.88', dates: '7-12 Sep' },
      { id: 35, image: 'img16.jpg', location: 'Beach Villa, Kovalam', description: 'Seaside home with sunset pool', price: '₹1,95,300', rating: '4.94', dates: '20-25 Oct' }
    ],
    'Design': [
      { id: 36, image: 'img16.jpg', location: 'Architect\'s Loft, Mumbai', description: 'Award-winning architectural design', price: '₹1,52,800', rating: '4.96', dates: '15-20 Jun' },
      { id: 37, image: 'img17.jpg', location: 'Modern Studio, Delhi', description: 'Contemporary minimal design space', price: '₹88,600', rating: '4.90', dates: '9-14 Jul' },
      { id: 38, image: 'img1.jpg', location: 'Designer Villa, Goa', description: 'Boutique villa with artistic touches', price: '₹1,79,200', rating: '4.94', dates: '20-25 Aug' },
      { id: 39, image: 'img2.jpg', location: 'Glass House, Lonavala', description: 'Transparent design with panoramic views', price: '₹2,05,400', rating: '4.97', dates: '12-17 Sep' },
      { id: 40, image: 'img3.avif', location: 'Industrial Loft, Bangalore', description: 'Converted warehouse with modern design', price: '₹1,25,600', rating: '4.92', dates: '5-10 Oct' }
    ],
    'Earth homes': [
      { id: 41, image: 'img2.jpg', location: 'Mud House, Rajasthan', description: 'Traditional earth house experience', price: '₹45,500', rating: '4.87', dates: '2-7 Jun' },
      { id: 42, image: 'img3.avif', location: 'Eco Dome, Himachal', description: 'Sustainable earth dome with views', price: '₹72,800', rating: '4.85', dates: '11-16 Jul' },
      { id: 43, image: 'img4.avif', location: 'Cave Stay, Madhya Pradesh', description: 'Modern cave-style earth home', price: '₹66,200', rating: '4.83', dates: '23-28 Aug' },
      { id: 44, image: 'img5.avif', location: 'Earthship, Uttarakhand', description: 'Self-sufficient home with natural materials', price: '₹58,700', rating: '4.82', dates: '14-19 Sep' },
      { id: 45, image: 'img6.jpg', location: 'Cob House, Kerala', description: 'Handcrafted cob house in natural setting', price: '₹63,400', rating: '4.86', dates: '8-13 Oct' }
    ],
    'National Parks': [
      { id: 46, image: 'img5.avif', location: 'Ranthambore Edge, Rajasthan', description: 'Safari villa near tiger reserve', price: '₹1,35,500', rating: '4.92', dates: '6-11 Jun' },
      { id: 47, image: 'img6.jpg', location: 'Jim Corbett View, Uttarakhand', description: 'Forest cabin with wildlife views', price: '₹95,800', rating: '4.89', dates: '18-23 Jul' },
      { id: 48, image: 'img7.avif', location: 'Kanha Retreat, MP', description: 'Jungle lodge with private tours', price: '₹1,12,200', rating: '4.91', dates: '15-20 Aug' },
      { id: 49, image: 'img8.avif', location: 'Bandipur Cottage, Karnataka', description: 'Wildlife cottage with guided walks', price: '₹86,500', rating: '4.88', dates: '9-14 Sep' },
      { id: 50, image: 'img9.jpg', location: 'Periyar Hideaway, Kerala', description: 'Secluded stay near elephant sanctuary', price: '₹1,05,200', rating: '4.93', dates: '22-27 Oct' }
    ],
    'Amazing Views': [
      { id: 51, image: 'img9.jpg', location: 'Himalayan Lookout, Uttarakhand', description: 'Mountain cabin with panoramic views', price: '₹92,500', rating: '4.94', dates: '12-17 Jun' },
      { id: 52, image: 'img10.jpg', location: 'Coastal Villa, Kerala', description: 'Beachfront home with sea views', price: '₹1,48,800', rating: '4.96', dates: '5-10 Jul' },
      { id: 53, image: 'img11.jpg', location: 'Valley House, Kasol', description: 'River valley views from every room', price: '₹86,200', rating: '4.90', dates: '18-23 Aug' },
      { id: 54, image: 'img12.jpg', location: 'Sky Penthouse, Mumbai', description: 'High-rise apartment with city skyline', price: '₹2,35,600', rating: '4.95', dates: '8-13 Sep' },
      { id: 55, image: 'img13.jpg', location: 'Tea Estate View, Munnar', description: 'Cottage overlooking tea plantations', price: '₹78,900', rating: '4.89', dates: '20-25 Oct' }
    ],
    'OMG!': [
      { id: 56, image: 'img14.jpg', location: 'Treehouse Retreat, Coorg', description: 'Luxury treehouse in coffee estate', price: '₹1,25,800', rating: '4.97', dates: '5-10 Jun' },
      { id: 57, image: 'img15.jpg', location: 'Houseboat, Alleppey', description: 'Floating luxury in Kerala backwaters', price: '₹85,400', rating: '4.93', dates: '15-20 Jul' },
      { id: 58, image: 'img16.jpg', location: 'Desert Camp, Jaisalmer', description: 'Luxury tents in Thar desert', price: '₹92,600', rating: '4.89', dates: '12-17 Aug' },
      { id: 59, image: 'img17.jpg', location: 'Lighthouse Stay, Goa', description: 'Converted lighthouse with ocean views', price: '₹1,78,200', rating: '4.98', dates: '7-12 Sep' },
      { id: 60, image: 'img1.avif', location: 'Palace Suite, Jaipur', description: 'Stay in authentic royal heritage', price: '₹2,45,500', rating: '4.96', dates: '20-25 Oct' }
    ],
    'Beachfront': [
      { id: 61, image: 'img2.avif', location: 'Sunset Beach Home, Goa', description: 'Direct beach access with sunset views', price: '₹1,65,800', rating: '4.95', dates: '2-7 Jun' },
      { id: 62, image: 'img3.avif', location: 'Ocean Villa, Kovalam', description: 'Luxury villa steps from the ocean', price: '₹1,92,300', rating: '4.94', dates: '11-16 Jul' },
      { id: 63, image: 'img4.avif', location: 'Sandy Shores, Alibaug', description: 'Beachfront bungalow with private path', price: '₹1,48,700', rating: '4.91', dates: '23-28 Aug' },
      { id: 64, image: 'img5.avif', location: 'Bay View, Pondicherry', description: 'Colonial style home on seafront', price: '₹1,35,600', rating: '4.90', dates: '14-19 Sep' },
      { id: 65, image: 'img6.avif', location: 'Marina Lodge, Chennai', description: 'Modern home with beach promenade view', price: '₹1,25,400', rating: '4.87', dates: '8-13 Oct' }
    ]
  };

  // Default properties for other categories not specifically defined
  const defaultProperties = [
    { id: 101, image: 'img12.jpg', location: 'Beachside Bungalow, Goa', description: 'Private beach access and views', price: '₹1,25,500', rating: '4.93', dates: '20-25 Jun' },
    { id: 102, image: 'img13.jpg', location: 'Mountain Cabin, Shimla', description: 'Cozy retreat with forest views', price: '₹78,800', rating: '4.87', dates: '8-13 Jul' },
    { id: 103, image: 'img14.jpg', location: 'City Loft, Mumbai', description: 'Modern apartment in central location', price: '₹1,12,200', rating: '4.89', dates: '25-30 Aug' },
    { id: 104, image: 'img15.jpg', location: 'Heritage Home, Jaipur', description: 'Traditional haveli with courtyard', price: '₹96,500', rating: '4.91', dates: '14-19 Sep' },
    { id: 105, image: 'img16.jpg', location: 'Lake View Villa, Udaipur', description: 'Luxury home on lake shore', price: '₹1,68,200', rating: '4.95', dates: '2-7 Oct' }
  ];

  // Create HTML for a property
  function createPropertyHTML(property) {
    return `
      <a href="property.html?id=${property.id}" class="property-link" style="text-decoration: none;">
        <div class="property">
          <div class="property-img-container">
            ${Math.random() > 0.6 ? '<div class="guest-favorite"><span class="guest-favorite-icon">★</span> Guest favorite</div>' : ''}
            <img src="${property.image}" alt="Property">
            <div class="property-favorite">♡</div>
            <div class="image-arrows">
              <div class="arrow prev-arrow">❮</div>
              <div class="arrow next-arrow">❯</div>
            </div>
            <div class="image-nav">
              <div class="image-dot active"></div>
              <div class="image-dot"></div>
              <div class="image-dot"></div>
              <div class="image-dot"></div>
              <div class="image-dot"></div>
            </div>
          </div>
          <div class="property-details">
            <div class="property-info">
              <h3>${property.location}</h3>
              <p>${property.description}</p>
              <p>${property.dates}</p>
              <p class="property-price"><span>${property.price}</span> <span class="price-for-nights">for 5 nights</span></p>
            </div>
            <div class="property-rating">
              ★ ${property.rating}
            </div>
          </div>
        </div>
      </a>
    `;
  }

  // Update properties based on selected category
  function updateProperties(categoryName) {
    // Get properties for the category or use default
    const properties = categoryProperties[categoryName] || defaultProperties;
    
    // Determine how many properties to show
    let numProperties = Math.max(3, Math.min(8, properties.length));
    
    // Show more properties for the Farms category
    if (categoryName === 'Farms') {
      numProperties = Math.min(20, properties.length); // Show up to 20 farm properties
    }
    
    // Get the containers and clear them
    propertiesContainers.forEach(container => {
      container.innerHTML = '';
    });
    
    // Fill the containers with properties
    const firstContainer = propertiesContainers[0];
    let propertyHTML = '';
    
    for (let i = 0; i < numProperties; i++) {
      propertyHTML += createPropertyHTML(properties[i % properties.length]);
    }
    
    firstContainer.innerHTML = propertyHTML;
    
    // Setup property interactions after updating DOM
    initializePropertyInteractions();
  }

  // Initialize property image carousel, heart button, etc.
  function initializePropertyInteractions() {
    const properties = document.querySelectorAll('.property');
    
    properties.forEach((property, propertyIndex) => {
      const imgContainer = property.querySelector('.property-img-container');
      const img = imgContainer.querySelector('img');
      const dots = imgContainer.querySelectorAll('.image-dot');
      const prevBtn = imgContainer.querySelector('.prev-arrow');
      const nextBtn = imgContainer.querySelector('.next-arrow');
      const heart = imgContainer.querySelector('.property-favorite');
      
      // Get initial image path
      const originalSrc = img.src;
      let currentIndex = 0;
      
      // Create array of images based on file path pattern
      let images = [];
      
      if (originalSrc.includes("/")) {
        // For local files (img1.jpg, img2.jpg, etc.)
        const fileName = originalSrc.split("/").pop(); // Get file name
        const baseNum = fileName.match(/\d+/)[0]; // Extract number from filename
        const extension = fileName.split('.').pop(); // Get extension
        
        // Available image numbers
        const availableImgNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        // Starting point based on property index to ensure variety
        const startIndex = (propertyIndex * 3) % availableImgNumbers.length;
        
        // Create image paths for each dot - ensure each dot has a unique image
        for (let i = 0; i < dots.length; i++) {
          // Calculate a unique index for each dot
          const imgIndex = (startIndex + i) % availableImgNumbers.length;
          const imgNum = availableImgNumbers[imgIndex];
          
          // Use the same extension as the original image
          if (i === 0) {
            // First dot always shows the original image
            images.push(originalSrc);
          } else {
            // Try to use the same extension as the original, but fall back to both formats
            // This ensures we don't have missing images
            if (extension === 'jpg') {
              // If original is jpg, try to use the same img number but in avif if available
              if (i % 2 === 0) {
                images.push(`img${imgNum}.${extension}`);
              } else {
                images.push(`img${imgNum}.avif`);
              }
            } else {
              // If original is avif, try to use the same img number but in jpg if available
              if (i % 2 === 0) {
                images.push(`img${imgNum}.${extension}`);
              } else {
                images.push(`img${imgNum}.jpg`);
              }
            }
          }
        }
      } else {
        // For remote URL images, use the variation approach
        images = [
          originalSrc,
          originalSrc.replace(/\?.*$/, '?im_w=720&variation=1'),
          originalSrc.replace(/\?.*$/, '?im_w=720&variation=2'),
          originalSrc.replace(/\?.*$/, '?im_w=720&variation=3'),
          originalSrc.replace(/\?.*$/, '?im_w=720&variation=4')
        ];
      }
      
      // Ensure we have the right number of images for the dots
      while (images.length < dots.length) {
        // If we don't have enough images, duplicate the last one
        images.push(images[images.length - 1]);
      }
      
      // Update active dot
      function updateDots() {
        dots.forEach((dot, index) => {
          if (index === currentIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
      
      // Handle previous button click
      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent default link behavior
          e.stopPropagation(); // Stop event from bubbling up
          currentIndex = (currentIndex - 1 + dots.length) % dots.length;
          img.src = images[currentIndex];
          updateDots();
        });
      }
      
      // Handle next button click
      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent default link behavior
          e.stopPropagation(); // Stop event from bubbling up
          currentIndex = (currentIndex + 1) % dots.length;
          img.src = images[currentIndex];
          updateDots();
        });
      }
      
      // Make dots clickable
      dots.forEach((dot, index) => {
        if (index < images.length) {
          dot.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            e.stopPropagation(); // Stop event from bubbling up
            currentIndex = index;
            img.src = images[currentIndex];
            updateDots();
          });
        }
      });
      
      // Handle heart favorite button
      if (heart) {
        heart.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent default link behavior
          e.stopPropagation(); // Stop event from bubbling up
          
          // If user is logged in, toggle heart normally
          if (isLoggedIn) {
            toggleHeartState(heart);
          } else {
            // If not logged in, store the clicked heart and show login modal
            currentClickedHeart = heart;
            showLoginModal();
          }
        });
      }
    });
  }

  // Set up category click handlers
  categories.forEach(category => {
    category.addEventListener('click', () => {
      // Remove active class from all categories
      categories.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked category
      category.classList.add('active');
      
      // Get category name and update properties
      const categoryName = category.querySelector('.category-name').textContent;
      updateProperties(categoryName);
    });
  });

  // Initialize with the default active category
  window.addEventListener('load', function() {
    const activeCategory = document.querySelector('.category.active');
    if (activeCategory) {
      const categoryName = activeCategory.querySelector('.category-name').textContent;
      updateProperties(categoryName);
    }
  });

  // Category navigation buttons
  const categoriesContainer = document.querySelector('.categories');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  if (categoriesContainer && prevBtn && nextBtn) {
    // Scroll distance for each button click
    const scrollDistance = 300;
    
    // Previous button click handler
    prevBtn.addEventListener('click', () => {
      categoriesContainer.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
      });
    });
    
    // Next button click handler
    nextBtn.addEventListener('click', () => {
      categoriesContainer.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
      });
    });
    
    // Show/hide buttons based on scroll position
    function updateNavButtons() {
      const isScrollStart = categoriesContainer.scrollLeft <= 10;
      const isScrollEnd = categoriesContainer.scrollLeft + categoriesContainer.offsetWidth >= categoriesContainer.scrollWidth - 10;
      
      // Show/hide previous button
      prevBtn.style.opacity = isScrollStart ? '0.5' : '1';
      prevBtn.disabled = isScrollStart;
      
      // Show/hide next button
      nextBtn.style.opacity = isScrollEnd ? '0.5' : '1';
      nextBtn.disabled = isScrollEnd;
    }
    
    // Initial button state
    updateNavButtons();
    
    // Update button state on scroll
    categoriesContainer.addEventListener('scroll', () => {
      updateNavButtons();
    });
  }
  
  // Toggle user dropdown menu
  userMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (dropdownMenu.classList.contains('show') && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('show');
    }
  });
  
  // Login triggers from dropdown menu
  loginTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      dropdownMenu.classList.remove('show');
      showLoginModal();
    });
  });
  
  // Make heart icons interactive
  const hearts = document.querySelectorAll('.property-favorite');
  
  // Store which heart was clicked
  let currentClickedHeart = null;
  
  hearts.forEach(heart => {
    heart.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // If user is logged in, toggle heart normally
      if (isLoggedIn) {
        toggleHeartState(heart);
      } else {
        // If not logged in, store the clicked heart and show login modal
        currentClickedHeart = heart;
        showLoginModal();
      }
    });
  });

  // Function to toggle heart state
  function toggleHeartState(heart) {
    if (heart.innerHTML === '♡') {
      heart.innerHTML = '♥';
      heart.style.color = '#FF385C';
      heart.classList.add('active');
    } else {
      heart.innerHTML = '♡';
      heart.style.color = '';
      heart.classList.remove('active');
    }
  }

  // Show login modal
  function showLoginModal() {
    loginModal.style.display = 'flex';
  }

  // Close the modal
  closeBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
  });

  // Close modal when clicking outside of it
  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });

  // Login with phone number - this will be handled by Firebase now
  if (continueBtn) {
    continueBtn.removeEventListener('click', completeLogin);
  }

  // Social login buttons - these will be handled by Firebase now
  socialBtns.forEach(btn => {
    btn.removeEventListener('click', completeLogin);
  });

  // Complete the login process
  function completeLogin() {
    isLoggedIn = true;
    loginModal.style.display = 'none';
    
    // If a heart was clicked, toggle its state now that user is logged in
    if (currentClickedHeart) {
      toggleHeartState(currentClickedHeart);
      currentClickedHeart = null;
    }
  }

  // Header search behavior
  const searchBar = document.querySelector('.search-bar');
  const expandedSearch = document.querySelector('.expanded-search');
  const searchContainer = document.querySelector('.search-container');
  
  // Set initial state based on scroll position
  function updateHeaderState() {
    if (window.scrollY <= 10) {
      // At the very top - show expanded search, hide search bar
      searchBar.style.display = 'none';
      expandedSearch.style.display = 'block';
      headerContainer.classList.remove('compact-header');
      searchContainer.classList.remove('compact-search');
    } else {
      // Scrolled down - hide expanded search, show search bar
      searchBar.style.display = 'flex';
      expandedSearch.style.display = 'none';
      headerContainer.classList.add('compact-header');
      searchContainer.classList.add('compact-search');
    }
  }
  
  // Initialize header state
  updateHeaderState();
  
  // Add scroll event with debounce for performance
  let isScrolling;
  window.addEventListener('scroll', function() {
    // Clear the previous timeout
    window.clearTimeout(isScrolling);
    
    // Set a timeout to update the header state after scrolling stops
    isScrolling = setTimeout(function() {
      updateHeaderState();
    }, 50);
  });
  
  // Handle search bar click - scroll to top to show expanded search
  searchContainer.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Show/hide guest selector
  const searchGuests = document.querySelector('#guests');
  const guestSelector = document.querySelector('.guest-selector');
  
  if (searchGuests && guestSelector) {
    // Initially hide guest selector
    guestSelector.style.display = 'none';
    
    searchGuests.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = guestSelector.style.display === 'block';
      guestSelector.style.display = isVisible ? 'none' : 'block';
    });
    
    // Close guest selector when clicking outside
    document.addEventListener('click', (e) => {
      if (!guestSelector.contains(e.target) && e.target !== searchGuests) {
        guestSelector.style.display = 'none';
      }
    });
  }

  // Guest counter functionality
  const guestTypes = ['adult', 'children', 'infant', 'pet'];
  
  guestTypes.forEach(type => {
    const minusBtn = document.getElementById(`${type}-minus`);
    const plusBtn = document.getElementById(`${type}-plus`);
    const countElem = document.getElementById(`${type}-count`);
    
    if (minusBtn && plusBtn && countElem) {
      let count = 0;
      
      plusBtn.addEventListener('click', () => {
        count++;
        countElem.textContent = count;
        minusBtn.disabled = count === 0;
        
        // Update the guest text in search bar
        updateGuestCount();
      });
      
      minusBtn.addEventListener('click', () => {
        if (count > 0) {
          count--;
          countElem.textContent = count;
          minusBtn.disabled = count === 0;
          
          // Update the guest text in search bar
          updateGuestCount();
        }
      });
    }
  });
  
  function updateGuestCount() {
    const adultCount = parseInt(document.getElementById('adult-count').textContent) || 0;
    const childrenCount = parseInt(document.getElementById('children-count').textContent) || 0;
    const infantCount = parseInt(document.getElementById('infant-count').textContent) || 0;
    const petCount = parseInt(document.getElementById('pet-count').textContent) || 0;
    
    const totalGuests = adultCount + childrenCount;
    let guestText = 'Add guests';
    
    if (totalGuests > 0) {
      guestText = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`;
      
      if (infantCount > 0) {
        guestText += `, ${infantCount} infant${infantCount !== 1 ? 's' : ''}`;
      }
      
      if (petCount > 0) {
        guestText += `, ${petCount} pet${petCount !== 1 ? 's' : ''}`;
      }
    }
    
    document.querySelector('#guests').textContent = guestText;
  }

  // Map and list view elements
  const toggleMapButton = document.getElementById('toggleMapButton');
  const mapContainer = document.getElementById('mapContainer');
  
  // Map mode toggle
  if (toggleMapButton) {
    toggleMapButton.addEventListener('click', function() {
      const isMapMode = mapContainer.classList.contains('active');
      
      if (isMapMode) {
        // Switch to list view
        mapContainer.classList.remove('active');
        propertiesContainers.forEach(container => {
          container.style.display = 'grid';
        });
        toggleMapButton.innerHTML = 'Show map <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style="display: block; height: 16px; width: 16px; fill: white;"><path d="M31.25 3.75a2.29 2.29 0 0 0-1.01-1.44A2.29 2.29 0 0 0 28.5 2L21 3.67l-10-2L2.5 3.56A2.29 2.29 0 0 0 .7 5.8v21.95a2.28 2.28 0 0 0 1.06 1.94A2.29 2.29 0 0 0 3.5 30L11 28.33l10 2 8.49-1.89a2.29 2.29 0 0 0 1.8-2.24V4.25a2.3 2.3 0 0 0-.06-.5zM12.5 25.98l-1.51-.3L9.5 26H9.5V4.66l1.51-.33 1.49.3v21.34zm10 1.36-1.51.33-1.49-.3V6.02l1.51.3L22.5 6h.01v21.34z"></path></svg>';
        toggleMapButton.classList.remove('list-mode');
        document.body.style.overflow = 'auto';
      } else {
        // Switch to map view
        mapContainer.classList.add('active');
        propertiesContainers.forEach(container => {
          container.style.display = 'none';
        });
        toggleMapButton.innerHTML = 'Show list <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style="display: block; height: 16px; width: 16px; fill: white;"><path d="M2 4h28v2H2V4zm0 8h28v2H2v-2zm0 8h28v2H2v-2z"></path></svg>';
        toggleMapButton.classList.add('list-mode');
        document.body.style.overflow = 'hidden';
        
        // Create map if not already initialized
        if (!mapInitialized) {
          // Try Google Maps first, fall back to static map if needed
          if (window.google && window.google.maps) {
            window.initializeGoogleMap();
          } else {
            createStaticMap();
          }
          mapInitialized = true;
        }
      }
    });
  }
  
  // Function to initialize Google Maps - will be called by Google Maps API
  window.initializeGoogleMap = function() {
    console.log('Initializing Google Maps');
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Clear any existing content
    mapElement.innerHTML = '';
    
    try {
      // Create a map centered on India
      const map = new google.maps.Map(mapElement, {
        center: { lat: 22.5726, lng: 78.9629 }, // Center of India
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      });
      
      // Define Indian destinations with accurate coordinates
      const indianDestinations = {
        "Mumbai": { lat: 19.0760, lng: 72.8777 },
        "Delhi": { lat: 28.6139, lng: 77.2090 },
        "Bangalore": { lat: 12.9716, lng: 77.5946 },
        "Chennai": { lat: 13.0827, lng: 80.2707 },
        "Kolkata": { lat: 22.5726, lng: 88.3639 },
        "Hyderabad": { lat: 17.3850, lng: 78.4867 },
        "Pune": { lat: 18.5204, lng: 73.8567 },
        "Shimla": { lat: 31.1048, lng: 77.1734 },
        "Goa": { lat: 15.2993, lng: 74.1240 },
        "Kochi": { lat: 9.9312, lng: 76.2673 },
        "Agra": { lat: 27.1767, lng: 78.0081 },
        "Jaipur": { lat: 26.9124, lng: 75.7873 },
        "Darjeeling": { lat: 27.0360, lng: 88.2627 },
        "Varanasi": { lat: 25.3176, lng: 82.9739 },
        "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
        "Ooty": { lat: 11.4102, lng: 76.6950 },
        "Kerala": { lat: 10.8505, lng: 76.2711 },
        "Udaipur": { lat: 24.5854, lng: 73.7125 },
        "Coorg": { lat: 12.4244, lng: 75.7382 },
        "Manali": { lat: 32.2432, lng: 77.1892 },
        "Lonavala": { lat: 18.7546, lng: 73.4062 },
        "Rishikesh": { lat: 30.0869, lng: 78.2676 },
        "Amritsar": { lat: 31.6340, lng: 74.8723 },
        "Mysore": { lat: 12.2958, lng: 76.6394 },
        "Pondicherry": { lat: 11.9416, lng: 79.8083 }
      };
      
      // Add property markers to the map
      const properties = document.querySelectorAll('.property');
      const markers = [];
      
      // Extract property data and add markers
      properties.forEach((property, index) => {
        const locationElement = property.querySelector('.property-info h3');
        const location = locationElement ? locationElement.textContent.trim() : '';
        
        const priceElement = property.querySelector('.property-price span:first-child');
        const price = priceElement ? priceElement.textContent.trim() : '₹10,000';
        
        const imgElement = property.querySelector('img');
        const imgSrc = imgElement ? imgElement.src : '';
        
        const descElement = property.querySelector('.property-info p:first-of-type');
        const description = descElement ? descElement.textContent.trim() : '';
        
        // Get coordinates based on the location
        let coords = null;
        for (const [key, value] of Object.entries(indianDestinations)) {
          if (location.includes(key)) {
            coords = { lat: value.lat, lng: value.lng };
            break;
          }
        }
        
        // If we couldn't find matching coordinates, use a default position
        if (!coords) {
          coords = { lat: 22.5726, lng: 78.9629 }; // Default to center of India
        }
        
        // Create an info window with property details
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="width: 200px; padding: 10px;">
              <img src="${imgSrc}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;">
              <h3 style="margin: 8px 0; font-size: 16px;">${location}</h3>
              <p style="margin: 0; font-size: 14px; color: #717171;">${description}</p>
              <div style="margin-top: 8px; font-weight: bold;">${price}</div>
            </div>
          `
        });
        
        // Create marker with price label
        const marker = new google.maps.Marker({
          position: coords,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#FF385C',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 12
          },
          label: {
            text: price.replace(/[^\d]/g, '').substring(0, 3) + 'k',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 'bold'
          },
          originalPrice: price
        });
        
        // Store the info window with the marker
        marker.infoWindow = infoWindow;
        
        // Add click event to show info window
        marker.addListener('click', () => {
          // Close any open info windows
          markers.forEach(m => m.infoWindow.close());
          
          // Open this marker's info window
          infoWindow.open(map, marker);
        });
        
        markers.push(marker);
      });
      
      // Make sure map is visible
      window.mapInitialized = true;
      console.log('Google Maps initialized successfully with', markers.length, 'markers');
      
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      // Fall back to static map on error
      createStaticMap();
    }
  };
  
  // Create a static map that doesn't require API key
  function createStaticMap() {
    console.log('Creating static map for Indian properties');
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Clear any existing content
    mapElement.innerHTML = '';
    
    // Define Indian destinations with accurate coordinates and positions
    const indianDestinations = {
      "Mumbai": { lat: 19.0760, lng: 72.8777, x: 20, y: 38 },
      "Delhi": { lat: 28.6139, lng: 77.2090, x: 45, y: 25 },
      "Bangalore": { lat: 12.9716, lng: 77.5946, x: 38, y: 60 },
      "Chennai": { lat: 13.0827, lng: 80.2707, x: 45, y: 70 },
      "Kolkata": { lat: 22.5726, lng: 88.3639, x: 65, y: 38 },
      "Hyderabad": { lat: 17.3850, lng: 78.4867, x: 40, y: 50 },
      "Pune": { lat: 18.5204, lng: 73.8567, x: 28, y: 45 },
      "Shimla": { lat: 31.1048, lng: 77.1734, x: 40, y: 15 },
      "Goa": { lat: 15.2993, lng: 74.1240, x: 20, y: 55 },
      "Kochi": { lat: 9.9312, lng: 76.2673, x: 30, y: 70 },
      "Agra": { lat: 27.1767, lng: 78.0081, x: 50, y: 30 },
      "Jaipur": { lat: 26.9124, lng: 75.7873, x: 30, y: 30 },
      "Darjeeling": { lat: 27.0360, lng: 88.2627, x: 70, y: 25 },
      "Varanasi": { lat: 25.3176, lng: 82.9739, x: 55, y: 35 },
      "Ahmedabad": { lat: 23.0225, lng: 72.5714, x: 25, y: 35 },
      "Ooty": { lat: 11.4102, lng: 76.6950, x: 35, y: 65 },
      "Kerala": { lat: 10.8505, lng: 76.2711, x: 30, y: 75 },
      "Udaipur": { lat: 24.5854, lng: 73.7125, x: 22, y: 30 },
      "Coorg": { lat: 12.4244, lng: 75.7382, x: 25, y: 60 },
      "Manali": { lat: 32.2432, lng: 77.1892, x: 45, y: 15 }
    };
    
    // Set background style
    mapElement.style.position = 'relative';
    mapElement.style.backgroundColor = '#F5F7F8';
    mapElement.style.backgroundImage = 'url("data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1000 1000\'%3E%3Crect width=\'1000\' height=\'1000\' fill=\'%23F5F7F8\'/%3E%3Cpath d=\'M330,180 C375,150 410,165 425,180 C440,195 465,190 475,205 C485,220 520,215 535,230 C550,245 565,235 575,250 C585,265 615,270 625,285 C635,300 660,295 670,310 C680,325 700,320 710,335 C720,350 740,355 740,370 C740,385 750,400 740,410 C730,420 725,440 715,450 C705,460 710,480 700,490 C690,500 695,520 685,530 C675,540 680,560 670,570 C660,580 665,600 655,610 C645,620 650,640 640,650 C630,660 635,680 625,690 C615,700 615,720 605,730 C595,740 590,760 580,770 C570,780 560,795 550,800 C540,805 520,810 510,815 C500,820 480,825 470,830 C460,835 440,840 430,845 C420,850 400,855 390,860 C380,865 360,870 350,870 C340,870 320,865 310,860 C300,855 280,850 270,845 C260,840 245,825 240,815 C235,805 230,785 230,775 C230,765 240,745 245,735 C250,725 265,710 270,700 C275,690 285,675 290,665 C295,655 305,640 310,630 C315,620 325,605 330,595 C335,585 345,570 350,560 C355,550 365,535 370,525 C375,515 385,500 390,490 C395,480 405,465 410,455 C415,445 420,430 425,420 C430,410 430,395 430,385 C430,375 425,360 420,350 C415,340 400,330 390,325 C380,320 365,315 355,315 C345,315 330,320 320,325 C310,330 295,340 285,345 C275,350 260,355 250,350 C240,345 230,330 225,320 C220,310 220,295 220,285 C220,275 225,260 230,250 C235,240 245,225 255,220 C265,215 280,215 290,215 C300,215 315,220 325,225 C335,230 350,235 360,235 C370,235 385,230 395,225 C405,220 420,210 430,205 C440,200 455,190 465,185 C475,180 495,180 505,180 C515,180 535,175 545,180 L580,200\' fill=\'none\' stroke=\'%23D8E5EF\' stroke-width=\'8\'/%3E%3Cpath d=\'M405,250 Q440,260 455,280 T485,310 Q505,330 520,340 T550,360 Q570,370 580,385 T610,405 Q625,415 635,430 T655,450 Q665,460 670,475 T685,495 Q695,505 695,520 T690,540 Q680,550 670,555 T640,560 Q620,560 605,555 T575,545 Q555,540 540,530 T510,515 Q490,505 475,495 T445,480 Q430,470 420,460 T400,440 Q385,430 380,420 T375,390 Q375,375 380,360 T395,330 Q405,315 420,305 T450,290 Q465,280 480,275 T505,270 Q520,270 535,275 T565,280\' fill=\'none\' stroke=\'%23D8E5EF\' stroke-width=\'8\'/%3E%3C/svg%3E")';
    mapElement.style.backgroundSize = 'cover';
    mapElement.style.backgroundRepeat = 'no-repeat';
    mapElement.style.backgroundPosition = 'center';
    
    // Add a visual border/shadow to the map
    const mapBorder = document.createElement('div');
    mapBorder.style.position = 'absolute';
    mapBorder.style.top = '10px';
    mapBorder.style.left = '10px';
    mapBorder.style.right = '10px';
    mapBorder.style.bottom = '10px';
    mapBorder.style.border = '1px solid #ebebeb';
    mapBorder.style.borderRadius = '12px';
    mapBorder.style.pointerEvents = 'none';
    mapElement.appendChild(mapBorder);
    
    // Add a title/label
    const mapTitle = document.createElement('div');
    mapTitle.style.position = 'absolute';
    mapTitle.style.top = '20px';
    mapTitle.style.left = '20px';
    mapTitle.style.padding = '10px 16px';
    mapTitle.style.backgroundColor = 'white';
    mapTitle.style.borderRadius = '8px';
    mapTitle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    mapTitle.style.zIndex = '5';
    mapTitle.style.fontWeight = 'bold';
    mapTitle.style.color = '#222';
    mapTitle.style.fontSize = '16px';
    mapTitle.textContent = 'India Airbnb Properties';
    mapElement.appendChild(mapTitle);
    
    // Add a zoom control
    const zoomControl = document.createElement('div');
    zoomControl.style.position = 'absolute';
    zoomControl.style.top = '20px';
    zoomControl.style.right = '20px';
    zoomControl.style.backgroundColor = 'white';
    zoomControl.style.borderRadius = '8px';
    zoomControl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    zoomControl.style.overflow = 'hidden';
    zoomControl.style.zIndex = '5';
    
    const zoomIn = document.createElement('div');
    zoomIn.textContent = '+';
    zoomIn.style.padding = '8px 12px';
    zoomIn.style.textAlign = 'center';
    zoomIn.style.fontWeight = 'bold';
    zoomIn.style.fontSize = '18px';
    zoomIn.style.cursor = 'pointer';
    zoomIn.style.borderBottom = '1px solid #ebebeb';
    
    const zoomOut = document.createElement('div');
    zoomOut.textContent = '−';
    zoomOut.style.padding = '8px 12px';
    zoomOut.style.textAlign = 'center';
    zoomOut.style.fontWeight = 'bold';
    zoomOut.style.fontSize = '18px';
    zoomOut.style.cursor = 'pointer';
    
    zoomControl.appendChild(zoomIn);
    zoomControl.appendChild(zoomOut);
    mapElement.appendChild(zoomControl);
    
    // Get all properties
    const properties = document.querySelectorAll('.property');
    const propertyData = [];
    
    // Extract property data
    properties.forEach((property, index) => {
      const locationElement = property.querySelector('.property-info h3');
      const location = locationElement ? locationElement.textContent.trim() : '';
      
      const priceElement = property.querySelector('.property-price span:first-child');
      const price = priceElement ? priceElement.textContent.trim() : '₹10,000';
      
      const imgElement = property.querySelector('img');
      const imgSrc = imgElement ? imgElement.src : '';
      
      const descElement = property.querySelector('.property-info p:first-of-type');
      const description = descElement ? descElement.textContent.trim() : '';
      
      // Match location with coordinates
      let coordinates = { x: 50, y: 50 }; // Default center position
      for (const [key, value] of Object.entries(indianDestinations)) {
        if (location.includes(key)) {
          coordinates = { x: value.x, y: value.y };
          break;
        }
      }
      
      propertyData.push({
        id: index,
        location: location,
        description: description,
        price: price,
        image: imgSrc,
        coordinates: coordinates
      });
    });
    
    // Add CSS for markers
    const style = document.createElement('style');
    style.textContent = `
      .map-marker {
        position: absolute;
        background-color: #FF385C;
        color: white;
        font-weight: bold;
        font-size: 12px;
        padding: 6px 8px;
        border-radius: 24px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.18);
        z-index: 10;
        cursor: pointer;
        white-space: nowrap;
        border: 2px solid white;
        transform: translate(-50%, -50%);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .map-marker:hover {
        transform: translate(-50%, -50%) scale(1.05);
        box-shadow: 0 3px 6px rgba(0,0,0,0.25);
        z-index: 20;
      }
      .marker-preview {
        transition: opacity 0.2s;
      }
    `;
    document.head.appendChild(style);
    
    // Add property markers to the map
    propertyData.forEach(property => {
      const marker = document.createElement('div');
      marker.classList.add('map-marker');
      // Format price to be shorter
      const numericPrice = parseInt(property.price.replace(/[^\d]/g, ''));
      const shortPrice = numericPrice >= 100000 ? 
        `₹${Math.round(numericPrice/1000)}k` : 
        property.price.split('.')[0];
      marker.textContent = shortPrice;
      
      // Position marker
      marker.style.left = `${property.coordinates.x}%`;
      marker.style.top = `${property.coordinates.y}%`;
      
      // Add hover effect with property preview
      marker.addEventListener('mouseenter', () => {
        const preview = document.createElement('div');
        preview.classList.add('marker-preview');
        preview.style.position = 'absolute';
        preview.style.bottom = 'calc(100% + 10px)';
        preview.style.left = '50%';
        preview.style.transform = 'translateX(-50%)';
        preview.style.width = '200px';
        preview.style.backgroundColor = 'white';
        preview.style.borderRadius = '8px';
        preview.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
        preview.style.zIndex = '40';
        preview.style.overflow = 'hidden';
        
        const previewImg = document.createElement('img');
        previewImg.src = property.image;
        previewImg.style.width = '100%';
        previewImg.style.height = '120px';
        previewImg.style.objectFit = 'cover';
        
        const previewContent = document.createElement('div');
        previewContent.style.padding = '12px';
        
        const previewTitle = document.createElement('div');
        previewTitle.textContent = property.location;
        previewTitle.style.fontWeight = 'bold';
        previewTitle.style.fontSize = '14px';
        previewTitle.style.marginBottom = '4px';
        
        const previewDesc = document.createElement('div');
        previewDesc.textContent = property.description;
        previewDesc.style.fontSize = '12px';
        previewDesc.style.color = '#717171';
        previewDesc.style.marginBottom = '4px';
        
        const previewPrice = document.createElement('div');
        previewPrice.textContent = property.price;
        previewPrice.style.fontWeight = 'bold';
        
        previewContent.appendChild(previewTitle);
        previewContent.appendChild(previewDesc);
        previewContent.appendChild(previewPrice);
        
        preview.appendChild(previewImg);
        preview.appendChild(previewContent);
        
        marker.appendChild(preview);
      });
      
      marker.addEventListener('mouseleave', () => {
        const preview = marker.querySelector('.marker-preview');
        if (preview) {
          preview.remove();
        }
      });
      
      // Add click event
      marker.addEventListener('click', () => {
        // Show property info
        const infoPanel = createInfoPanel(property);
        mapElement.appendChild(infoPanel);
      });
      
      mapElement.appendChild(marker);
    });
    
    // Set map as initialized
    window.mapInitialized = true;
    console.log('Static map created successfully with', propertyData.length, 'property markers');
  }
  
  // Helper function to create an info panel when a marker is clicked
  function createInfoPanel(property) {
    const panel = document.createElement('div');
    panel.style.position = 'absolute';
    panel.style.bottom = '20px';
    panel.style.left = '20px';
    panel.style.width = '280px';
    panel.style.backgroundColor = 'white';
    panel.style.borderRadius = '12px';
    panel.style.padding = '16px';
    panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    panel.style.zIndex = '50';
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '8px';
    closeBtn.style.right = '8px';
    closeBtn.style.backgroundColor = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => {
      panel.remove();
    });
    
    // Add content
    const img = document.createElement('img');
    img.src = property.image;
    img.style.width = '100%';
    img.style.height = '120px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '8px';
    img.style.marginBottom = '12px';
    
    const title = document.createElement('h3');
    title.textContent = property.location;
    title.style.margin = '0 0 4px';
    title.style.fontSize = '16px';
    
    const desc = document.createElement('p');
    desc.textContent = property.description;
    desc.style.margin = '0 0 8px';
    desc.style.color = '#717171';
    desc.style.fontSize = '14px';
    
    const price = document.createElement('p');
    price.textContent = property.price;
    price.style.margin = '0';
    price.style.fontWeight = 'bold';
    
    // Assemble panel
    panel.appendChild(closeBtn);
    panel.appendChild(img);
    panel.appendChild(title);
    panel.appendChild(desc);
    panel.appendChild(price);
    
    return panel;
  }

  // Listen for Firebase auth events
  document.addEventListener('userLoggedIn', function(e) {
    isLoggedIn = true;
    if (currentClickedHeart) {
      toggleHeartState(currentClickedHeart);
      currentClickedHeart = null;
    }
  });
  
  document.addEventListener('userLoggedOut', function() {
    isLoggedIn = false;
  });

  // Globe button and language/currency modal
  const globeBtn = document.getElementById('globe');
  const globeModal = document.getElementById('globeModal');
  const closeGlobeBtn = document.querySelector('.globe-close-btn');
  const languageTab = document.querySelector('.globe-tab[data-tab="language"]');
  const currencyTab = document.querySelector('.globe-tab[data-tab="currency"]');
  const languageContent = document.getElementById('language-content');
  const currencyContent = document.getElementById('currency-content');

  // Initialize globe modal
  if (globeBtn && globeModal) {
    // Open modal when globe button is clicked
    globeBtn.addEventListener('click', function() {
      globeModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
    
    // Close modal when close button is clicked
    if (closeGlobeBtn) {
      closeGlobeBtn.addEventListener('click', function() {
        globeModal.classList.remove('show');
        document.body.style.overflow = 'auto';
      });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target === globeModal) {
        globeModal.classList.remove('show');
        document.body.style.overflow = 'auto';
      }
    });
    
    // Tab switching
    if (languageTab && currencyTab) {
      languageTab.addEventListener('click', function() {
        languageTab.classList.add('active');
        currencyTab.classList.remove('active');
        if (languageContent && currencyContent) {
          languageContent.classList.remove('hidden');
          currencyContent.classList.add('hidden');
        }
      });
      
      currencyTab.addEventListener('click', function() {
        currencyTab.classList.add('active');
        languageTab.classList.remove('active');
        if (currencyContent && languageContent) {
          currencyContent.classList.remove('hidden');
          languageContent.classList.add('hidden');
        }
      });
    }
    
    // Language options
    const languageOptions = document.querySelectorAll('.language-option');
    if (languageOptions) {
      languageOptions.forEach(option => {
        option.addEventListener('click', function() {
          languageOptions.forEach(opt => opt.classList.remove('selected'));
          this.classList.add('selected');
          
          // Get language and region
          const language = this.querySelector('div:first-child').textContent;
          const region = this.querySelector('.region').textContent;
          console.log(`Changed language to ${language} (${region})`);
          
          // In a real implementation, this would trigger a translation API
          alert(`Language changed to ${language} (${region})`);
          
          // Close the modal after selection with slight delay
          setTimeout(() => {
            globeModal.classList.remove('show');
            document.body.style.overflow = 'auto';
          }, 500);
        });
      });
    }
    
    // Currency options and conversion
    const currencyOptions = document.querySelectorAll('.currency-option');
    
    // Currency conversion rates (approximate)
    const currencyRates = {
      'INR': 1, // Base currency (Indian Rupee)
      'USD': 0.012,
      'EUR': 0.011,
      'GBP': 0.0095,
      'AUD': 0.018,
      'CAD': 0.016,
      'JPY': 1.80,
      'CNY': 0.086,
      'AED': 0.044
    };
    
    // Currency symbols
    const currencySymbols = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'AUD': 'A$',
      'CAD': 'C$',
      'JPY': '¥',
      'CNY': '¥',
      'AED': 'د.إ'
    };
    
    // Current currency (default INR)
    let currentCurrency = 'INR';
    
    if (currencyOptions) {
      currencyOptions.forEach(option => {
        option.addEventListener('click', function() {
          currencyOptions.forEach(opt => opt.classList.remove('selected'));
          this.classList.add('selected');
          
          // Get selected currency code
          const currencyText = this.querySelector('.currency-code').textContent;
          const currencyCode = currencyText.split(' – ')[0];
          
          console.log(`Changed currency to ${currencyCode}`);
          
          // Convert all prices
          convertAllPrices(currencyCode);
          
          // Close the modal after selection with slight delay
          setTimeout(() => {
            globeModal.classList.remove('show');
            document.body.style.overflow = 'auto';
          }, 500);
        });
      });
    }
    
    // Function to convert all prices on the page
    function convertAllPrices(newCurrencyCode) {
      // Skip if the currency isn't changing
      if (newCurrencyCode === currentCurrency) return;
      
      // Get conversion rates
      const fromRate = currencyRates[currentCurrency] || 1;
      const toRate = currencyRates[newCurrencyCode] || 1;
      const conversionRate = toRate / fromRate;
      
      // Get new currency symbol
      const newSymbol = currencySymbols[newCurrencyCode] || newCurrencyCode;
      
      // Find all price elements
      const priceElements = document.querySelectorAll('.property-price span:first-child');
      
      priceElements.forEach(priceElement => {
        // Extract numeric value from current price (removing currency symbol and commas)
        const currentPriceText = priceElement.textContent;
        const currentPrice = parseFloat(currentPriceText.replace(/[^\d.]/g, ''));
        
        // Calculate new price
        const newPrice = currentPrice * conversionRate;
        
        // Format new price
        const formattedNewPrice = `${newSymbol}${Math.round(newPrice).toLocaleString('en-IN')}`;
        
        // Update the price element
        priceElement.textContent = formattedNewPrice;
      });
      
      // Update current currency
      currentCurrency = newCurrencyCode;
      
      // Update map markers if map is initialized
      if (window.mapInitialized && window.google && window.google.maps) {
        const markers = document.querySelectorAll('.map-marker');
        markers.forEach(marker => {
          // Update price display on marker
          const numericPrice = parseInt(marker.textContent.replace(/[^\d]/g, ''));
          const newPrice = numericPrice * conversionRate;
          
          // Format new price for marker
          if (newPrice >= 100000) {
            marker.textContent = `${newSymbol}${Math.round(newPrice/1000)}k`;
          } else {
            marker.textContent = `${newSymbol}${Math.round(newPrice)}`;
          }
          
          // If there's a preview open, update its price too
          const preview = marker.querySelector('.marker-preview');
          if (preview) {
            const previewPrice = preview.querySelector('div:last-child');
            if (previewPrice) {
              previewPrice.textContent = `${newSymbol}${Math.round(newPrice).toLocaleString('en-IN')}`;
            }
          }
        });
      }
    }
  }
});

const globe= document.querySelector('#globe');
const globeContainer= document.querySelector('.globe-container');
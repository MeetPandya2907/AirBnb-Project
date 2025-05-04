document.addEventListener('DOMContentLoaded', function() {
  // Mobile search bar behavior
  const searchBar = document.querySelector('.search-bar');
  const expandedSearch = document.querySelector('.expanded-search');
  const searchInput = document.querySelector('.expanded-search-input[placeholder="Search destinations"]');
  const checkInInput = document.querySelector('.expanded-search-input[placeholder="Add dates"]');
  const checkOutInput = document.querySelector('.expanded-search-input[placeholder="Add dates"]:nth-of-type(2)');
  const searchButton = document.querySelector('.expanded-search-button');
  
  // Initialize calendar datepickers for check-in and check-out
  if (checkInInput && checkOutInput) {
    // Create calendar container
    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'calendar-container';
    calendarContainer.style.display = 'none';
    document.body.appendChild(calendarContainer);
    
    // Calendar variables
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedCheckIn = null;
    let selectedCheckOut = null;
    
    // Function to generate calendar
    function generateCalendar(month, year, container) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      // Clear container
      container.innerHTML = '';
      
      // Create calendar header
      const header = document.createElement('div');
      header.className = 'calendar-header';
      
      const prevBtn = document.createElement('button');
      prevBtn.className = 'calendar-nav-btn prev-month';
      prevBtn.innerHTML = '&lt;';
      prevBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        generateCalendar(currentMonth, currentYear, container);
      });
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'calendar-nav-btn next-month';
      nextBtn.innerHTML = '&gt;';
      nextBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        generateCalendar(currentMonth, currentYear, container);
      });
      
      const monthYearLabel = document.createElement('div');
      monthYearLabel.className = 'calendar-month-year';
      monthYearLabel.textContent = `${months[month]} ${year}`;
      
      header.appendChild(prevBtn);
      header.appendChild(monthYearLabel);
      header.appendChild(nextBtn);
      container.appendChild(header);
      
      // Create two-column layout for desktop
      const calendarGrid = document.createElement('div');
      calendarGrid.className = 'calendar-grid';
      
      // Create first month
      const firstMonth = document.createElement('div');
      firstMonth.className = 'calendar-month';
      
      // Create days header
      const daysHeader = document.createElement('div');
      daysHeader.className = 'calendar-days-header';
      
      days.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day-name';
        dayEl.textContent = day;
        daysHeader.appendChild(dayEl);
      });
      
      firstMonth.appendChild(daysHeader);
      
      // Create dates
      const firstMonthDates = document.createElement('div');
      firstMonthDates.className = 'calendar-dates';
      
      // Get first day of month
      const firstDay = new Date(year, month, 1).getDay();
      
      // Get last date of month
      const lastDate = new Date(year, month + 1, 0).getDate();
      
      // Fill in empty cells for days before first day of month
      for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-date empty';
        firstMonthDates.appendChild(emptyCell);
      }
      
      // Create date cells
      for (let i = 1; i <= lastDate; i++) {
        const dateCell = document.createElement('div');
        dateCell.className = 'calendar-date';
        dateCell.textContent = i;
        
        // Current date
        const currentDate = new Date();
        if (year === currentDate.getFullYear() && month === currentDate.getMonth() && i === currentDate.getDate()) {
          dateCell.classList.add('today');
        }
        
        // Check if this date is selected for check-in or check-out
        const thisDate = new Date(year, month, i);
        
        if (selectedCheckIn && thisDate.getTime() === selectedCheckIn.getTime()) {
          dateCell.classList.add('selected-checkin');
        }
        
        if (selectedCheckOut && thisDate.getTime() === selectedCheckOut.getTime()) {
          dateCell.classList.add('selected-checkout');
        }
        
        // Add in-range class for dates between check-in and check-out
        if (selectedCheckIn && selectedCheckOut && 
            thisDate > selectedCheckIn && thisDate < selectedCheckOut) {
          dateCell.classList.add('in-range');
        }
        
        // Add past class for dates before today
        if (thisDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) {
          dateCell.classList.add('past');
        } else {
          // Add click event for future dates
          dateCell.addEventListener('click', function() {
            const clickedDate = new Date(year, month, i);
            
            // Logic for selecting check-in and check-out dates
            if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
              // Start a new selection
              selectedCheckIn = clickedDate;
              selectedCheckOut = null;
              checkInInput.value = formatDate(clickedDate);
              checkOutInput.value = '';
            } else if (clickedDate > selectedCheckIn) {
              // Complete the selection
              selectedCheckOut = clickedDate;
              checkOutInput.value = formatDate(clickedDate);
              
              // Close calendar after complete selection with a delay
              setTimeout(() => {
                calendarContainer.style.display = 'none';
              }, 300);
            } else {
              // Invalid selection (check-out before check-in)
              alert('Check-out date must be after check-in date');
            }
            
            // Regenerate calendar to reflect changes
            generateCalendar(currentMonth, currentYear, container);
          });
        }
        
        firstMonthDates.appendChild(dateCell);
      }
      
      firstMonth.appendChild(firstMonthDates);
      calendarGrid.appendChild(firstMonth);
      
      // Create second month (next month) for desktop
      const secondMonth = document.createElement('div');
      secondMonth.className = 'calendar-month';
      
      // Next month & year
      let nextMonth = month + 1;
      let nextYear = year;
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
      }
      
      // Create month header
      const nextMonthHeader = document.createElement('div');
      nextMonthHeader.className = 'calendar-month-header';
      nextMonthHeader.textContent = `${months[nextMonth]} ${nextYear}`;
      secondMonth.appendChild(nextMonthHeader);
      
      // Create days header for second month
      const secondDaysHeader = document.createElement('div');
      secondDaysHeader.className = 'calendar-days-header';
      
      days.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day-name';
        dayEl.textContent = day;
        secondDaysHeader.appendChild(dayEl);
      });
      
      secondMonth.appendChild(secondDaysHeader);
      
      // Create dates for second month
      const secondMonthDates = document.createElement('div');
      secondMonthDates.className = 'calendar-dates';
      
      // Get first day of next month
      const nextMonthFirstDay = new Date(nextYear, nextMonth, 1).getDay();
      
      // Get last date of next month
      const nextMonthLastDate = new Date(nextYear, nextMonth + 1, 0).getDate();
      
      // Fill in empty cells for days before first day of next month
      for (let i = 0; i < nextMonthFirstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-date empty';
        secondMonthDates.appendChild(emptyCell);
      }
      
      // Create date cells for next month
      for (let i = 1; i <= nextMonthLastDate; i++) {
        const dateCell = document.createElement('div');
        dateCell.className = 'calendar-date';
        dateCell.textContent = i;
        
        // Check if this date is selected for check-in or check-out
        const thisDate = new Date(nextYear, nextMonth, i);
        
        if (selectedCheckIn && thisDate.getTime() === selectedCheckIn.getTime()) {
          dateCell.classList.add('selected-checkin');
        }
        
        if (selectedCheckOut && thisDate.getTime() === selectedCheckOut.getTime()) {
          dateCell.classList.add('selected-checkout');
        }
        
        // Add in-range class for dates between check-in and check-out
        if (selectedCheckIn && selectedCheckOut && 
            thisDate > selectedCheckIn && thisDate < selectedCheckOut) {
          dateCell.classList.add('in-range');
        }
        
        // Add click event
        dateCell.addEventListener('click', function() {
          const clickedDate = new Date(nextYear, nextMonth, i);
          
          // Logic for selecting check-in and check-out dates
          if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
            // Start a new selection
            selectedCheckIn = clickedDate;
            selectedCheckOut = null;
            checkInInput.value = formatDate(clickedDate);
            checkOutInput.value = '';
          } else if (clickedDate > selectedCheckIn) {
            // Complete the selection
            selectedCheckOut = clickedDate;
            checkOutInput.value = formatDate(clickedDate);
            
            // Close calendar after complete selection with a delay
            setTimeout(() => {
              calendarContainer.style.display = 'none';
            }, 300);
          } else {
            // Invalid selection (check-out before check-in)
            alert('Check-out date must be after check-in date');
          }
          
          // Regenerate calendar to reflect changes
          generateCalendar(currentMonth, currentYear, container);
        });
        
        secondMonthDates.appendChild(dateCell);
      }
      
      secondMonth.appendChild(secondMonthDates);
      
      // Only add second month for desktop view
      if (window.innerWidth > 767) {
        calendarGrid.appendChild(secondMonth);
      }
      
      container.appendChild(calendarGrid);
      
      // Add clear and close buttons
      const calendarFooter = document.createElement('div');
      calendarFooter.className = 'calendar-footer';
      
      const clearButton = document.createElement('button');
      clearButton.className = 'calendar-clear-btn';
      clearButton.textContent = 'Clear dates';
      clearButton.addEventListener('click', function() {
        selectedCheckIn = null;
        selectedCheckOut = null;
        checkInInput.value = '';
        checkOutInput.value = '';
        generateCalendar(currentMonth, currentYear, container);
      });
      
      const closeButton = document.createElement('button');
      closeButton.className = 'calendar-close-btn';
      closeButton.textContent = 'Close';
      closeButton.addEventListener('click', function() {
        calendarContainer.style.display = 'none';
      });
      
      calendarFooter.appendChild(clearButton);
      calendarFooter.appendChild(closeButton);
      container.appendChild(calendarFooter);
    }
    
    // Helper function to format date
    function formatDate(date) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    
    // Toggle calendar on check-in/check-out input click
    checkInInput.addEventListener('click', function(e) {
      e.stopPropagation();
      const rect = expandedSearch.getBoundingClientRect();
      calendarContainer.style.display = 'block';
      calendarContainer.style.top = rect.bottom + 'px';
      calendarContainer.style.left = rect.left + 'px';
      
      // Generate calendar
      generateCalendar(currentMonth, currentYear, calendarContainer);
    });
    
    checkOutInput.addEventListener('click', function(e) {
      e.stopPropagation();
      const rect = expandedSearch.getBoundingClientRect();
      calendarContainer.style.display = 'block';
      calendarContainer.style.top = rect.bottom + 'px';
      calendarContainer.style.left = rect.left + 'px';
      
      // Generate calendar
      generateCalendar(currentMonth, currentYear, calendarContainer);
    });
    
    // Close calendar when clicking outside
    document.addEventListener('click', function(e) {
      if (calendarContainer.style.display === 'block' && 
          !calendarContainer.contains(e.target) && 
          e.target !== checkInInput && 
          e.target !== checkOutInput) {
        calendarContainer.style.display = 'none';
      }
    });
    
    // Update calendar on window resize
    window.addEventListener('resize', function() {
      if (calendarContainer.style.display === 'block') {
        const rect = expandedSearch.getBoundingClientRect();
        calendarContainer.style.top = rect.bottom + 'px';
        calendarContainer.style.left = rect.left + 'px';
        
        // Regenerate calendar to handle desktop/mobile layout
        generateCalendar(currentMonth, currentYear, calendarContainer);
      }
    });
  }
  
  // Implement property search functionality
  if (searchInput) {
    // Reset button for search
    const resetSearchBtn = document.createElement('button');
    resetSearchBtn.className = 'reset-search-btn';
    resetSearchBtn.textContent = '×';
    resetSearchBtn.style.position = 'absolute';
    resetSearchBtn.style.right = '10px';
    resetSearchBtn.style.top = '50%';
    resetSearchBtn.style.transform = 'translateY(-50%)';
    resetSearchBtn.style.background = 'transparent';
    resetSearchBtn.style.border = 'none';
    resetSearchBtn.style.fontSize = '18px';
    resetSearchBtn.style.cursor = 'pointer';
    resetSearchBtn.style.display = 'none';
    
    // Add reset button to search input parent
    searchInput.parentElement.style.position = 'relative';
    searchInput.parentElement.appendChild(resetSearchBtn);
    
    // Add input event to handle search
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      
      // Show/hide reset button
      resetSearchBtn.style.display = searchTerm.length > 0 ? 'block' : 'none';
      
      // Don't search if term is too short
      if (searchTerm.length < 2) {
        // Reset to original category if search cleared
        if (searchTerm.length === 0) {
          const activeCategory = document.querySelector('.category.active');
          if (activeCategory) {
            const categoryName = activeCategory.querySelector('.category-name').textContent;
            updateProperties(categoryName);
          }
        }
        return;
      }
      
      // Search through all properties in all categories
      const allProperties = [];
      
      // Collect properties from all categories
      for (const [categoryName, properties] of Object.entries(categoryProperties)) {
        properties.forEach(property => {
          // Add category to property object
          property.category = categoryName;
          allProperties.push(property);
        });
      }
      
      // Add default properties
      defaultProperties.forEach(property => {
        property.category = 'Default';
        allProperties.push(property);
      });
      
      // Filter properties by search term
      const filteredProperties = allProperties.filter(property => {
        return property.location.toLowerCase().includes(searchTerm) || 
               property.description.toLowerCase().includes(searchTerm);
      });
      
      // Update UI with search results
      displaySearchResults(filteredProperties, searchTerm);
    });
    
    // Reset search button click
    resetSearchBtn.addEventListener('click', function() {
      searchInput.value = '';
      resetSearchBtn.style.display = 'none';
      
      // Restore original category view
      const activeCategory = document.querySelector('.category.active');
      if (activeCategory) {
        const categoryName = activeCategory.querySelector('.category-name').textContent;
        updateProperties(categoryName);
      }
    });
  }
  
  // Handle search button click
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      if (searchTerm.length < 2) {
        alert('Please enter a search term with at least 2 characters');
        return;
      }
      
      // Trigger search manually
      const event = new Event('input');
      searchInput.dispatchEvent(event);
      
      // Close expanded search on mobile
      if (window.innerWidth <= 767) {
        expandedSearch.classList.remove('mobile-visible');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Make search bar clickable on mobile to show expanded search
  if (searchBar && expandedSearch) {
    searchBar.addEventListener('click', function() {
      if (window.innerWidth <= 767) {
        expandedSearch.classList.add('mobile-visible');
        document.body.style.overflow = 'hidden';
      }
    });
    
    // Add close button to expanded search on mobile
    const mobileSearchClose = document.createElement('button');
    mobileSearchClose.className = 'mobile-search-close';
    mobileSearchClose.innerHTML = '&times;';
    mobileSearchClose.style.position = 'absolute';
    mobileSearchClose.style.top = '10px';
    mobileSearchClose.style.right = '10px';
    mobileSearchClose.style.background = 'transparent';
    mobileSearchClose.style.border = 'none';
    mobileSearchClose.style.fontSize = '24px';
    mobileSearchClose.style.cursor = 'pointer';
    mobileSearchClose.style.zIndex = '1002';
    mobileSearchClose.style.display = 'none';
    
    expandedSearch.appendChild(mobileSearchClose);
    
    // Show close button only on mobile
    if (window.innerWidth <= 767) {
      mobileSearchClose.style.display = 'block';
    }
    
    window.addEventListener('resize', function() {
      if (window.innerWidth <= 767) {
        mobileSearchClose.style.display = 'block';
      } else {
        mobileSearchClose.style.display = 'none';
        expandedSearch.classList.remove('mobile-visible');
      }
    });
    
    // Close expanded search when close button is clicked
    mobileSearchClose.addEventListener('click', function() {
      expandedSearch.classList.remove('mobile-visible');
      document.body.style.overflow = '';
    });
    
    // Close expanded search when clicking outside
    document.addEventListener('click', function(e) {
      if (expandedSearch.classList.contains('mobile-visible') && 
          !expandedSearch.contains(e.target) && 
          !searchBar.contains(e.target)) {
        expandedSearch.classList.remove('mobile-visible');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Fix mobile search display
  if (window.innerWidth <= 767) {
    // Create a search icon button for mobile
    const mobileSearchBtn = document.createElement('button');
    mobileSearchBtn.className = 'mobile-search-btn';
    mobileSearchBtn.innerHTML = `
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="display:block;fill:none;height:16px;width:16px;stroke:currentColor;stroke-width:3;overflow:visible">
        <circle cx="14" cy="14" r="9"></circle>
        <path d="M20 20L25 25"></path>
      </svg>
    `;
    mobileSearchBtn.style.position = 'fixed';
    mobileSearchBtn.style.bottom = '20px';
    mobileSearchBtn.style.right = '20px';
    mobileSearchBtn.style.width = '44px';
    mobileSearchBtn.style.height = '44px';
    mobileSearchBtn.style.borderRadius = '50%';
    mobileSearchBtn.style.backgroundColor = '#FF385C';
    mobileSearchBtn.style.color = 'white';
    mobileSearchBtn.style.border = 'none';
    mobileSearchBtn.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
    mobileSearchBtn.style.display = 'flex';
    mobileSearchBtn.style.alignItems = 'center';
    mobileSearchBtn.style.justifyContent = 'center';
    mobileSearchBtn.style.zIndex = '999';
    document.body.appendChild(mobileSearchBtn);
    
    // When clicked, show the expanded search
    mobileSearchBtn.addEventListener('click', function() {
      expandedSearch.classList.add('mobile-visible');
      document.body.style.overflow = 'hidden';
    });
  }

  // Fix calendar display issues
  if (checkInInput && checkOutInput) {
    // Ensure calendar container exists
    let calendarContainer = document.querySelector('.calendar-container');
    
    // If calendar container doesn't exist yet, create it
    if (!calendarContainer) {
      calendarContainer = document.createElement('div');
      calendarContainer.className = 'calendar-container';
      calendarContainer.style.display = 'none';
      document.body.appendChild(calendarContainer);
      
      // Calendar variables
      let currentMonth = new Date().getMonth();
      let currentYear = new Date().getFullYear();
      let selectedCheckIn = null;
      let selectedCheckOut = null;
      
      // Function to generate calendar
      function generateCalendar(month, year, container) {
        // ... existing calendar generation code ...
        
        // Create simple calendar for testing
        container.innerHTML = `
          <div class="calendar-header">
            <button class="calendar-nav-btn prev-month">&lt;</button>
            <div class="calendar-month-year">June 2023</div>
            <button class="calendar-nav-btn next-month">&gt;</button>
          </div>
          <div class="calendar-grid">
            <div class="calendar-month">
              <div class="calendar-days-header">
                <div class="calendar-day-name">Sun</div>
                <div class="calendar-day-name">Mon</div>
                <div class="calendar-day-name">Tue</div>
                <div class="calendar-day-name">Wed</div>
                <div class="calendar-day-name">Thu</div>
                <div class="calendar-day-name">Fri</div>
                <div class="calendar-day-name">Sat</div>
              </div>
              <div class="calendar-dates">
                <!-- Calendar dates would go here -->
              </div>
            </div>
          </div>
          <div class="calendar-footer">
            <button class="calendar-clear-btn">Clear dates</button>
            <button class="calendar-close-btn">Close</button>
          </div>
        `;
        
        // Add event listeners for calendar controls
        container.querySelector('.prev-month').addEventListener('click', function() {
          // Handle previous month
        });
        
        container.querySelector('.next-month').addEventListener('click', function() {
          // Handle next month
        });
        
        container.querySelector('.calendar-clear-btn').addEventListener('click', function() {
          // Clear selected dates
          selectedCheckIn = null;
          selectedCheckOut = null;
          checkInInput.value = '';
          checkOutInput.value = '';
        });
        
        container.querySelector('.calendar-close-btn').addEventListener('click', function() {
          // Close calendar
          container.style.display = 'none';
        });
      }
    }
    
    // Make calendar more visible and fixed position
    calendarContainer.style.zIndex = '1100';
    calendarContainer.style.position = 'fixed';
    calendarContainer.style.top = '50%';
    calendarContainer.style.left = '50%';
    calendarContainer.style.transform = 'translate(-50%, -50%)';
    
    // Toggle calendar on check-in/check-out input click
    checkInInput.addEventListener('click', function(e) {
      e.stopPropagation();
      calendarContainer.style.display = 'block';
      
      // Generate simple calendar for testing
      generateCalendar(new Date().getMonth(), new Date().getFullYear(), calendarContainer);
    });
    
    checkOutInput.addEventListener('click', function(e) {
      e.stopPropagation();
      calendarContainer.style.display = 'block';
      
      // Generate simple calendar for testing
      generateCalendar(new Date().getMonth(), new Date().getFullYear(), calendarContainer);
    });
    
    // Close calendar when clicking outside
    document.addEventListener('click', function(e) {
      if (calendarContainer.style.display === 'block' && 
          !calendarContainer.contains(e.target) && 
          e.target !== checkInInput && 
          e.target !== checkOutInput) {
        calendarContainer.style.display = 'none';
      }
    });
  }
  
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

  // Property data for each category
  const categoryProperties = {
    'Farms': [
      { id: 1, image: 'img1.jpg', location: 'Farm Estate, Maharashtra', description: 'Scenic farmhouse with open fields', price: '₹75,500', rating: '4.91', dates: '16-21 Jun' },
      { id: 2, image: 'img4.avif', location: 'Organic Farm, Punjab', description: 'Working farm with traditional stay', price: '₹62,800', rating: '4.87', dates: '3-8 Jul' },
      { id: 3, image: 'img7.avif', location: 'Green Valley, Himachal', description: 'Mountain farm with apple orchards', price: '₹89,200', rating: '4.95', dates: '12-17 Aug' },
      { id: 4, image: 'img9.jpg', location: 'Rural Retreat, Karnataka', description: 'Coffee plantation with guest house', price: '₹95,500', rating: '4.89', dates: '5-10 Sep' },
      { id: 5, image: 'img2.jpg', location: 'Mango Orchard, Gujarat', description: 'Peaceful farm stay with fruit picking', price: '₹72,300', rating: '4.82', dates: '10-15 Jul' },
      { id: 6, image: 'img5.avif', location: 'Lakeside Farm, Kerala', description: 'Farm with fishing and boating', price: '₹86,000', rating: '4.88', dates: '20-25 Jun' },
      { id: 7, image: 'img8.avif', location: 'Rice Paddy Retreat, West Bengal', description: 'Traditional rice farm experience', price: '₹65,500', rating: '4.79', dates: '7-12 Aug' },
      { id: 8, image: 'img11.jpg', location: 'Spice Garden, Goa', description: 'Aromatic spice plantation stay', price: '₹92,700', rating: '4.92', dates: '15-20 Sep' },
      { id: 9, image: 'img3.avif', location: 'Vineyard Estate, Nashik', description: 'Wine tasting and grape harvesting', price: '₹110,000', rating: '4.94', dates: '1-6 Oct' },
      { id: 10, image: 'img6.jpg', location: 'Dairy Farm, Haryana', description: 'Working dairy with cheese making classes', price: '₹68,900', rating: '4.81', dates: '22-27 Jul' },
      { id: 11, image: 'img10.jpg', location: 'Sunflower Fields, Madhya Pradesh', description: 'Colorful farm with flower fields', price: '₹79,500', rating: '4.86', dates: '8-13 Jul' },
      { id: 12, image: 'img12.jpg', location: 'Herb Garden, Uttarakhand', description: 'Medicinal herb farm with workshops', price: '₹84,300', rating: '4.90', dates: '11-16 Aug' },
      { id: 13, image: 'img2.avif', location: 'Tea Estate, Darjeeling', description: 'Scenic tea plantation with processing tour', price: '₹98,500', rating: '4.93', dates: '5-10 Sep' },
      { id: 14, image: 'img1.avif', location: 'Horse Farm, Rajasthan', description: 'Equestrian farm with riding lessons', price: '₹105,000', rating: '4.89', dates: '12-17 Jul' },
      { id: 15, image: 'img7.avif', location: 'Butterfly Garden, Assam', description: 'Farm with butterfly and flower gardens', price: '₹76,400', rating: '4.85', dates: '19-24 Aug' },
      { id: 16, image: 'img9.avif', location: 'Bamboo Groove, Manipur', description: 'Sustainable bamboo farm retreat', price: '₹82,100', rating: '4.83', dates: '2-7 Sep' },
      { id: 17, image: 'img4.avif', location: 'Honey Farm, Himachal Pradesh', description: 'Apiary with honey harvesting experience', price: '₹74,200', rating: '4.84', dates: '25-30 Jun' },
      { id: 18, image: 'img8.avif', location: 'Lavender Fields, Kashmir', description: 'Aromatic lavender farm retreat', price: '₹115,000', rating: '4.96', dates: '15-20 Jul' },
      { id: 19, image: 'img5.avif', location: 'Organic Vegetable Farm, Tamil Nadu', description: 'Hands-on farming with cooking classes', price: '₹70,800', rating: '4.82', dates: '8-13 Aug' },
      { id: 20, image: 'img3.avif', location: 'Fruit Orchard, Himachal Pradesh', description: 'Apple, pear and plum orchards with picking', price: '₹88,600', rating: '4.91', dates: '22-27 Sep' },
      { id: 21, image: 'img6.jpg', location: 'Flower Farm, Sikkim', description: 'Exotic flower farm with mountain views', price: '₹96,200', rating: '4.87', dates: '10-15 Jul' },
      { id: 22, image: 'img2.jpg', location: 'Rice Terraces, Nagaland', description: 'Traditional rice farming with cultural immersion', price: '₹79,900', rating: '4.88', dates: '5-10 Aug' },
      { id: 23, image: 'img11.jpg', location: 'Coconut Grove, Kerala', description: 'Coastal coconut farm with fishing', price: '₹91,300', rating: '4.90', dates: '18-23 Sep' },
      { id: 24, image: 'img4.avif', location: 'Mushroom Farm, Meghalaya', description: 'Gourmet mushroom cultivation experience', price: '₹72,600', rating: '4.83', dates: '1-6 Jul' },
      { id: 25, image: 'img8.avif', location: 'Silk Farm, Karnataka', description: 'Sericulture and silk weaving experience', price: '₹86,500', rating: '4.85', dates: '14-19 Aug' }
    ],
    'Icons': [
      { id: 5, image: 'img2.jpg', location: 'Taj View, Agra', description: 'Historic home with monument view', price: '₹1,24,500', rating: '4.98', dates: '10-15 Jun' },
      { id: 6, image: 'img5.avif', location: 'Gateway Apartment, Mumbai', description: 'Luxury stay near Gateway of India', price: '₹1,56,800', rating: '4.92', dates: '22-27 Jul' },
      { id: 7, image: 'img8.avif', location: 'Victoria Villa, Kolkata', description: 'Colonial home with historic charm', price: '₹98,200', rating: '4.85', dates: '8-13 Aug' }
    ],
    'Amazing Pools': [
      { id: 8, image: 'img3.avif', location: 'Infinity Edge, Goa', description: 'Beachfront home with infinity pool', price: '₹2,15,000', rating: '4.99', dates: '5-10 Jun' },
      { id: 9, image: 'img6.jpg', location: 'Hillside Retreat, Lonavala', description: 'Mountain villa with private pool', price: '₹1,78,600', rating: '4.93', dates: '15-20 Jul' },
      { id: 10, image: 'img9.avif', location: 'Royal Resort, Udaipur', description: 'Lake view with traditional pool', price: '₹1,56,200', rating: '4.95', dates: '12-17 Aug' },
      { id: 11, image: 'img12.jpg', location: 'Modern Oasis, Bangalore', description: 'Contemporary home with lap pool', price: '₹1,32,500', rating: '4.88', dates: '7-12 Sep' }
    ],
    'Design': [
      { id: 12, image: 'img10.jpg', location: 'Architect\'s Loft, Mumbai', description: 'Award-winning architectural design', price: '₹1,52,800', rating: '4.96', dates: '15-20 Jun' },
      { id: 13, image: 'img11.jpg', location: 'Modern Studio, Delhi', description: 'Contemporary minimal design space', price: '₹88,600', rating: '4.90', dates: '9-14 Jul' },
      { id: 14, image: 'img3.avif', location: 'Designer Villa, Goa', description: 'Boutique villa with artistic touches', price: '₹1,79,200', rating: '4.94', dates: '20-25 Aug' }
    ],
    'Earth homes': [
      { id: 15, image: 'img5.avif', location: 'Mud House, Rajasthan', description: 'Traditional earth house experience', price: '₹45,500', rating: '4.87', dates: '2-7 Jun' },
      { id: 16, image: 'img8.avif', location: 'Eco Dome, Himachal', description: 'Sustainable earth dome with views', price: '₹72,800', rating: '4.85', dates: '11-16 Jul' },
      { id: 17, image: 'img2.avif', location: 'Cave Stay, Madhya Pradesh', description: 'Modern cave-style earth home', price: '₹66,200', rating: '4.83', dates: '23-28 Aug' }
    ],
    'National Parks': [
      { id: 18, image: 'img9.avif', location: 'Ranthambore Edge, Rajasthan', description: 'Safari villa near tiger reserve', price: '₹1,35,500', rating: '4.92', dates: '6-11 Jun' },
      { id: 19, image: 'img1.avif', location: 'Jim Corbett View, Uttarakhand', description: 'Forest cabin with wildlife views', price: '₹95,800', rating: '4.89', dates: '18-23 Jul' },
      { id: 20, image: 'img4.jpg', location: 'Kanha Retreat, MP', description: 'Jungle lodge with private tours', price: '₹1,12,200', rating: '4.91', dates: '15-20 Aug' },
      { id: 21, image: 'img7.avif', location: 'Bandipur Cottage, Karnataka', description: 'Wildlife cottage with guided walks', price: '₹86,500', rating: '4.88', dates: '9-14 Sep' }
    ],
    'Amazing Views': [
      { id: 22, image: 'img6.jpg', location: 'Himalayan Lookout, Uttarakhand', description: 'Mountain cabin with panoramic views', price: '₹92,500', rating: '4.94', dates: '12-17 Jun' },
      { id: 23, image: 'img3.avif', location: 'Coastal Villa, Kerala', description: 'Beachfront home with sea views', price: '₹1,48,800', rating: '4.96', dates: '5-10 Jul' },
      { id: 24, image: 'img10.jpg', location: 'Valley House, Kasol', description: 'River valley views from every room', price: '₹86,200', rating: '4.90', dates: '18-23 Aug' }
    ]
  };

  // Default properties for other categories not specifically defined
  const defaultProperties = [
    { id: 25, image: 'img4.avif', location: 'Beachside Bungalow, Goa', description: 'Private beach access and views', price: '₹1,25,500', rating: '4.93', dates: '20-25 Jun' },
    { id: 26, image: 'img7.avif', location: 'Mountain Cabin, Shimla', description: 'Cozy retreat with forest views', price: '₹78,800', rating: '4.87', dates: '8-13 Jul' },
    { id: 27, image: 'img2.jpg', location: 'City Loft, Mumbai', description: 'Modern apartment in central location', price: '₹1,12,200', rating: '4.89', dates: '25-30 Aug' },
    { id: 28, image: 'img9.avif', location: 'Heritage Home, Jaipur', description: 'Traditional haveli with courtyard', price: '₹96,500', rating: '4.91', dates: '14-19 Sep' },
    { id: 29, image: 'img12.jpg', location: 'Lake View Villa, Udaipur', description: 'Luxury home on lake shore', price: '₹1,68,200', rating: '4.95', dates: '2-7 Oct' }
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
    
    // For Farms category, show all 25 properties
    const numProperties = categoryName === 'Farms' ? 
        Math.min(25, properties.length) : 
        Math.max(3, Math.min(8, properties.length));
    
    // Get the containers and clear them
    propertiesContainers.forEach(container => {
      container.innerHTML = '';
    });
    
    // Fill the containers with properties
    const firstContainer = propertiesContainers[0];
    let propertyHTML = '';
    
    for (let i = 0; i < numProperties; i++) {
      propertyHTML += createPropertyHTML(properties[i]);
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
      
      // Ensure image is visible
      if (img) {
        img.style.display = 'block';
        img.style.objectFit = 'cover';
        img.style.width = '100%';
        img.style.height = '100%';
      }
      
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
        const availableImgNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        
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

  // Update properties when category is clicked
  categories.forEach(category => {
    category.addEventListener('click', function() {
      // Remove active class from all categories
      categories.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked category
      category.classList.add('active');
      
      // Get category name and update properties
      const categoryName = category.querySelector('.category-name').textContent;
      updateProperties(categoryName);
      
      // Dispatch event for mobile menu sync
      document.dispatchEvent(new CustomEvent('categoryChanged'));
    });
  });

  // Initialize with the default active category
  window.addEventListener('load', function() {
    const activeCategory = document.querySelector('.category.active');
    if (activeCategory) {
      const categoryName = activeCategory.querySelector('.category-name').textContent;
      
      // For Farms category, ensure all properties are displayed
      if (categoryName === 'Farms') {
        const farmProperties = categoryProperties['Farms'];
        console.log(`Loading ${farmProperties.length} Farm properties`);
      }
      
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
      map = new google.maps.Map(mapElement, {
        center: { lat: 22.5726, lng: 78.9629 }, // Center of India
        zoom: 5,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      });
      
      // Add property markers to the map
      const properties = document.querySelectorAll('.property');
      markers = [];
      
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
        
        // Get coordinates from our predefined Indian destinations
        let coords = null;
        for (const [key, value] of Object.entries(indianDestinations)) {
          if (location.includes(key.split(',')[0])) {
            coords = { lat: value.lat, lng: value.lng };
            break;
          }
        }
        
        // If we found coordinates, add the marker
        if (coords) {
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
        }
      });
      
      // Make sure map is visible
      mapInitialized = true;
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
    
    // Define Indian destinations with accurate coordinates
    const indianDestinations = {
      "Mumbai, Maharashtra": { lat: 19.0760, lng: 72.8777, x: 20, y: 38 },
      "Delhi, NCR": { lat: 28.6139, lng: 77.2090, x: 45, y: 25 },
      "Bangalore, Karnataka": { lat: 12.9716, lng: 77.5946, x: 38, y: 60 },
      "Chennai, Tamil Nadu": { lat: 13.0827, lng: 80.2707, x: 45, y: 70 },
      "Kolkata, West Bengal": { lat: 22.5726, lng: 88.3639, x: 65, y: 38 },
      "Hyderabad, Telangana": { lat: 17.3850, lng: 78.4867, x: 40, y: 50 },
      "Pune, Maharashtra": { lat: 18.5204, lng: 73.8567, x: 28, y: 45 },
      "Shimla, Himachal Pradesh": { lat: 31.1048, lng: 77.1734, x: 40, y: 15 },
      "Goa": { lat: 15.2993, lng: 74.1240, x: 20, y: 55 },
      "Kochi, Kerala": { lat: 9.9312, lng: 76.2673, x: 30, y: 70 },
      "Agra, Uttar Pradesh": { lat: 27.1767, lng: 78.0081, x: 50, y: 30 },
      "Jaipur, Rajasthan": { lat: 26.9124, lng: 75.7873, x: 30, y: 30 },
      "Darjeeling, West Bengal": { lat: 27.0360, lng: 88.2627, x: 70, y: 25 },
      "Varanasi, Uttar Pradesh": { lat: 25.3176, lng: 82.9739, x: 55, y: 35 },
      "Ahmedabad, Gujarat": { lat: 23.0225, lng: 72.5714, x: 25, y: 35 }
    };
    
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
        if (location.includes(key.split(',')[0])) {
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
    
    // Add better property marker styling
    const addPropertyMarkers = (data) => {
      data.forEach(property => {
        const marker = document.createElement('div');
        marker.classList.add('map-marker');
        marker.textContent = property.price;
        
        // Position marker
        marker.style.left = `${property.coordinates.x}%`;
        marker.style.top = `${property.coordinates.y}%`;
        marker.style.transform = 'translate(-50%, -50%)';
        
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
    };
    
    // Add markers to the map
    addPropertyMarkers(propertyData);
    
    console.log('Map created successfully with', propertyData.length, 'property markers');
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

  // Function to generate property data with map position info
  function getPropertiesData() {
    return [
      { id: 1, price: 139338, mapPosition: { x: 18, y: 42 } }, // Mumbai
      { id: 2, price: 119139, mapPosition: { x: 39, y: 38 } }, // Kolkata
      { id: 3, price: 214620, mapPosition: { x: 28, y: 25 } }, // Delhi
      { id: 4, price: 178350, mapPosition: { x: 20, y: 62 } }, // Bangalore
      { id: 5, price: 130000, mapPosition: { x: 16, y: 76 } }, // Kochi
      { id: 6, price: 120000, mapPosition: { x: 65, y: 35 } }, // Darjeeling
      { id: 7, price: 150000, mapPosition: { x: 48, y: 55 } }, // Hyderabad
      { id: 8, price: 136208, mapPosition: { x: 75, y: 48 } }, // Shillong
      { id: 9, price: 182952, mapPosition: { x: 22, y: 80 } }, // Kanyakumari
      { id: 10, price: 194044, mapPosition: { x: 14, y: 50 } }, // Goa
      { id: 11, price: 156780, mapPosition: { x: 30, y: 70 } }, // Chennai
      { id: 12, price: 188227, mapPosition: { x: 45, y: 42 } }, // Nagpur
      { id: 13, price: 110527, mapPosition: { x: 38, y: 67 } }, // Hampi
      { id: 14, price: 106649, mapPosition: { x: 52, y: 48 } }, // Bhopal
      { id: 15, price: 92500, mapPosition: { x: 37, y: 58 } }, // Pune
    ];
  }

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
      
      // On mobile devices, ensure the modal is positioned correctly
      if (window.innerWidth <= 767) {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        
        // Make sure the globe modal takes full height on mobile
        const globeModalContent = document.querySelector('.globe-modal-content');
        if (globeModalContent) {
          globeModalContent.style.height = window.innerHeight + 'px';
        }
        
        // Set max height for tab content to ensure it's scrollable
        const globeTabContent = document.querySelectorAll('.globe-tab-content');
        globeTabContent.forEach(content => {
          content.style.maxHeight = (window.innerHeight - 100) + 'px';
        });
      }
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
    
    // Handle orientation changes and resize events for mobile
    window.addEventListener('resize', function() {
      if (globeModal.classList.contains('show') && window.innerWidth <= 767) {
        const globeModalContent = document.querySelector('.globe-modal-content');
        if (globeModalContent) {
          globeModalContent.style.height = window.innerHeight + 'px';
        }
        
        // Adjust tab content height on resize
        const globeTabContent = document.querySelectorAll('.globe-tab-content');
        globeTabContent.forEach(content => {
          content.style.maxHeight = (window.innerHeight - 100) + 'px';
        });
      }
    });
    
    // Tab switching with proper mobile styling
    if (languageTab && currencyTab) {
      languageTab.addEventListener('click', function() {
        languageTab.classList.add('active');
        currencyTab.classList.remove('active');
        if (languageContent && currencyContent) {
          languageContent.classList.remove('hidden');
          currencyContent.classList.add('hidden');
          
          // Scroll to top of content when switching tabs
          if (window.innerWidth <= 767) {
            languageContent.scrollTop = 0;
          }
        }
      });
      
      currencyTab.addEventListener('click', function() {
        currencyTab.classList.add('active');
        languageTab.classList.remove('active');
        if (currencyContent && languageContent) {
          currencyContent.classList.remove('hidden');
          languageContent.classList.add('hidden');
          
          // Scroll to top of content when switching tabs
          if (window.innerWidth <= 767) {
            currencyContent.scrollTop = 0;
          }
        }
      });
    }
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

  // Hamburger Menu Functionality for Mobile
  const hamburgerBtn = document.querySelector('.hamburger-menu-btn');
  const mobileMenu = document.querySelector('.mobile-category-menu');
  const closeMenuBtn = document.querySelector('.close-menu-btn');
  const menuOverlay = document.querySelector('.menu-overlay');
  const mobileCategoriesList = document.querySelector('.mobile-categories-list');
  
  // Keep hamburger visible when scrolling (only on mobile)
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    if (window.innerWidth <= 767 && hamburgerBtn) {
      const st = window.scrollY || document.documentElement.scrollTop;
      
      // Ensure hamburger is always visible
      hamburgerBtn.style.opacity = '1';
      
      // Adjust position to stay in view
      if (st > 60) {
        hamburgerBtn.style.top = '10px';
        hamburgerBtn.style.position = 'fixed';
      } else {
        hamburgerBtn.style.top = '18px';
      }
      
      lastScrollTop = st;
    }
  });
  
  // Function to open mobile menu
  function openMobileMenu() {
    hamburgerBtn.classList.add('open');
    mobileMenu.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Trigger reflow before adding the open class for animation
    mobileMenu.offsetHeight;
    
    mobileMenu.classList.add('open');
    menuOverlay.classList.add('open');
    
    // Populate mobile categories list if it's empty
    if (mobileCategoriesList && mobileCategoriesList.children.length === 0) {
      populateMobileCategoriesList();
    }
  }
  
  // Function to close mobile menu
  function closeMobileMenu() {
    hamburgerBtn.classList.remove('open');
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      mobileMenu.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
  
  // Function to populate mobile categories list
  function populateMobileCategoriesList() {
    // Clear existing items
    mobileCategoriesList.innerHTML = '';
    
    // Get all category names from the main category list
    const categoryItems = document.querySelectorAll('.category');
    
    categoryItems.forEach(category => {
      const categoryName = category.querySelector('.category-name').textContent;
      const categoryIcon = category.querySelector('.category-icon img').cloneNode(true);
      const isActive = category.classList.contains('active');
      
      // Create mobile category item
      const li = document.createElement('li');
      li.className = 'mobile-category-item';
      if (isActive) li.classList.add('active');
      
      // Create icon container
      const iconDiv = document.createElement('div');
      iconDiv.className = 'mobile-category-icon';
      iconDiv.appendChild(categoryIcon);
      
      // Create name span
      const nameSpan = document.createElement('span');
      nameSpan.textContent = categoryName;
      
      // Append elements
      li.appendChild(iconDiv);
      li.appendChild(nameSpan);
      
      // Add click event to handle category selection
      li.addEventListener('click', function() {
        // Find the corresponding main category and click it
        categoryItems.forEach(mainCategory => {
          if (mainCategory.querySelector('.category-name').textContent === categoryName) {
            mainCategory.click();
            
            // Update active state in mobile menu
            document.querySelectorAll('.mobile-category-item').forEach(item => {
              item.classList.remove('active');
            });
            li.classList.add('active');
            
            // Close the mobile menu after selection
            closeMobileMenu();
          }
        });
      });
      
      mobileCategoriesList.appendChild(li);
    });
  }

  // Event listeners for mobile menu
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileMenu);
  }
  
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMobileMenu);
  }
  
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMobileMenu);
  }
  
  // Close menu on resize if screen gets bigger
  window.addEventListener('resize', function() {
    if (window.innerWidth > 767 && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });
  
  // Listen for category changes in main interface to update mobile menu
  const categoryChangedEvent = new CustomEvent('categoryChanged');
  document.addEventListener('categoryChanged', function() {
    if (mobileCategoriesList) {
      const activeCategory = document.querySelector('.category.active');
      if (activeCategory) {
        const activeCategoryName = activeCategory.querySelector('.category-name').textContent;
        
        document.querySelectorAll('.mobile-category-item').forEach(item => {
          const itemName = item.querySelector('span').textContent;
          if (itemName === activeCategoryName) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    }
  });

  // Display search results - Modify to preserve all Farm properties
  function displaySearchResults(results, searchTerm) {
    // Get properties containers
    const propertiesContainers = document.querySelectorAll('.properties');
    
    // Store current category to restore it if needed
    const activeCategory = document.querySelector('.category.active');
    const activeCategoryName = activeCategory ? activeCategory.querySelector('.category-name').textContent : '';
    
    // Clear containers
    propertiesContainers.forEach(container => {
      container.innerHTML = '';
    });
    
    // If no results, show message and restore original category view
    if (results.length === 0) {
      const firstContainer = propertiesContainers[0];
      firstContainer.innerHTML = `
        <div class="no-results">
          <h3>No results found for "${searchTerm}"</h3>
          <p>Try searching for something else or browse categories.</p>
        </div>
      `;
      
      // Fallback to showing all farms if there are no search results
      setTimeout(() => {
        if (activeCategoryName === 'Farms') {
          updateProperties('Farms');
        }
      }, 5000);
      
      return;
    }
    
    // Display search results
    const firstContainer = propertiesContainers[0];
    let resultsHTML = '';
    
    // Add search results heading
    resultsHTML += `
      <div class="search-results-header">
        <h2>Results for "${searchTerm}"</h2>
        <p>${results.length} properties found</p>
      </div>
    `;
    
    // Add properties
    results.forEach(property => {
      resultsHTML += createPropertyHTML(property);
    });
    
    firstContainer.innerHTML = resultsHTML;
    
    // Initialize property interactions
    initializePropertyInteractions();
  }

  // Keep hamburger menu button fixed when scrolling
  window.addEventListener('scroll', function() {
    const hamburgerBtn = document.querySelector('.hamburger-menu-btn');
    
    if (window.innerWidth <= 767 && hamburgerBtn) {
      if (window.scrollY > 50) {
        hamburgerBtn.classList.add('fixed');
      } else {
        hamburgerBtn.classList.remove('fixed');
      }
    }
  });

  // Globe button and language/currency modal handling
  if (languageTab && currencyTab) {
    languageTab.addEventListener('click', function() {
      languageTab.classList.add('active');
      currencyTab.classList.remove('active');
      if (languageContent && currencyContent) {
        languageContent.classList.remove('hidden');
        currencyContent.classList.add('hidden');
        
        // Scroll to top of content when switching tabs
        if (window.innerWidth <= 767) {
          languageContent.scrollTop = 0;
        }
      }
    });
    
    currencyTab.addEventListener('click', function() {
      currencyTab.classList.add('active');
      languageTab.classList.remove('active');
      if (currencyContent && languageContent) {
        currencyContent.classList.remove('hidden');
        languageContent.classList.add('hidden');
        
        // Scroll to top of content when switching tabs
        if (window.innerWidth <= 767) {
          currencyContent.scrollTop = 0;
        }
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
    if (typeof mapInitialized !== 'undefined' && mapInitialized && typeof markers !== 'undefined' && markers.length > 0 && typeof google !== 'undefined' && google && google.maps) {
      markers.forEach(marker => {
        const originalPrice = marker.originalPrice || '10000';
        const numericPrice = parseFloat(originalPrice.replace(/[^\d.]/g, ''));
        const newPrice = numericPrice * conversionRate;
        const formattedPrice = `${newSymbol}${Math.round(newPrice).toLocaleString('en-IN')}`;
        
        // If we have marker icon update logic, update it here
        if (marker.setIcon && marker.icon) {
          // Update price on marker
          const newIcon = createPriceMarkerIcon(formattedPrice);
          marker.setIcon(newIcon);
        }
        
        // If we have info window with price, update it
        if (marker.infoWindow && marker.infoWindow.setContent) {
          const content = marker.infoWindow.getContent();
          if (content) {
            const updatedContent = content.replace(
              /(<span[^>]*>)[^<]+(<\/span>)/,
              `$1${formattedPrice}$2`
            );
            marker.infoWindow.setContent(updatedContent);
          }
        }
      });
    }
  }

  // Helper function to create price marker icon
  function createPriceMarkerIcon(price) {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#FF385C',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 12,
      labelOrigin: new google.maps.Point(0, 0)
    };
  }
});
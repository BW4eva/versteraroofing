document.addEventListener('DOMContentLoaded', function() {
    const navigationHTML = `
        <div class="container header-content">
            <div class="logo">
                <div class="logo-icon">
                    <a href="index.html">
                    <picture>
                        <source type="image/png" srcset="assets/Verstera-Roofing_BLK-MULTI_ctr.png">
                        <img src="assets/Verstera-Roofing_BLK-MULTI_ctr.png" alt="Verstera Roofing Logo" height="200px" width="482px"/>
                    </picture>
                    </a>
                </div>
            </div>
            <nav>
                <ul>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle">Services</a>
                        <ul class="dropdown-menu">
                            <li><a href="residential-roofing.html">Residential Roofing</a></li>
                            <li><a href="commercial-roofing.html">Commercial Roofing</a></li>
                            <li><a href="roof-maintenance.html">Roof Maintenance Services</a></li>
                            <li><a href="damage-repair.html">Hail & Wind Damage Repair</a></li>
                            <li><a href="leak-repair.html">Leak Repair</a></li>
                            <li><a href="tile-roofs.html">Tile Roofs</a></li>
                            <li><a href="metal-roofs.html">Metal Roofs</a></li>
                            <li><a href="stone-coated-steel-metal-shingle-roofing.html">Stone Coated Steel Roofs</a></li>
                            <!-- Add new services here in one place -->
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle">Locations</a>
                        <ul class="dropdown-menu">
                            <li><a href="austin-texas.html">Austin</a></li>
                            <li><a href="easton-park-south-austin-texas.html">Easton Park | Austin</a></li>
                            <li><a href="round-rock-texas.html">Round Rock</a></li>
                            <li><a href="georgetown-texas.html">Georgetown</a></li>
                            <li><a href="leander-texas.html">Leander</a></li>
                            <li><a href="cedar-park-texas.html">Cedar Park</a></li>
                            <li><a href="liberty-hill-texas.html">Liberty Hill</a></li>
                            <li><a href="harker-heights-texas.html">Harker Heights</a></li>
                            <li><a href="san-antonio-texas.html">San Antonio</a></li>
                            <li><a href="bell-county.html">Bell County</a></li>
                            <li><a href="travis-county.html">Travis County</a></li>
                            <li><a href="williamson-county.html">Williamson County</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle">About</a>
                        <ul class="dropdown-menu">
                            <li><a href="instant-roof-estimate.html">Instant Estimate</a></li>       
                            <li><a href="gallery.html">Project Gallery</a></li>
                            <li><a href="blog.html">Learning Center/Blog</a></li>
                            <li><a href="blog-roofing-FAQs.html">Roofing FAQs</a></li>
                            <li><a href="financing.html">Financing</a></li>
                            <li><a href="roofing-certifications.html">Certifications & Memberships</a></li>
                            <li><a href="reviews-and-testimonials.html">Reviews & Testimonials</a></li>
                            <li><a href="trust-and-security.html">Trust and Security</a></li>
                            <li><a href="careers.html">Careers</a></li>
                            <li><a href="index.html#about">About Us</a></li>
                        </ul>
                    </li>
                    <li class="tel"><a href="tel:5125406388">Call ✆</a></li>
                </ul>
            </nav>
            <div class="mobile-contact-button">
                <a href="https://versteraroofing.com/instant-roof-estimate.html" class="btn">Get Free Instant Estimate</a>
            </div>
        </div>
    `;

    // Find the header element and insert the navigation
    document.querySelector('header').innerHTML = navigationHTML;

    // Add the dropdown toggle functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    if (dropdownToggles) {
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('active');
            });
        });
    }

    // Add the sticky nav
    const stickyNav = document.createElement('div');
    stickyNav.className = 'sticky-mobile-nav';
    
    // Clone the CTA button for the sticky nav
    const ctaButton = document.querySelector('.mobile-contact-button .btn').cloneNode(true);
    stickyNav.appendChild(ctaButton);
    
    // Add the sticky nav to the body
    document.body.appendChild(stickyNav);
    
    // Show/hide sticky nav based on scroll position
    window.addEventListener('scroll', function() {
        // Get the bottom position of the header
        const headerBottom = document.querySelector('header').getBoundingClientRect().bottom;
        
        // If we've scrolled past the header, show the sticky nav
        if (headerBottom < 0) {
            stickyNav.classList.add('visible');
        } else {
            stickyNav.classList.remove('visible');
        }
    });
});


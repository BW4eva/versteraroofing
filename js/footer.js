document.addEventListener('DOMContentLoaded', function() {
    const footerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-column">
                    <!-- <h3>Verstera Roofing</h3> -->
                   <!-- <p>Providing superior roofing solutions with integrity and excellence.</p> -->
                   
                </div>
                <div class="footer-column">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="index.html#services">Services</a></li>
                        <li><a href="index.html#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Locations</h3>
                    <ul>
                        <li><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109907.85808762973!2d-97.88540530273437!3d30.588255000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe8378ec716b107%3A0xad97f3a517d3a80b!2sGreen%20Shield%20Roofing!5e0!3m2!1sen!2sus!4v1762198437236!5m2!1sen!2sus" width="200" height="200" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></li>
                          <!--<li><a href="guadalupe-county.html">Guadalupe County</a></li>-->
                         <!-- <li><a href="bell-county.html">Bell County</a></li>-->
                         <!-- <li><a href="travis-county.html">Travis County</a></li>-->
                         <!-- <li><a href="bexar-county.html">Bexar County</a></li>-->
                         <!-- <li><a href="williamson-county.html">Williamson County</a></li>-->
                          <!--<li><a href="comal-county.html">Comal County</a></li>-->
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Services</h3>
                    <ul>
                        <li><a href="residential-roofing.html">Residential Roofing</a></li>
                        <li><a href="commercial-roofing.html">Commercial Roofing</a></li>
                        <li><a href="damage-repair.html">Hail & Wind Damage Repair</a></li>
                        <li><a href="leak-repair.html">Leak Repair</a></li>
                        <li><a href="tile-roofs.html">Tile Roofs</a></li>
                        <li><a href="metal-roofs.html">Metal Roofs</a></li>
                        <li><a href="stone-coated-steel-metal-shingle-roofing.html">Stone Coated Steel Roofs</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Contact Info</h3>
                    <ul>
                        <li class="tel"><a href="tel:5125406388">Phone:(512) 540-6388</a></li>
                        <li>Email: contact@versteraroofing.com</li>
                        
                    </ul>
                </div>
            </div>
            <div class="copyright">
                <p>&copy; 2026 Verstera Roofing. All Rights Reserved.</p>
         </div>
        </div>
    `;

    // Find the footer element and insert the content
    document.querySelector('footer').innerHTML = footerHTML;
});

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
                        <li><iframe src="https://www.google.com/maps/place/Verstera+Roofing/@30.588255,-97.73297,242401m/data=!3m2!1e3!4b1!4m6!3m5!1s0xe8378ec716b107:0xad97f3a517d3a80b!8m2!3d30.588255!4d-97.73297!16s%2Fg%2F11xfhkml7p?hl=en&entry=ttu&g_ep=EgoyMDI2MDMzMC4wIKXMDSoASAFQAw%3D%3D"></iframe></li>
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

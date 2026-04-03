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
                         <li><a href="austin-texas.html">Austin</a></li>
                         <li><a href="round-rock-texas.html">Round Rock</a></li>
                         <li><a href="georgetown-texas.html">Georgetown</a></li>
                         <li><a href="leander-texas.html">Leander</a></li>
                         <li><a href="cedar-park-texas.html">Cedar Park</a></li>
                         <li><a href="liberty-hill-texas.html">Liberty Hill</a></li>
                         <li><a href="harker-heights-texas.html">Harker Heights</a></li>
                         <li><a href="san-antonio-texas.html">San Antonio</a></li>
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

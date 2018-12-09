(function() { 

  // Function to quicly refresh the page
  window.refresh = () => { window.location.href='?r='+(+new Date()); };

  var checkMobile = (width) => { return width <= 768; };

  // If the device is mobile and in landscape,
  // show the cover prompting to change to portrait
  var warnedLandscape = false;

  var is_iPad = navigator.userAgent.match(/iPad/i) != null;

  var checkLandscape = () => {
    if (/Mobi/.test(navigator.userAgent) && !is_iPad) {
      if (window.matchMedia("(orientation: landscape)").matches) {
        document.getElementById("landscapeCover").style.display = "block";
        warnedLandscape = true;
      } else {
        if (warnedLandscape) {
          warnedLandscape = false;
          window.refresh();
        }
      }
    }
  }
  checkLandscape();

  var currentW = window.outerWidth;
  window.onresize = function() {
    checkLandscape();
    if (checkMobile(window.outerWidth) != checkMobile(currentW)) {
      // Show "must reload message"
      document.getElementById("sizeCover").style.display = "block";
      currentW = window.outerWidth;
    }
  };

  // Add isMobile global variable to affect the code elsewhere
  var isMobile = window.matchMedia("(max-width: 768px)");
  window.isMobile = isMobile.matches;
  console.log(window.isMobile);
  
  // Fix for changing viewport heights on mobile.
  // ============================================

  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
})()
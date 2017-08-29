function homepageheader()
{
html = 
'<div class="banner">'+
'<img src="images/DTbanner.jpg" width="465" height="63" alt="GSA logo for Fleet Drive-thru">'+
'<div class="logoutbutton"><a href="#">Logout</a></div>'+
'<div class="welcome">Welcome: Firstname Lastname'+
'</div>'+
'</div>'+
'<div class="navbar navbar-default">'+
'<div class="navbar-header" role="navigation">'+
'<button type="button" title="Main Navigation" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">'+
'<span class="icon-bar"></span>'+
'<span class="icon-bar"></span>'+
'<span class="icon-bar"></span>'+
'</button>'+
'</div>'+
'<div class="collapse navbar-collapse">'+
'<ul class="nav navbar-nav">'+
'<li><a href="#">Main Menu</a></li>'+
'<li><a href="#">Defensive Driving Course</a></li>'+
'<li><a href="#">Fleet News</a></li>'+
'<li class="dropdown">'+
'<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Customer Guides&nbsp;<span class="caret"></span></a>'+
'<ul class="dropdown-menu">'+
'<li><a href="#">Customer Guide Title1</a></li>'+
'<li role="separator" class="divider"></li>'+
'<li><a href="#">Customer Guide Title1</a></li>'+
'<li role="separator" class="divider"></li>'+
'<li><a href="#">Customer Guide Title1</a></li>'+
'</ul>'+
'</li>'+
'<li><a href="#">Training</a></li>'+
'<li><a href="#">About Fleet</a></li>'+
'<li><a href="#">Contact Us</a></li>'+
'<li><a href="#">FAQs</a></li>'+
'</ul>'+
'<ul class="nav navbar-nav navbar-right">'+
'<li><a href="#">Help</a></li>'+
'</ul>'+
'</div>'+
'</div>';
document.write (html);
}
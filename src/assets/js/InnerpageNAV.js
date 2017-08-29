function showDiv(d) {
	d.style.visibility = "visible";
}

function hideDiv(d) {
	d.style.visibility = "hidden";
}

function nextElementSibling( el ) {
    do { el = el.nextSibling } while ( el && el.nodeType !== 1 );
    return el;
}

function menuShow(e) {
	var ev = window.event || e;
	var keyCode = ev.keyCode || ev.which; 
	var nextEl = e.nextElementSibling || nextElementSibling(e);
	
	switch (keyCode) {
	case 13:
	case 32:  //enter or space to toggle
		//ev.preventDefault();
		ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
		if (nextEl.style.visibility == "visible") {
			hideDiv(nextEl)
		} else {
			showDiv(nextEl)
		}
		return false;
		break;
	case 9: //tab
		if (ev.shiftKey) {
			hideDiv(nextEl)
			return true;
		}
		break;
	default:
		return true;
	}
}

function menuHide(e) {
	var ev = window.event || e;
	var keyCode = ev.keyCode || ev.which; 

	if (keyCode == 9) {
		if (!ev.shiftKey)
			hideDiv(e.parentNode.parentNode.parentNode);
	}
}

function menuMouseIn(e) {
	var nextEl = e.nextElementSibling || nextElementSibling(e);
	showDiv(nextEl)
}

function menuMouseOut(e) {
	var nextEl = e.nextElementSibling || nextElementSibling(e);
	hideDiv(nextEl)
}

function InnerpageNAV()
{

html = 

'<div class="navigation-Container">'+
'	<ul class="navLinks" style="float: left;">'+
'		<li><a href="#" title="Main Menu" onclick="javascript:innerpageNAVSubmitForm(' + homeLink1 + ');">MAIN MENU</a></li>'+
'	</ul>'+
'	<div id="menu">'+
'		<ul class="menu">'+
''+
'			<li><a href="#" title="Vehicle Data" class="arrow" onKeyDown="menuShow(this)" onMouseOver="menuMouseIn(this)" onMouseOut="menuMouseOut(this)">VEHICLE DATA</a>'+
'				<div onMouseOver="showDiv(this)" onMouseOut="hideDiv(this)">'+
'					<ul>'+
'						<li><a href="#" title="Vehicle Detail"          onclick="javascript:innerpageNAVSubmitForm(' + vehicleDetailLink + ');">        <span>Vehicle Detail</span></a></li>'+
'						<li><a href="#" title="Vehicle Upload"          onclick="javascript:innerpageNAVSubmitForm(' + vehicleUploadLink + ');">        <span>Vehicle Detail Upload Tool</span></a></li>'+
'						<li><a href="#" title="Mileage Reporting"       onclick="javascript:innerpageNAVSubmitForm(' + mileageReportLink + ');">        <span>Mileage Reporting</span></a></li>'+
'						<li><a href="#" title="Mileage History"         onclick="javascript:innerpageNAVSubmitForm(' + mileageHistoryRecordLink + ');"> <span>Mileage History Record</span></a></li>'+
'						<li><a href="#" title="Mileage Upload"          onclick="javascript:innerpageNAVSubmitForm(' + mileageHistoryUploadLink + ');"> <span>Mileage Upload Tool</span></a></li>'+
'						<li><a href="#" title="Vehicle Expense List"    onclick="javascript:innerpageNAVSubmitForm(' + vehicleExpenseListLink + ');">   <span>Expense List</span></a></li>'+
'						<li><a href="#" title="Vehicle Expense Details" onclick="javascript:innerpageNAVSubmitForm(' + vehicleExpenseRecordsLink + ');"><span>Expense Records</span></a></li>'+
'						<li><a href="#" title="Vehicle Expense Upload"  onclick="javascript:innerpageNAVSubmitForm(' + vehicleUploadExpensesLink + ');" onKeyDown="menuHide(this)"><span>Upload Expense Records</span></a></li>'+
'					</ul>'+
'				</div>'+
'			</li>'+
''+
'			<li><a href="#" title="Maintenance and Repair" class="arrow" onKeyDown="menuShow(this)" onMouseOver="menuMouseIn(this)" onMouseOut="menuMouseOut(this)">MAINTENANCE &amp; REPAIR</a>'+
'				<div onMouseOver="showDiv(this)" onMouseOut="hideDiv(this)">'+
'					<ul>'+
'						<li><a href="#" title="Warranty and Maintenance" onclick="javascript:innerpageNAVSubmitForm(' + warrantyAndMaintenanceInformationLink + ');"> <span>Warranty and Maintenance</span></a></li>'+
'						<li><a href="#" title="Repair Order"             onclick="javascript:innerpageNAVSubmitForm(' + repairOrderLink + ');">                       <span>Repair Order</span></a></li>'+
'						<li><a href="#" title="Repair History"           onclick="javascript:innerpageNAVSubmitForm(' + repairHistoryListLink + ');">                 <span>Repair Order List</span></a></li>'+
'						<li><a href="#" title="Recall History"           onclick="javascript:innerpageNAVSubmitForm(' + recallHistoryLink + ');" onKeyDown="menuHide(this)">                 <span>Recall History</span></a></li>'+
'					</ul>'+
'				</div>'+
'			</li>'+
''+
'			<li><a href="#" title="Reports" class="arrow" onKeyDown="menuShow(this)" onMouseOver="menuMouseIn(this)" onMouseOut="menuMouseOut(this)">REPORTS</a>'+
'				<div onMouseOver="showDiv(this)" onMouseOut="hideDiv(this)">'+
'					<ul>'+
'						<li><a href="#" title="Vehicle Inventory Report"   onclick="javascript:innerpageNAVSubmitForm(' + vehicleInventoryReportCustomizedLink + ');">  <span>Inventory</span></a></li>'+
//'						<li><a href="#" title="Vehicle Inventory Report - Preformatted" onclick="javascript:innerpageNAVSubmitForm(' + vehicleInventoryReportPreformattedLink + ');"><span>Inventory (Preformatted)</span></a></li>'+
'						<li><a href="#" title="Vehicle Mileage Report"       onclick="javascript:innerpageNAVSubmitForm(' + vehicleMileageReportPreformattedLink + ');">  <span>Mileage</span></a></li>'+
'						<li><a href="#" title="Vehicle Expense Report"       onclick="javascript:innerpageNAVSubmitForm(' + vehicleExpenseReportPreformattedLink + ');">  <span>Expense</span></a></li>'+
'						<li><a href="#" title="Repair Order"                 onclick="javascript:innerpageNAVSubmitForm(' + maintenanceAndRepairReportLink + ');">        <span>Repair Order</span></a></li>'+
'						<li><a href="#" title="Fuel Use Report"              onclick="javascript:innerpageNAVSubmitForm(' + vehicleFuelUseReportLink + ');">              <span>Fuel Use</span></a></li>'+
'						<li><a href="#" title="GORP Exception Report"        onclick="javascript:innerpageNAVSubmitForm(' + vehicleGORPexceptionsReportLink + ');">   <span>GORP Exception Report</span></a></li>'+
'						<li><a href="#" title="recall Report"                onclick="javascript:innerpageNAVSubmitForm(' + recallReportLink + ');" onKeyDown="menuHide(this)">   <span>Recall </span></a></li>'+

'					</ul>'+
'				</div>'+
'			</li>'+

''+
'			<li><a href="#" title="F.A.S.T." class="arrow" onKeyDown="menuShow(this)" onMouseOver="menuMouseIn(this)" onMouseOut="menuMouseOut(this)">FAST</a>'+
'				<div onMouseOver="showDiv(this)" onMouseOut="hideDiv(this)">'+
'					<ul>'+
'						<li><a href="#" title="FAST Data Elements" onclick="javascript:innerpageNAVSubmitForm(' + FASTDataEmentsLink + ');">           <span>FAST Data Elements Query</span></a></li>'+
'						<li><a href="#" title="FAST Data Center"   onclick="javascript:innerpageNAVSubmitForm(' + FASSTDataCenterLink + ');" onKeyDown="menuHide(this)">          <span>FAST Data Center</span></a></li>'+
'					</ul>'+
'				</div>'+
'			</li>'+

''+
'			<li><a href="#" title="Security" class="arrow" onKeyDown="menuShow(this)" onMouseOver="menuMouseIn(this)" onMouseOut="menuMouseOut(this)">SECURITY</a>'+
'				<div onMouseOver="showDiv(this)" onMouseOut="hideDiv(this)">'+
'					<ul>'+
'						<li><a href="#" title="My Account"      onclick="javascript:innerpageNAVSubmitForm(' + myAccountLink + ');">           <span>My Account</span></a></li>'+
'						<li><a href="#" title="Manage Accounts" onclick="javascript:innerpageNAVSubmitForm(' + accountManagementLink + ');" onKeyDown="menuHide(this)">   <span>Account Management</span></a></li>'+
'					</ul>'+
'				</div>'+
'			</li>'+
''+

'		</ul>'+
'	</div>'+
''+
'	<ul class="navLinks float-right">'+
'		<li><a href="#" title="About Us"   onclick="openAboutUs()">ABOUT US</a></li>'+
'		<li><a href="#" title="Contact Us" onclick="openContactUs()">CONTACT US</a></li>'+
'	</ul>'+
''+
'</div>';

document.write (html);
}


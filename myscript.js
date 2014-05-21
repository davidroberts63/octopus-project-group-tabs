var octopusGrouping = {

	tabsContainer: null,
	groupingSuffix: '-grouping',
	pillSuffix: '-pill',

	groupingId: function(groupName)
	{
		return groupName.toLowerCase().replace(/[^a-zA-Z-0-9]/g,'') + this.groupingSuffix;
	},

	pillId: function(groupName)
	{
		if (groupName.slice(0 - this.groupingSuffix.length) == this.groupingSuffix) {
			// This handles cases where the groupName is already the actual id.
			return groupName + this.pillSuffix;
		} else {
			// Cleans up the group name to be a valid id.
			return this.groupingId(groupName) + '-pill';
		}
	},

	createButton: function(groupName)
	{
		var item = document.createElement('li');
		item.id = this.pillId(groupName);

		var pill = document.createElement('a');
		pill.innerHTML = '<h3 class="no-border no-margin">' + groupName + "</h3>";
		pill.addEventListener('click', this.changeGrouping);
		pill.setAttribute('grouping-id', this.groupingId(groupName));
		pill.setAttribute('style', 'cursor: pointer !important;');

		item.appendChild(pill);

		return item;		
	},

	changeGrouping: function (event)
	{
		var selectedGroupId = event.target.parentNode.getAttribute('grouping-id');
		
		console.info("Change grouping for " + selectedGroupId);

		var fastboard = document.getElementsByTagName('FASTBOARD')[0];
		var selectedGroup = '';
		
		for(var i = 0; i < fastboard.childNodes.length; i++) {
		
			var groupNode = fastboard.childNodes[i];
			var pill = document.getElementById(octopusGrouping.pillId(groupNode.id));

			// Show or hide the selected project group section.
			if (groupNode.id == selectedGroupId 
				|| selectedGroupId == 'all-grouping') {

				console.log("Showing " + groupNode.id);
				groupNode.style.display = 'block';

			} else {
				
				console.log("Hiding " + groupNode.id);
				groupNode.style.display = 'none';

			}
			
			// Set the active project group pill.
			if (groupNode.id == selectedGroupId) {

				console.log("Active pill for " + pill.id);
				pill.setAttribute('class', 'active');

			} else {
				
				console.log("Inactive pill for " + pill.id);
				pill.setAttribute('class', '');

			}		

			// Set the all project groups pill if appropriate.
			if (selectedGroupId == 'all-grouping') {
				
				console.log("Active pill for all");
				document.getElementById('all-grouping-pill').setAttribute('class', 'active');
				octopusGrouping.toggleGroupHeaders(true);

			} else {

				console.log("Inactive pill for all");
				document.getElementById('all-grouping-pill').setAttribute('class', '');
				octopusGrouping.toggleGroupHeaders(false);

			}
		}

		event.stopPropagation(); 
		event.stopImmediatePropagation();
		return false;
	},

	addToTabsNav: function(item)
	{
		this.tabsContainer.appendChild(item);
	},

	findNodeByClassName: function(nodeSet, className)
	{
		for(var i = 0; i < nodeSet.length; i++) {
			
			if (nodeSet[i].nodeType != 1) continue; // Skip non element nodes.

			var node = nodeSet[i];
			var nodeClass = node.getAttribute('class') || '';

			if (nodeClass.indexOf(className) > -1)
			{
				return node;
			}

			var subtree = this.findNodeByClassName(node.childNodes, className);
			if (subtree) return subtree;
		}
	},

	toggleGroupHeaders: function(display)
	{
		var fastboard = document.getElementsByTagName('FASTBOARD')[0];
		var groupHeaders = fastboard.getElementsByTagName('H3');

		for(var i = 0; i < groupHeaders.length; i++) {

			var header = groupHeaders[i];
			console.log(header.parentNode);
			if (display) {

				console.log('Toggle ' + header.parentNode.id + ' to visible.');
				header.style.display = 'block';

			} else {

				console.log('Toggle ' + header.parentNode.id + ' to hidden.');
				header.style.display = 'none';

			}
		}
	}
}

function start()
{
	console.log(window.location);
	var dashboardTitle = document.getElementById("title");
	var body = document.getElementById("body");

	octopusGrouping.tabsContainer = document.createElement("ul");
	octopusGrouping.tabsContainer.id = "group-tabs";
	octopusGrouping.tabsContainer.className = "nav nav-tabs nav-inline";
	octopusGrouping.tabsContainer.setAttribute('style', 'border-bottom: 0px;');

	body.insertBefore(octopusGrouping.tabsContainer, dashboardTitle.nextSibling);

	body.addEventListener(
		"DOMNodeInserted", nodeInsertion );

	var all = octopusGrouping.createButton("All");
	octopusGrouping.addToTabsNav(all);
}

function nodeInsertion(event)
{
	// Catch Angular adding the project group elements on the fly.

	var node = event.target;
	
	if (node.parentNode.tagName == 'FASTBOARD') {
		
		var projectHeader = node.getElementsByTagName("h3")[0];
		var grouping = projectHeader.innerText;

		var groupButton = octopusGrouping.createButton(grouping);
		octopusGrouping.addToTabsNav(groupButton);

		// Set the group id for easier showing/hiding of group later on.
		node.setAttribute('id', octopusGrouping.groupingId(grouping));
	}

}

start();

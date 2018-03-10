frappe.ui.form.on("Sales Order","refresh", function(){
			for (var i =0; i < cur_frm.doc.items.length; i++){
					cur_frm.doc.items[i].cost_center = cur_frm.doc.cost_center
					}
						cur_frm.refresh_field('items')
});


frappe.ui.form.on("Sales Order", "refresh", function(frm) {cur_frm.fields_dict['items'].grid.get_field('warehouse').get_query = function(doc) {
        return {
            filters: [[
                'Warehouse', 'is_group', '=', "0"
            ]]
		//filters: {
		//	"divison": doc.item_group_allowed,
		//	"company":doc.company
		//}
        }
    };
});
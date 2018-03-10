frappe.ui.form.on('Sales Invoice', {
	refresh: function(frm) {
		var me = this;
		if(frm.doc.docstatus&&frm.doc.outstanding_amount!=0 && !cint(frm.doc.is_return)) {
			cur_frm.add_custom_button(__("Create Entry Of Receipt"),
				function() {
							console.log("in payment_entry");
							cur_frm.cscript.make_payment_entry_custom();

				})
			};
			
	},
});
cur_frm.cscript.make_payment_entry_custom = function() {
		console.log("in payment_entry222");
		return frappe.call({
			method: "criscoconsulting.criscoconsulting.doctype.entry_of_receipt.entry_of_receipt.get_payment_entry",
			args: {
				"dt": cur_frm.doc.doctype,
				"dn": cur_frm.doc.name
			},
			callback: function(r) {
				var doclist = frappe.model.sync(r.message);
				frappe.set_route("Form", doclist[0].doctype, doclist[0].name);
				// cur_frm.refresh_fields()
			}
		});
}


cur_frm.fields_dict['project'].get_query = function(doc) {
	return {
		filters: {
			"customer": doc.customer 
		}
	}
}

frappe.ui.form.on("Sales Invoice","refresh", function(){
			for (var i =0; i < cur_frm.doc.items.length; i++){
					cur_frm.doc.items[i].cost_center = cur_frm.doc.cost_center;
				
					}
						cur_frm.refresh_field('items')
});



frappe.ui.form.on("Sales Invoice", "refresh", function(frm) {cur_frm.fields_dict['items'].grid.get_field('warehouse').get_query = function(doc) {
        return {
            filters: [[
                'Warehouse', 'is_group', '=', "0"
            ]]
		
        }
    };
});

cur_frm.fields_dict['sales_order'].get_query = function(doc) {
	return {
		filters: {
			"customer": doc.customer 
		}
	}
}
cur_frm.add_fetch("cost_center","debit_to","debit_to")
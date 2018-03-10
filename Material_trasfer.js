frappe.ui.form.on("Material Transfer", "validate", function(frm, cdt, cdn) {
	var t=cur_frm.doc.material_transfer_type ;
	  default_transit_warehouse = 'aa'
	  frappe.call({
	         method: "frappe.client.get_value",
	                async:false,
	         args: {
	             doctype: "Company",
	             fieldname: "default_transit_warehouse",
	             filters: { name: cur_frm.doc.company },
	         },
	          callback: function(res){
	            if (res && res.message){
	            default_transit_warehouse=res.message['default_transit_warehouse']
	                          
	            }
	        }   
	});

	if (cur_frm.doc.purpose == "Material Transfer"){
		if( cur_frm.doc.material_transfer_type == "Send"){
			cur_frm.set_value("to_warehouse", default_transit_warehouse);
		}
		if( cur_frm.doc.material_transfer_type == "Receive"){
			cur_frm.set_value("from_warehouse", default_transit_warehouse);
		}
	}

	if( cur_frm.doc.receiver != frappe.session.user_email ){
		if( cur_frm.doc.material_transfer_type == "Receive" ){
			frappe.throw("Receiver and Logged in User should be same")
		}
	}
	if( cur_frm.doc.to_warehouse == cur_frm.doc.from_warehouse ){
		frappe.throw("Receiver Warehouse and Target Tarehouse shoud not be same");
	}
	if(cur_frm.doc.material_transfer_type == "Receive"){
		cur_frm.set_df_property("material_transfer_type", "read_only", 1);
		cur_frm.set_df_property("from_warehouse", "read_only", 1);

	}
	else{
		cur_frm.set_df_property("material_transfer_type", "read_only", 0) 
		cur_frm.set_df_property("from_warehouse", "read_only", 0) 

	}

});
frappe.ui.form.on("Material Transfer", "material_transfer_type", function(frm, cdt, cdn) {
	var t=cur_frm.doc.material_transfer_type ;
	var t=cur_frm.doc.material_transfer_type ;
	default_transit_warehouse = 'aa'
	frappe.call({
	        method: "frappe.client.get_value",
	                async:false,
	        args: {
	             doctype: "Company",
	             fieldname: "default_transit_warehouse",
	             filters: { name: cur_frm.doc.company },
	        },
	        callback: function(res){
	            if (res && res.message){
	            default_transit_warehouse=res.message['default_transit_warehouse']
	                          
	            }
	        }   
	});
	  
	if (cur_frm.doc.purpose == "Material Transfer"){
		if( cur_frm.doc.material_transfer_type == "Send"){
			cur_frm.set_value("to_warehouse", default_transit_warehouse);
		}
		if( cur_frm.doc.material_transfer_type == "Receive"){
			cur_frm.set_value("from_warehouse", default_transit_warehouse);
		}
	}
});



frappe.ui.form.on("Material Transfer", "refresh", function(frm, cdt, cdn) {


	if(cur_frm.doc.material_transfer_type == "Receive"){
		cur_frm.set_df_property("material_transfer_type", "read_only", 1);
		cur_frm.set_df_property("from_warehouse", "hidden", 1);

	}
	else{
		cur_frm.set_df_property("material_transfer_type", "read_only", 0) 
		cur_frm.set_df_property("from_warehouse", "hidden", 0);

	}
	var t=cur_frm.doc.material_transfer_type ;
		if(frm.doc.docstatus == 1 && frm.doc.mt_status != "Received" && frm.doc.material_transfer_type=="Send") {
			frm.add_custom_button(__('Receive Stock'), function() {
				frappe.model.with_doctype('Material Transfer', function() {
					var mr = frappe.model.get_new_doc('Material Transfer');
					var items = frm.get_field('items').grid.get_selected_children();
					// mr.items = frm.doc.items
					// mr.material_transfer_type = frm.doc.material_transfer_type
					mr.material_transfer_type = "Receive"
					mr.reference_of_send_entry = frm.doc.name
					mr.receiver = frm.doc.receiver
					mr.from_warehouse = "Transit - SAM - DP"
					mr.receiver_warehouse = frm.doc.receiver_warehouse

					mr.to_warehouse = frm.doc.receiver_warehouse
					if(!items.length) {
						items = frm.doc.items;
					}
					items.forEach(function(item) {
						var mr_item = frappe.model.add_child(mr, 'items');
						mr_item.item_code = item.item_code;
						mr_item.item_name = item.item_name;
						mr_item.uom = item.uom;
						mr_item.stock_uom = item.stock_uom;
						mr_item.transfer_qty = item.transfer_qty;
						mr_item.conversion_factor = item.conversion_factor;
						mr_item.item_group = item.item_group;
						mr_item.description = item.description;
						mr_item.image = item.image;
						mr_item.qty = item.qty;
						mr_item.warehouse = item.s_warehouse;
						mr_item.required_date = frappe.datetime.nowdate();
					});
					frappe.set_route('Form', 'Material Transfer', mr.name);
				});
			});
		}

});
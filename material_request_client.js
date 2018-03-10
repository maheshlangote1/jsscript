
frappe.ui.form.on('Material Request', {
	refresh: function(frm) {
		var me = this;
		if(frm.doc.material_request_type=="Material Transfer" && !cint(frm.doc.is_local)) {
			cur_frm.add_custom_button(__("Create IBST"),
				function() {
							console.log("in material_transfer");
							cur_frm.cscript.make_material_transfer_custom(frm.doc.warehouse);

				})
			};

	},
});
cur_frm.cscript.make_material_transfer_custom = function(frm) {
		console.log("in material_transfer");	//

		frappe.model.open_mapped_doc({
			method: "criscoconsulting.criscoconsulting.doctype.material_transfer.material_transfer.make_stock_entry_custom",
			frm: cur_frm
		});

}
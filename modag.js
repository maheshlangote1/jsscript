// cur_frm.events.get_outstanding_documents(cur_frm);

frappe.ui.form.on("Payment Entry", {
	branch: function(){
			
				cur_frm.set_value("sales_person","");
	},
	validate: function(frm) {
	console.log("hi");

	},
		get_outstanding_documents: function(frm) {
		frm.clear_table("references");
		console.log("in new fasdasd");
		if(!frm.doc.party) return;

		frm.events.check_mandatory_to_fetch(frm);
		var company_currency = frappe.get_doc(":Company", frm.doc.company).default_currency;

		return  frappe.call({
			method: 'erpnext.accounts.doctype.payment_entry.payment_entry.get_outstanding_reference_documents',
			async:false,
			args: {
				args: {
					"posting_date": frm.doc.posting_date,
					"company": frm.doc.company,
					"party_type": frm.doc.party_type,
					"payment_type": frm.doc.payment_type,
					"party": frm.doc.party,
					"party_account": frm.doc.payment_type=="Receive" ? frm.doc.paid_from : frm.doc.paid_to
				}
			},
			callback: function(r, rt) {
				if(r.message) {
					var total_positive_outstanding = 0;
					var total_negative_outstanding = 0;
					sales_person = "ssss";
					$.each(r.message, function(i, d) {
							console.log("d");
							console.log(d);
							
							// a = frappe.db.get_value("Sales Invoice",d.voucher_no,"sales_person");
							aa = 'a333'
							frappe.call({
				               method: "frappe.client.get_value",
				               async:false,
				               args: {
				                   doctype: "Sales Invoice",
				                   fieldname: "sales_person",
				                   filters: { name: d.voucher_no },
				               },
				                  callback: function(res){
				                     if (res && res.message){
				                          console.log(res.message['sales_person']);
				                          aa = res.message['sales_person'];
				                          // return res.message['sales_person'];
				                          // return res.message['user_id'];
				                      }
				                  }      
				           	});

							if(aa==cur_frm.doc.sales_person){
							}
							else{
								return;
							}
							
							
							var c = frm.add_child("references");
							c.reference_doctype = d.voucher_type;
							c.reference_name = d.voucher_no;
							c.due_date = d.due_date
							c.total_amount = d.invoice_amount;
							c.outstanding_amount = d.outstanding_amount;
							c.bill_no = d.bill_no;

							if(!in_list(["Sales Order", "Purchase Order", "Expense Claim"], d.voucher_type)) {
								if(flt(d.outstanding_amount) > 0)
									total_positive_outstanding += flt(d.outstanding_amount);
								else
									total_negative_outstanding += Math.abs(flt(d.outstanding_amount));
							}

							var party_account_currency = frm.doc.payment_type=="Receive" ?
								frm.doc.paid_from_account_currency : frm.doc.paid_to_account_currency;

							if(party_account_currency != company_currency) {
								c.exchange_rate = d.exchange_rate;
							} else {
								c.exchange_rate = 1;
							}
							if (in_list(['Sales Invoice', 'Purchase Invoice', "Expense Claim"], d.reference_doctype)){
								c.due_date = d.due_date;
							}

					});

					if(
						(frm.doc.payment_type=="Receive" && frm.doc.party_type=="Customer") ||
						(frm.doc.payment_type=="Pay" && frm.doc.party_type=="Supplier")  ||
						(frm.doc.payment_type=="Pay" && frm.doc.party_type=="Employee")
					) {
						if(total_positive_outstanding > total_negative_outstanding)
							frm.set_value("paid_amount",
								total_positive_outstanding - total_negative_outstanding);
					} else if (
						total_negative_outstanding &&
						total_positive_outstanding < total_negative_outstanding
					) {
						frm.set_value("received_amount",
							total_negative_outstanding - total_positive_outstanding);
					}
				}

				frm.events.allocate_party_amount_against_ref_docs(frm,
					(frm.doc.payment_type=="Receive" ? frm.doc.paid_amount : frm.doc.received_amount));
			}
		});
	},
	get_outstanding_entries: function(){
				cur_frm.events.get_outstanding_documents(cur_frm);
	}

});

cur_frm.fields_dict['sales_person'].get_query = function(doc){
		return{filters: [
		[                'Sales Person', 'branch', 'in', doc.branch
		]]
		}
}
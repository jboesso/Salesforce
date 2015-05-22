{!REQUIRESCRIPT("/soap/ajax/33.0/connection.js")} 
{!REQUIRESCRIPT("//code.jquery.com/jquery-2.1.4.min.js")}

var recordsLeads = {!GETRECORDIDS($ObjectType.Lead)};
var recordsContacts = {!GETRECORDIDS($ObjectType.Contact)}
var newRecords = [];
var uniqueDomains = [];
var fullContacts = [];
var cLeads = recordsLeads;
var countSuccess = [];
var count = 0;



function finishHim() {
	count++;
	console.log(count, cLeads, "logando")
	    // Da reload na pagina
	if (count == cLeads) {
	    alert("Foram encontrados "+countSuccess.length+" leads que já são clientes\ne "+(recordsLeads.length-countSuccess.length)+" são novos ou não são Outbound")
	    result = sforce.connection.update(leads);
	    console.log('count final',count, result);
	    window.location.reload();
	};
}

if (recordsLeads.length < 1) {
    alert("Por favor selecione algum lead");
} 	else {
	    var r = confirm("Clique ''OK'' para desqualificar os leads que já são clientes");
	    if (r) {
		    		var leads = sforce.connection.retrieve("Id,domain__c,LeadSource,Status,Motivo__c", "Lead", recordsLeads);
					console.log(leads, leads[0].LeadSource)
			 		var contacts = sforce.connection.query("select Id, domain__c from Contact where domain__c != null");
			        fullContacts = fullContacts.concat(contacts.records)
			        console.log(contacts.records.length)
			        //var contactsClientesInativos = sforce.connection.query("select Id, domain__c from Contact where domain__c != null AND Account.Type = 'Cliente Inativo'");
			        var limit = 2000
			        var pagination = Math.ceil(contacts.size / limit)
			        for ( var cc = 0; cc < pagination;cc++) {
			        	//var startLine = limit * cc
			        	var contactsClientes = sforce.connection.query("select Id, domain__c from Contact where domain__c != null OFFSET " + limit)
			        	fullContacts = fullContacts.concat(contactsClientes.records);
			        	console.log(fullContacts.length)
		        	}

		    		for (var i=0;i<fullContacts.length;i++) {
						if (uniqueDomains.indexOf(fullContacts[i].domain__c) == -1){
			        	uniqueDomains.push(fullContacts[i].domain__c);		
						} 
					}

					var cLeads = recordsLeads.length
					for (var n = 0; n < cLeads; n++) {
	        	    	var domain = leads[n].domain__c;
		            	console.log(leads[n].Id,"Salesforce",leads[n].domain__c, n)
		            	if (leads[n].domain__c && leads[n].domain__c !== null && leads[n].LeadSource == 'Outbound') {
			                // Le a pagina do usuário procurando pelo URL do facebook    
					        if (uniqueDomains.indexOf(leads[n].domain__c) != -1 ) {
								leads[n].Status = 'Desqualificado';
								leads[n].Motivo__c = 'Cliente';
								countSuccess.push('Cliente');
								console.log("log indexof leads",leads[n].domain__c)
								finishHim();
							} else {
			              	  finishHim();
			         		} 
					   	} else {
			                finishHim();
	        			}
					}
				}	
			}
		
	

               
		        
		        /*
					for (var i=0;i<contactsClientes.records.length;i++) {
						
						if (uniqueDomainsClientes.indexOf(contactsClientes.records[i].domain__c) == -1){
				        	uniqueDomainsClientes.push(contactsClientes.records[i].domain__c);		
						}
					}

					var uniqueDomainsClientesInativos = [];
		        
					for (var i=0;i<contactsClientesInativos.records.length;i++) {
						
						if (uniqueDomainsClientesInativos.indexOf(contactsClientesInativos.records[i].domain__c) == -1){
				        	uniqueDomainsClientesInativos.push(contactsClientesInativos.records[i].domain__c);		
						}
					}
	console.log(contactsClientes.records.length)
	console.log(uniqueDomainsClientes.length)
	console.log(leads.domain__c)
	console.log(contactsClientesInativos.records.length)
	console.log(uniqueDomainsClientesInativos.length)
*/
//	}
//};







// Codigo para conversão do lead
/*var account = new sforce.SObject("Account");
account.Name = "convert lead sample";
account.Phone = "2837484894";
result = sforce.connection.create([account]);
account.Id = result[0].id;

var lead = new sforce.SObject("Lead");
lead.Country = "US";
lead.Description = "This is a description";
lead.Email = "someone@somewhere.com";
lead.FirstName = "first";
lead.LastName = "last";
lead.Company = account.Name;
result = sforce.connection.create([lead]);
lead.Id = result[0].id;

var convert = new sforce.LeadConvert();
convert.accountId = account.Id;
convert.leadId = lead.Id;
convert.convertedStatus = "Qualified";

result = sforce.connection.convertLead([convert]);
if (result[0].getBoolean("success")) {
  log("lead converted " + result[0]);
} else {
  log("lead convert failed " + result[0]);
}*/